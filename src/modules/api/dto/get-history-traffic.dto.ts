export class GetHistoryTrafficDto {
  date: Date;

  days: number;

  macs?: string;

  store_id: number;

  group_filtered?: number;
}
