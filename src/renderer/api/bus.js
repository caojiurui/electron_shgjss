import request from '@/utils/request-util'

let busBase = "http://shanghaicity.openservice.kankanews.com"

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
		url: busBase + '/public/bus/mes/sid/'+roadCode+'/stoptype/'+(stopType || 0),
		method : 'get'
	})
}

