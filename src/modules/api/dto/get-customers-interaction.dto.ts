export class GetCustomerInteractionDto {
  start_date: Date;

  end_date: Date;

  channel_sn_list?: string[];

  store_id: number;
}
