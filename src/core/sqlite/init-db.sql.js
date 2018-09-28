import DBUtil from './db-utils'

const Q = require('q')
import { getRoadDictsArray } from '../constants/bus-constant'


const InitBusTables = () => {
	//创建字典表
	let createDictTableSql = `CREATE TABLE IF NOT EXISTS dict (
								dict_id INTEGER PRIMARY KEY AUTOINCREMENT,
								name CHAR(50) NOT NULL,
								sequence INTEGER DEFAULT '1',	    -- 序号
								type INTEGER NOT NULL				      -- 字典类型,1:bus线路
							)`;

	//创建线路表
	let createRoadTableSql = `CREATE TABLE IF NOT EXISTS bus_road (
								bus_road_id INTEGER PRIMARY KEY ,             -- 线路id，存放dictId
								code CHAR(50) NOT NULL,				                 -- 线路code（接口用）
								z_first_last_station CHAR(100) NOT NULL,		   -- 首末站(正方向)
								f_first_last_station CHAR(200)	NOT NULL,	     -- 首末站(反方向)
								z_first_last_time CHAR(100) NOT NULL,		       -- 起点站首末车时间	05:00-22:30 (正反向)
								f_first_last_time CHAR(200)	NOT NULL	         -- 终点站首末车时间 05:00-22:30 (反方向)
							)`;

	//创建站点表
	let createStationTableSql = `CREATE TABLE IF NOT EXISTS bus_road_station (
								bus_road_station_id INTEGER PRIMARY KEY AUTOINCREMENT,
								bus_road_id INTEGER NOT NULL,	
								stoptype INTEGER NOT NULL,				-- 线路类型 （0：反方向,1:正方向）
								num INTEGER NOT NULL,				      -- 序号
								name CHAR(50) NOT NULL            --站点名
							)`;

	//创建bus提醒表
	let createRemindTableSql = `CREATE TABLE IF NOT EXISTS bus_road_remind (
									bus_road_remind_id INTEGER PRIMARY KEY AUTOINCREMENT,
									bus_road_id INTEGER NOT NULL,	
									bus_road_station_id INTEGER NOT NULL, 	-- 到站站点id
									status INTEGER	DEFAULT '1',			      -- 提醒状态 0：不提醒，1：提醒
									remind_time CHAR(50) DEFAULT NULL,	    -- 提醒时间
									timing INTEGER	DEFAULT '3',			      -- 提前多少分钟开始提醒
									remark CHAR(200),									      -- 备注
									next_remind_time TimeStamp DEFAULT NULL , --下次提醒时间（关闭后,结束本次线路提醒）
									create_datetime TimeStamp DEFAULT CURRENT_TIMESTAMP  --创建时间
								)`;

	let insertRoadSql = `
			INSERT INTO "bus_road" ("bus_road_id", "code", "z_first_last_station", "f_first_last_station", "z_first_last_time", "f_first_last_time", "ROWID") VALUES (496, 'e8b5830479ad03f2c48613617ca1eaa7', '祁华路(葑润华庭)-株洲路广中路', '株洲路广中路-祁华路(葑润华庭)', '05:30-22:30', '05:30-23:00', 496) `;
	let insertRemindSql = `
			INSERT INTO "bus_road_remind" ("bus_road_remind_id", "bus_road_id", "bus_road_station_id", "status", "remind_time", "timing", "remark", "next_remind_time", "create_datetime", "ROWID") VALUES (1, 496, 28, 1, '18:40', 15, '', NULL, '2018-09-28 00:56:05', 1) `;
	let insertStationsSql = `
			INSERT INTO "main"."bus_road_station" ("bus_road_station_id", "bus_road_id", "stoptype", "num", "name", "ROWID") VALUES 
		(1, 496, 1, 1, '祁华路(葑润华庭)', 1),
		(2, 496, 1, 2, '祁华路祁连山路', 2),
		(3, 496, 1, 3, '祁连山路锦秋路', 3),
		(4, 496, 1, 4, '锦秋路(上海大学)', 4),
		(5, 496, 1, 5, '锦秋路瑞康路', 5),
		(6, 496, 1, 6, '南陈路四号桥', 6),
		(7, 496, 1, 7, '南陈路上大路', 7),
		(8, 496, 1, 8, '环镇北路南陈路', 8),
		(9, 496, 1, 9, '乾溪新村', 9),
		(10, 496, 1, 10, '环镇北路场联路', 10),
		(11, 496, 1, 11, '场联路环镇北路', 11),
		(12, 496, 1, 12, '场联路乾溪路', 12),
		(13, 496, 1, 13, '沪太路汶水路(长途客运北站)', 13),
		(14, 496, 1, 14, '余庆桥(沪太路)', 14),
		(15, 496, 1, 15, '龙潭(沪太路)', 15),
		(16, 496, 1, 16, '沪太路志丹路', 16),
		(17, 496, 1, 17, '广中西路沪太路', 17),
		(18, 496, 1, 18, '广中西路运城路', 18),
		(19, 496, 1, 19, '广中西路万荣路', 19),
		(20, 496, 1, 20, '广中西路共和新路', 20),
		(21, 496, 1, 21, '广中路平型关路', 21),
		(22, 496, 1, 22, '广中路广粤路', 22),
		(23, 496, 1, 23, '株洲路广中路', 23),
		(24, 496, 0, 1, '株洲路广中路', 24),
		(25, 496, 0, 2, '广中路平型关路', 25),
		(26, 496, 0, 3, '广中西路共和新路', 26),
		(27, 496, 0, 4, '广中西路万荣路', 27),
		(28, 496, 0, 5, '广中西路运城路', 28),
		(29, 496, 0, 6, '广中西路沪太路', 29),
		(30, 496, 0, 7, '龙潭(沪太路)', 30),
		(31, 496, 0, 8, '余庆桥(沪太路)', 31),
		(32, 496, 0, 9, '沪太路汶水路(长途客运北站)', 32),
		(33, 496, 0, 10, '场联路乾溪路', 33),
		(34, 496, 0, 11, '场联路环镇北路', 34),
		(35, 496, 0, 12, '环镇北路场联路', 35),
		(36, 496, 0, 13, '乾溪新村', 36),
		(37, 496, 0, 14, '环镇北路南陈路', 37),
		(38, 496, 0, 15, '南陈路上大路', 38),
		(39, 496, 0, 16, '南陈路四号桥', 39),
		(40, 496, 0, 17, '锦秋路南陈路', 40),
		(41, 496, 0, 18, '锦秋路瑞康路', 41),
		(42, 496, 0, 19, '祁连山路锦秋路', 42),
		(43, 496, 0, 20, '祁华路祁连山路', 43),
		(44, 496, 0, 21, '祁华路(葑润华庭)', 44) `

	//检测字典表是否存在,不存在则创建和新增数据
	DBUtil.checkTableExist('dict').then(() => {   //存在
	}, () => {  //不存在
		DBUtil.createTable(createDictTableSql).then(() => {
			DBUtil.insertObjs('dict', getRoadDictsArray()).then(() => {
				console.log('插入初始化数据成功')
			})
		})
	})

	let def = Q.defer()
	//all 异步, allSettled 同步
	Q.allSettled([DBUtil.createTable(createRoadTableSql),
												DBUtil.createTable(createStationTableSql),
												DBUtil.createTable(createRemindTableSql)]).then(() => {
					Q.allSettled([DBUtil.insert(insertRoadSql),
												DBUtil.insert(insertStationsSql),
												DBUtil.insert(insertRemindSql)]).then(()=>{
						def.resolve()
						console.log("初始化插入数据成功")
					},(err)=>{
						def.reject(err)
					})
		console.log("初始化创建表成功")
	},(err)=>{
		def.reject(err)
	})

	return def.promise
}

//检查表是否存在
let CheckTableIsExist = ()=>{
	let def = Q.defer()
	DBUtil.checkTableExist(['dict','bus_road','bus_road_station','bus_road_remind']).then(()=>{
		def.resolve()
		console.log("表存在成功")
	},()=>{
		InitBusTables().then(()=>{
			def.resolve()
		},(err)=>{
			def.reject(err)
		})
	})
	return def.promise
}
export { InitBusTables,CheckTableIsExist }
