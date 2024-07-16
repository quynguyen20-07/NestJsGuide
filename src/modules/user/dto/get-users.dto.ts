import { IsEnum, IsOptional } from 'class-validator';

import { PageOptionsDto } from '@app/common/dtos';
import { StatusEnum } from '@Constant/enums';

export class GetUsersDto extends PageOptionsDto {
  storeName: string;
  
  brand: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status;
}
