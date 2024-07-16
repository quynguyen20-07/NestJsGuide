import { hashPassword } from '@Constant/hash-password';
import { BrandEntity } from '@app/modules/brand/entities';
import { RoleEntity } from '@app/modules/role/entities';
import { StoreEntity } from '@app/modules/store/entities';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { UserEntity } from '@app/modules/user/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,

    private readonly configService: ConfigService
  ) {}

  async seed(): Promise<any> {
    await this.userRepository.query(`TRUNCATE users RESTART IDENTITY CASCADE;`);

    const roles: RoleEntity[] = await this.roleRepository.find({
      where: {
        deletedAt: null,
      },
    });

    const manager = await this.storeRepository.find({
      where: {
        id: In([1, 2, 3, 4]),
      },
    });

    const storeManager = await this.storeRepository.find({
      where: {
        id: In([3, 4]),
      },
    });
    const marketing_qaqc = await this.storeRepository.find({
      where: {
        id: In([4]),
      },
    });

    const brand = await this.brandRepository.find();

    const password = await hashPassword(this.configService.get<string>('USER_PASSWORD'));

    const users: CreateUserDto[] = [
      {
        username: 'manager',
        password: password,
        phone: '0944560562',
        role: roles[0],
        brand: brand[0],
        stores: manager,
      },
      {
        username: 'store',
        password: password,
        phone: '0944663562',
        role: roles[1],
        brand: brand[0],
        stores: storeManager,
      },
      {
        username: 'marketing',
        password: password,
        phone: '0944562562',
        role: roles[2],
        brand: brand[0],
        stores: marketing_qaqc,
      },
      {
        username: 'qa_qc',
        password: password,
        phone: '0944563532',
        role: roles[3],
        brand: brand[0],
        stores: marketing_qaqc,
      },
      {
        username: 'brand_manager',
        password: password,
        phone: '0954563532',
        role: roles[4],
        brand: brand[0],
        stores: manager,
      },
    ];

    await this.userRepository.save(users);
  }

  async drop(): Promise<any> {
    return this.userRepository.query(`TRUNCATE users RESTART IDENTITY CASCADE;`);
  }
}
