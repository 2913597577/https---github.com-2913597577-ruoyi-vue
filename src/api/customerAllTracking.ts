import request from '@/utils/request'

export interface TrackingRecord {
  id: number;
  customerId: number;
  customerName: string;
  legalSupportId: number;
  legalSupportName: string;
  trackingTime: string;
  nextTrackingTime: string;
  trackingType: number;
  remark: string;
}

export interface TrackingQueryParams {
  customerId?: string;
  legalSupportId?: string;
  trackingType?: number;
  trackingTime?: string;
  nextTrackingTime?: string;
  pageNum: number;
  pageSize: number;
}

export interface TrackingResponse {
  total: number;
  data: TrackingRecord[];
}

export function getAllTrackingRecords(params: TrackingQueryParams) {
  return request({
    url: '/common/getAllTrackingRecords',
    method: 'get',
    params
  });
}