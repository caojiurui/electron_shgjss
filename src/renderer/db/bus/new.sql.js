import DBUtil from '../../../core/sqlite/db-utils'
import { DICT_TYPE } from '../../../core/constants/constant'
const Q = require('q')


//查询所有线路,返回数组[{dictId,name}]
const getAllBusRoads = () => {
	//创建字典表
	let sql = ` SELECT 
								dict_id id, 
								name
							FROM dict 
						  WHERE type = ${DICT_TYPE.DICT_TYPE_BUS_ROAD} 
						  ORDER BY sequence ASC`;

	return DBUtil.selectAll(sql)
}

//查询线路详情
const getRoadDetailById = (id) => {
	let def = Q.defer()
	//查找字典表
	let roadSql = ` SELECT * FROM bus_road WHERE bus_road_id = ${id}`;
	DBUtil.selectOne(roadSql).then((road)=>{
		if(road){
			let roadStationSql = ` SELECT * FROM bus_road_station WHERE bus_road_id = ${id}`;
			DBUtil.selectAll(roadStationSql).then((stations)=>{
				def.resolve({road,stations})
			},(err)=> {
				def.reject(err)
			})
		}else{
			def.reject()
		}
	})
	return def.promise
}

//插入线路站点数组 (bus_road_remind)
const insertBusRoadStations = (stationObjs) => {
	return DBUtil.insertObjs('bus_road_station',stationObjs);
}

//插入线路详情，线路和站点 (bus_road,bus_road_remind)
const insertBusRoadDetail = (busRoadObj,stationObjs) => {
	//all 异步, allSettled 同步
	return Q.allSettled([DBUtil.insertObj('bus_road',busRoadObj),
			DBUtil.insertObjs('bus_road_station',stationObjs)]);
}

//插入提醒表
const insertBusRoadRemind = (roadRemindObj,stoptype,arrivalStationName) => {
	let def = Q.defer()
	//通过站点名称查找id
	let stationSql = `  SELECT * FROM bus_road_station 
										  WHERE bus_road_id = ${roadRemindObj.bus_road_id} and 
										        stoptype = ${stoptype} and
										        name = '${arrivalStationName}'`;
	DBUtil.selectOne(stationSql).then((station)=>{
		roadRemindObj.bus_road_station_id = station.bus_road_station_id
		DBUtil.insertObj('bus_road_remind',roadRemindObj).then(()=>{
			def.resolve()
		},(err)=> {
			def.reject(err)
		})
	},(err)=> {
		def.reject(err)
	})
	return def.promise
}

export {getAllBusRoads,getRoadDetailById,insertBusRoadStations,insertBusRoadDetail,insertBusRoadRemind}
