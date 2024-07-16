import { Privilege, PrivilegeGuard } from '@app/guards/privileges.guard';
import { Body, CacheInterceptor, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  GetCustomerInteractionDto,
  GetDataByStroreId,
  GetHeadmapDto,
  GetHistoryTrafficDto,
  GetRecordImages,
  GetStaffPerformance,
  GetStoreListDto,
  GetTrafficComparisons,
  GetTrafficDto,
  GetVipCustomerDto,
  GetVipTrafficDto,
  GetVisitStatisticDto,
} from './dto';
import { RedisService } from './redis.service';
import { ChartPermission } from '@Constant/enums';
import { GetFacesRecordDto } from './dto/get-faces-record.dto';
import { GetRecognitionRecordImages } from './dto/get-recognition-record.dto';
import { GetDashboardListDto } from './dto/get-dashboard-list.dto';

@Controller('dashboard')
@UseGuards(PrivilegeGuard, JwtAuthGuard)
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('/history-traffic')
  @Privilege(ChartPermission.HISTORY_TRAFFIC)
  @UseInterceptors(CacheInterceptor)
  async getHistoryTraffic(@Body() getHistoryTrafficDto: GetHistoryTrafficDto): Promise<any> {
    return await this.redisService.getHistoryTraffic(getHistoryTrafficDto);
  }

  @Post('/traffic')
  @Privilege(ChartPermission.TRAFFIC_STATISTICS)
  @UseInterceptors(CacheInterceptor)
  async getTraffic(@Body() trafficDto: GetTrafficDto): Promise<any> {
    return await this.redisService.getTraffic(trafficDto);
  }

  @Post('/vip-traffic')
  @Privilege(ChartPermission.TRAFFIC_STATISTICS)
  @UseInterceptors(CacheInterceptor)
  async getVipTraffic(@Body() vipTrafficDto: GetVipTrafficDto): Promise<any> {
    return await this.redisService.getVipTraffic(vipTrafficDto);
  }

  @Post('/headmap')
  @Privilege(ChartPermission.HEADMAP)
  @UseInterceptors(CacheInterceptor)
  async getHeatmap(@Body() getHeadmapDto: GetHeadmapDto): Promise<any> {
    return await this.redisService.getHeatmap(getHeadmapDto);
  }

  @Post('/visit-statistic')
  @Privilege(ChartPermission.FREQUENCY)
  @UseInterceptors(CacheInterceptor)
  async getVisitStatistics(@Body() getVisitStatisticDto: GetVisitStatisticDto): Promise<any> {
    return await this.redisService.getVisitStatistics(getVisitStatisticDto);
  }

  @Post('/traffic-comparison')
  @Privilege(ChartPermission.VISITORS_VISITS)
  @UseInterceptors(CacheInterceptor)
  async getTrafficComparisons(@Body() getTrafficComparisons: GetTrafficComparisons): Promise<any> {
    return await this.redisService.getTrafficComparisons(getTrafficComparisons);
  }

  @Post('/device-total')
  @Privilege(ChartPermission.DEVICES_TOTALS)
  @UseInterceptors(CacheInterceptor)
  async getDeviceTotal(@Body() getDeviceTotal: GetDataByStroreId): Promise<any> {
    return await this.redisService.getDeviceTotal(getDeviceTotal);
  }

  @Post('/visit-record')
  @Privilege(ChartPermission.LIVE_FACE)
  @UseInterceptors(CacheInterceptor)
  async visitingRecord(@Body() getRecordImages: GetRecordImages): Promise<any> {
    return await this.redisService.getVisitingRecord(getRecordImages);
  }

  @Post('/recognition-record')
  @Privilege(ChartPermission.SUBJECT_NOTIFICATION)
  @UseInterceptors(CacheInterceptor)
  async recognitionRecord(@Body() getRecordImages: GetRecognitionRecordImages): Promise<any> {
    return await this.redisService.getRecognitionRecord(getRecordImages);
  }

  @Post('/customer-interaction')
  @Privilege(ChartPermission.CUSTOMMER_INTERACTION)
  @UseInterceptors(CacheInterceptor)
  async getCustomerInteraction(@Body() getCustomerInteractionDto: GetCustomerInteractionDto): Promise<any> {
    return await this.redisService.getCustomerInteraction(getCustomerInteractionDto);
  }

  @Post('/dwell-camera')
  @Privilege(ChartPermission.DWELL_CAMERA)
  @UseInterceptors(CacheInterceptor)
  async getDwellCamera(@Body() getVipCustomerDto: GetVipCustomerDto): Promise<any> {
    return await this.redisService.getDwellCamera(getVipCustomerDto);
  }

  @Post('/vip-customer')
  @Privilege(ChartPermission.CUSTOMER_STAFF)
  @UseInterceptors(CacheInterceptor)
  async getVipCustomer(@Body() getVipCustomerDto: GetVipCustomerDto): Promise<any> {
    return await this.redisService.getVipCustomer(getVipCustomerDto);
  }

  @Post('/staff-performance')
  @Privilege(ChartPermission.CUSTOMER_STAFF)
  @UseInterceptors(CacheInterceptor)
  async getStaffPerformance(@Body() getStaffPerformance: GetStaffPerformance): Promise<any> {
    return await this.redisService.getStaffPerformance(getStaffPerformance);
  }

  @Post('/faces-record')
  @Privilege(ChartPermission.CUSTOMER_STAFF)
  @UseInterceptors(CacheInterceptor)
  async getFacesRecord(@Body() params: GetFacesRecordDto): Promise<any> {
    return await this.redisService.getFacesRecord(params);
  }

  @Post('/snap-record')
  @Privilege(ChartPermission.CUSTOMER_STAFF)
  @UseInterceptors(CacheInterceptor)
  async getSnapRecord(@Body() params: GetFacesRecordDto): Promise<any> {
    return await this.redisService.getSnapRecord(params);
  }

  // not chart
  @UseInterceptors(CacheInterceptor)
  @Post('/login-info')
  async getLoginInfo(): Promise<any> {
    return await this.redisService.getLoginInfo();
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/macs-device')
  async getMacsByFloor(@Body() getMacsByFloor: GetDataByStroreId): Promise<any> {
    return await this.redisService.getMacsByFloor(getMacsByFloor);
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/domain')
  async getDomain(): Promise<any> {
    return await this.redisService.getDomain();
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/store-list')
  async getStoreList(@Body() getDashboardListDto: GetStoreListDto): Promise<any> {
    return await this.redisService.getStoreList(getDashboardListDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/store-detail')
  async getStoreDetail(@Body() getDashboardDetails: GetDataByStroreId): Promise<any> {
    return await this.redisService.getStoreDetail(getDashboardDetails);
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/detail-by-floor')
  async getDetailByFloor(@Body() getDetailByFloor: GetDataByStroreId): Promise<any> {
    return await this.redisService.getDetailByFloor(getDetailByFloor);
  }

  @UseInterceptors(CacheInterceptor)
  @Post('/dashboard-list')
  async getDashboardList(@Body() getDashboardList: GetDashboardListDto): Promise<any> {
    return await this.redisService.getDashboardList(getDashboardList);
  }
}
