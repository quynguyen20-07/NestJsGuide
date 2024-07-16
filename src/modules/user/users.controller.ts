import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { UserDto } from './dto/user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role, RoleGuard } from '@app/guards/roles.guard';
import { RolesEnum } from '@Constant/enums';

@UseGuards(JwtAuthGuard, RoleGuard)
@Role(RolesEnum.GENERAL_MANAGEMENT, RolesEnum.BRAND_MANAGEMENT)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Patch('reset-password/:id')
  async resetPassword(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<UserDto>> {
    return await this.usersService.resetPassword(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseItem<UserDto>> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<null>> {
    return await this.usersService.deleteUser(id);
  }

  @Get()
  async getUsers(@Query() getUsersDto: GetUsersDto): Promise<ResponsePaginate<UserDto>> {
    return await this.usersService.getUsers(getUsersDto);
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<ResponseItem<UserDto>> {
    return await this.usersService.getUser(id);
  }
}
