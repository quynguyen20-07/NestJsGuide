export class GetSnapRecordDto {
  starttime: Date;

  endtime: Date;

  store_id: number;

  pid?: number;

  page?: number;

  limit?: number;

  subject_group_list?: number[];

  sn_list?: number[];
}
