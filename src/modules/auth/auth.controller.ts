import { Body, Controller, Get, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenPayloadDto } from './dto/response/userPayload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  async refresh(@Body() body: any, @Headers() headers: any) {
    return await this.authService.refreshToken(body, headers);
  }

  @Post('get-token-db')
  async getTokenDb(@Body() params: TokenPayloadDto): Promise<any> {
    return this.authService.getTokenDb(params);
  }

  @Get('get-only-token')
  async getOnlyToken(): Promise<any> {
    return this.authService.getOnlyToken();
  }

  @Get('get-dashboard')
  async getTokenDashboard(): Promise<any> {
    return this.authService.getTokenDashboard();
  }

  // @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() params: TokenPayloadDto) {
    return this.authService.logout(params);
  }
}
