import DBUtil from '../../../core/sqlite/db-utils'

//查询所有提醒,返回数组[]
const getAllRoadRemindList = () => {
	let sql = ` SELECT 
								brr.bus_road_remind_id id,
								brr.status,
								brr.remind_time,
								brr.timing,
								brr.remark,
								brr.next_remind_time,
								br.z_first_last_station z_fls,
								br.f_first_last_station f_fls,
								br.z_first_last_time z_flt,
								br.f_first_last_time f_flt,
								brs.name station_name,
								brs.stoptype,
								d.name road_name
							FROM
								bus_road_remind brr
								INNER JOIN bus_road_station brs ON brr.bus_road_station_id = brs.bus_road_station_id
								INNER JOIN bus_road br ON brr.bus_road_id = br.bus_road_id
								INNER JOIN dict d ON brr.bus_road_id = d.dict_id
							ORDER BY 
								brr.create_datetime DESC `;

	return DBUtil.selectAll(sql)
}

//获取可提醒列表
const getScheduleRemindList = () => {
	let sql = ` SELECT 
								brr.bus_road_remind_id id,
								brr.timing,
								br.code,
								brs.num,
								brs.stoptype
							FROM
								bus_road_remind brr
								INNER JOIN bus_road_station brs ON brr.bus_road_station_id = brs.bus_road_station_id
								INNER JOIN bus_road br ON brr.bus_road_id = br.bus_road_id
							WHERE 
								brr.status = 1 AND
								(
									brr.remind_time IS NULL OR
									brr.remind_time = '' OR
									strftime('%H:%M','now','localtime') > brr.remind_time 
								) AND 
								(
									brr.next_remind_time IS NULL OR
									datetime('now','localtime') > brr.next_remind_time 
								) `
	return DBUtil.selectAll(sql)
}

//删除提醒
const deleteRoadRemindById = (id) => {
	return DBUtil.deleteByPK('bus_road_remind','bus_road_remind_id',id)
}

//停止提醒
const updateRemindStatusById = (id,status) => {
	return DBUtil.updateByCond('bus_road_remind',
								{status,next_remind_time : null},
								{'bus_road_remind_id':id})
}

//设置下次提醒时间
const updateNextRemindTimeById = (id,next_remind_time) => {
	return DBUtil.updateByCond('bus_road_remind',
								{next_remind_time},
								{'bus_road_remind_id':id})
}

//获取可提醒数量
const getRemindCount = () => {
	let sql = ` SELECT 
								count(1) count
							FROM
								bus_road_remind brr`;

	return DBUtil.selectOne(sql)
}
export {
				getAllRoadRemindList,
				getScheduleRemindList,
				getRemindCount,
				deleteRoadRemindById,
				updateRemindStatusById,
				updateNextRemindTimeById
		}
