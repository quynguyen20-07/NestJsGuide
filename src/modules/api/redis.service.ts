import { createSign } from '@app/helper/create-sign';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import {
  GetHistoryTrafficDto,
  GetTrafficDto,
  GetVipTrafficDto,
  GetHeadmapDto,
  GetVisitStatisticDto,
  GetTrafficComparisons,
  GetDataByStroreId,
  GetRecordImages,
  GetCustomerInteractionDto,
  GetVipCustomerDto,
  GetStaffPerformance,
  GetStoreListDto,
} from './dto';
import { handleMacs } from '@app/helper/handle-macs';
import { GetFacesRecordDto } from './dto/get-faces-record.dto';
import { GetRecognitionRecordImages } from './dto/get-recognition-record.dto';
import { GetDashboardListDto } from './dto/get-dashboard-list.dto';

@Injectable()
export class RedisService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache
  ) {}

  async getHistoryTraffic(params: GetHistoryTrafficDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));
      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/dashboard/dashboard/historyTraffic`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getTraffic(params: GetTrafficDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/aiApplication/report/traffic`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getLoginInfo(): Promise<any> {
    const cachedData = await this.cacheService.get('login');

    if (!cachedData) {
      try {
        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign({}, String(token));

        const response = await this.httpService
          .post(
            `${this.configService.get<string>('API_URL')}/common/user/getLoginInfo`,
            {},
            {
              headers: { token: String(token), sign: String(sign) },
            }
          )
          .toPromise();

        if (response.data.code === 1000) {
          await this.cacheService.set('traffic', response.data.data, { ttl: 10 });
        }
        return response.data.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getVipTraffic(params: GetVipTrafficDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/aiApplication/report/vipTraffic`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getMacsByFloor(params: GetDataByStroreId): Promise<any> {
    const cachedData = await this.cacheService.get('mac-devices');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/dashboard/setting/get_device_list_byfloor`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data) {
          await this.cacheService.set('mac-devices', response.data, { ttl: 10 });
        }

        return response.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getDomain(): Promise<any> {
    const cachedData = await this.cacheService.get('domain');

    if (!cachedData) {
      try {
        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign({}, String(token));

        const response = await this.httpService
          .post(
            `${this.configService.get<string>('API_URL')}/common/home/getDomain`,
            {},
            {
              headers: { token: String(token), sign: String(sign) },
            }
          )
          .toPromise();

        if (response.data.code === 1000) {
          await this.cacheService.set('domain', response.data.data, { ttl: 10 });
        }

        return response.data.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getStoreDetail(params: GetDataByStroreId): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/dashboard/setting/get_dashboard_details`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data) {
        return response.data;
      }

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getHeatmap(params: GetHeadmapDto): Promise<any> {
    const cachedData = await this.cacheService.get('headmap');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/dashboard/dashboard/heatmap`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data) {
          await this.cacheService.set('headmap', response.data, { ttl: 10 });
        }

        return response.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getVisitStatistics(params: GetVisitStatisticDto): Promise<any> {
    const cachedData = await this.cacheService.get('visit-statistics');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/aiApplication/report/visitStatistics`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data.code === 1000) {
          await this.cacheService.set('visit-statistics', response.data.data, { ttl: 10 });
        }

        return response.data.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getTrafficComparisons(params: GetTrafficComparisons): Promise<any> {
    const cachedData = await this.cacheService.get('traffic-comparisons');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/dashboard/dashboard/getTrafficComparisons`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data.code === 1000) {
          await this.cacheService.set('traffic-comparisons', response.data.data, { ttl: 10 });
        }

        return response.data.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getDeviceTotal(params: GetDataByStroreId): Promise<any> {
    const cachedData = await this.cacheService.get('device-total');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/dashboard/dashboard/getDeviceTotal`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data.code === 1000) {
          await this.cacheService.set('device-total', response.data.data, { ttl: 10 });
        }

        return response.data.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getVisitingRecord(params: GetRecordImages): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));
      
      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/v2/aiapp/subject/get_visiting_record`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data) {
        return response.data;
      }

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getRecognitionRecord(params: GetRecognitionRecordImages): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/aiApplication/subject/recognitionRecord`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data) {
        return response.data;
      }

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getStoreList(params: GetStoreListDto): Promise<any> {
    const cachedData = await this.cacheService.get('store-list');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/common/store/index`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data) {
          await this.cacheService.set('store-list', response.data, { ttl: 10 });
        }

        return response.data;
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getCustomerInteraction(params: GetCustomerInteractionDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/dashboard/personreid/customer_interaction`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDwellCamera(params: GetVipCustomerDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/dashboard/personreid/get_dwell`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getVipCustomer(params: GetVipCustomerDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/aiApplication/report/vipTraffic`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getStaffPerformance(params: GetStaffPerformance): Promise<any> {
    const cachedData = await this.cacheService.get('staff-performance');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/dashboard/personreid/staff_performance`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data.code === 1000) {
          return response.data.data;
        }
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getFacesRecord(params: GetFacesRecordDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/v2/system/notice/list`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getSnapRecord(params: GetFacesRecordDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/v2/aiapp/subject/get_recognition_record`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDetailByFloor(params: GetDataByStroreId): Promise<any> {
    const cachedData = await this.cacheService.get('detail-by-floor');

    if (!cachedData) {
      try {
        const requestBody = handleMacs(params);

        const token = await this.cacheService.get('dashboard-token');

        const sign = createSign(params, String(token));

        const response = await this.httpService
          .post(`${this.configService.get<string>('API_URL')}/dashboard/setting/get_device_list_byfloor`, requestBody, {
            headers: { token: String(token), sign: String(sign) },
          })
          .toPromise();

        if (response.data.code === 1000) {
          return response.data.data;
        }
      } catch (error) {
        const message = error?.response?.data?.error_description ?? 'An error occurred';
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    return cachedData;
  }

  async getDashboardList(params: GetDashboardListDto): Promise<any> {
    try {
      const requestBody = handleMacs(params);

      const token = await this.cacheService.get('dashboard-token');

      const sign = createSign(params, String(token));

      const response = await this.httpService
        .post(`${this.configService.get<string>('API_URL')}/dashboard/setting/get_dashboard_list`, requestBody, {
          headers: { token: String(token), sign: String(sign) },
        })
        .toPromise();

      if (response.data.code === 1000) {
        return response.data.data;
      }
    } catch (error) {
      const message = error?.response?.data?.error_description ?? 'An error occurred';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
