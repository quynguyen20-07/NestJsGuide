import { Expose } from 'class-transformer';

export class PermissionDto {
  id: number;

  name: string;

  @Expose()
  code: string;

  description: string;
}
