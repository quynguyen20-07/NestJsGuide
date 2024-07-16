import { IsEnum, IsOptional } from 'class-validator';

import { PageOptionsDto } from '@app/common/dtos';
import { StatusEnum } from '@Constant/enums';

export class GetStoreDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(StatusEnum)
  status;
}
