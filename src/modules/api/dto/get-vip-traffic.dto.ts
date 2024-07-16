export class GetVipTrafficDto {
  starttime: Date;

  endtime: Date;

  macs?: string;

  store_id: number;

  group_filtered?: string;

  subject_type_id?: number;
}
