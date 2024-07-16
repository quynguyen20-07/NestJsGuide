export class GetFacesRecordDto {
  start_time: Date;

  end_time: Date;

  store_id: number;

  pid?: number;

  page?: number;

  limit?: number;

  type?: number;

  subtype_list?: number[];

  subject_group_list?: number[];

  sn_list?: number[];
}
