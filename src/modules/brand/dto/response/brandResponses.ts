import { IsEnum, IsOptional } from 'class-validator';

import { PageOptionsDto } from '@app/common/dtos';
import { StatusEnum } from '@Constant/enums';

export class GetBrandResponses extends PageOptionsDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
