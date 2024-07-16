export class GetTrafficDto {
  starttime: Date;

  endtime: Date;

  days: number;

  macs?: string;

  store_id: number;

  group_filtered?: number;
}
