import { JwtPayload } from '@Constant/types';
import { ResponseItem } from '@app/common/dtos';
import { createSign, generateRandomString } from '@app/helper/create-sign';
import { handleMacs } from '@app/helper/handle-macs';
import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities';
import { UsersService } from '../user/users.service';
import { CredentialsDto } from './dto/request/credentials';
import { TokenPayloadDto, UserPayloadDto } from './dto/response/userPayload';
import { StatusEnum } from '@Constant/enums';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  private async _createToken(payload: JwtPayload, refresh = true) {
    const access_token = this.jwtService.sign(payload);
    if (refresh) {
      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN,
        expiresIn: process.env.JWT_EXPIRES_REFRESH,
      });

      await this.usersService.updateRfToken(payload.sub, {
        rfToken: refresh_token,
      });

      return {
        access_token,
        refresh_token,
      };
    } else {
      return {
        access_token,
      };
    }
  }

  async login(user: UserPayloadDto) {
    const brand = {
      ...user.brand,
    };
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      permission: user.role?.permissions?.map((item) => item.code),
      stores: user.stores.map((item) => item),
      brand: brand,
    };

    const randomString = await generateRandomString(30);
    const token = await this._createToken(payload);
    this.cacheService.set(`${randomString}`, token.access_token, { ttl: 10000 });
    return new ResponseItem({ data: token, username: user.username, session: randomString }, 'Login successfully');
  }

  async refreshToken(body: any, headers: any) {
    try {
      const payload = await this.jwtService.verify(body.refresh_token || headers.authorization.split(' ')[1], {
        secret: process.env.JWT_REFRESH_TOKEN,
      });

      const user = await this.usersService.getUserByRefresh(
        body.refresh_token || headers.authorization.split(' ')[1],
        payload.sub
      );

      if (!user) {
        return new HttpException('TOKEN_EXPIRED', HttpStatus.UNAUTHORIZED);
      }

      const newPayload = {
        sub: user.id,
        username: user.username,
      };
      const token = await this._createToken(newPayload, false);

      return {
        ...token,
      };
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new HttpException('TOKEN_EXPIRED', HttpStatus.UNAUTHORIZED);
      }
    }
  }

  async logout(params: TokenPayloadDto) {
    // await this.userRepository.update(req.userId, { rfToken: null });
    await this.cacheService.del(params.session);
    return new ResponseItem(null, 'Logout Successfully');
  }

  onApplicationBootstrap() {
    this.getOpenAuthorization();
    setInterval(async () => {
      const token = await this.cacheService.get('dashboard-token');
      if (token === null) {
        await this.cacheService.del('dashboard-token');
        this.getOpenAuthorization();
      }
    }, 1000);
  }

  async getTokenDb(params: TokenPayloadDto): Promise<any> {
    const token = await this.cacheService.get('dashboard-token');
    const accessToken = await this.cacheService.get(`${params.session}`);
    if (token === null) {
      await this.cacheService.del('dashboard-token');
      this.getOpenAuthorization();
    }

    return {
      token: token,
      accessToken: accessToken,
    };
  }

  async getOnlyToken(): Promise<any> {
    const token = await this.cacheService.get('dashboard-token');
    if (token === null) {
      await this.cacheService.del('dashboard-token');
      this.getOpenAuthorization();
    }

    return {
      token: token,
    };
  }

  async getTokenDashboard(): Promise<any> {
    const token = await this.cacheService.get('dashboard-token');
    if (token === null) {
      await this.cacheService.del('dashboard-token');
      this.getOpenAuthorization();
    }
    return {
      token: token,
    };
  }

  async getOpenAuthorization(): Promise<any> {
    const tokenData = {
      app_id: this.configService.get<string>('APP_ID'),
      secret_key: this.configService.get<string>('SECRET_KEY'),
    };

    const requestBody = handleMacs(tokenData);

    try {
      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/common/home/openAuthorization`, requestBody)
        .toPromise();

      if (response.data.code === 1000) {
        const sign = createSign({}, String(response.data.data.token));

        const dashboardTokenRes = await this.httpService
          .post(
            `${this.configService.get<string>('API_URL')}/dashboard/dashboard/getDashboardToken`,
            {},
            {
              headers: { token: String(response.data.data.token), sign: String(sign) },
            }
          )
          .toPromise();

        if (dashboardTokenRes) {
          const { data } = dashboardTokenRes.data;
          this.cacheService.set('dashboard-token', data.token, { ttl: 7200 });
          this.cacheService.set('exp_time', Date.now() + 7200 * 1000, { ttl: 7200 });
        }
        return dashboardTokenRes.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(credentialsDto: CredentialsDto): Promise<UserPayloadDto | null> {
    const user = await this.userRepository.findOne({
      where: {
        username: credentialsDto.username,
        status: StatusEnum.ACTIVE,
        deletedBy: null,
      },
      relations: ['role', 'stores', 'brand'],
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          role: 'user.role',
          permissions: 'role.permissions',
        },
      },
    });

    if (!user) throw new UnauthorizedException('Account incorrect');

    const comparePassword = await bcrypt.compareSync(credentialsDto.password, user.password);
    if (!comparePassword) throw new UnauthorizedException('Password incorrect');

    if (user && bcrypt.compareSync(credentialsDto.password, user.password)) {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        brand: user.brand,
        stores: user.stores,
      };
    }

    return null;
  }
}
