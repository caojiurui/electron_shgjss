import request from '@/utils/request-util'
import { API_DOMAINS } from '../../core/constants/constant'
let busBase = API_DOMAINS.BUS

//得到线路code
export function GetBusRoadCode(roadName) {
  return request({
    url: busBase + '/public/bus/get',
    method : 'post',
    data : { 'idnum' : roadName}
  })
}

//得到线路详情(正方向)
export function GetBusRoadDetail(roadCode,stopType) {
	return request({
		url: busBase + '/public/bus/mes/sid/'+roadCode+'?stoptype='+(stopType || 0),
		method : 'get'
	})
}

