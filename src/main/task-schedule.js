/**
 * 任务调度管理
 * http://www.cnblogs.com/zhongweiv/p/node_schedule.html
 */
import axios from 'axios'
import * as BusManageDBUtil from '../renderer/db/bus/manage.sql'
import { WinsManage } from './wins-manage'
import { TASK_SCHEDULE,API_DOMAINS } from '../core/constants/constant'
const taskSchedule = require('node-schedule')
const qs = require('qs');

/**
 * 任务对象，用于关闭
 */

const taskObjs = {
}


//任务调度管理
class TaskScheduleManage {

	constructor() {  }

	/**
	 * 关闭定时器
	 */
	static closeTask(taskName){
		let task = taskObjs[taskName]
		if(task && task.cancel){
			task.cancel();
			delete taskObjs[taskName]
		}
	}

	/**
	 * 开始定时器
	 */
	static startTask(taskName){
		let taskFunction = this['_start_schedule_'+taskName]
		if(taskFunction){
			taskFunction();
		}
	}
	/**
	 * [一]创建定时器
			  taskSchedule.scheduleJob 参数

			   1). Cron风格定时器
	          秒、分、时、日、月、周几
			 　　  '*'表示通配符，匹配任意，当秒是'*'时，表示任意秒数都触发，其它类推
			      例：每周1的1点1分30秒触发 ：'30 1 1 * * 1'

				 2).递归规则定时器
						 对象 new schedule.RecurrenceRule();
						 属性 {dayOfWeek,month,dayOfMonth,hour,minute,second}
						例：每分钟第60秒时就会触发 obj.second = 0

	       3). 对象文本语法定时器
	          {dayOfWeek,month,dayOfMonth,hour,minute,second}
	          例：每周一的下午16：11分触发：{hour: 16, minute: 11, dayOfWeek: 1}


	 * [二]取消定时器
	 *    taskSchedule.scheduleJob().cancel();
	 */
	//公交提醒任务
	static _start_schedule_BUS_REMIND(){
		//let cronObj = second:[5,10,15,20,25,30,35,40,45,50,55,59],[10,20,30,40,50,59]
		let cronObj = {second:[1]}
		taskObjs[TASK_SCHEDULE.BUS_REMIND] = taskSchedule.scheduleJob(cronObj, ()=> {
			BusManageDBUtil.getScheduleRemindList().then((rows)=>{
				console.log('执行任务调度器 busRemindSchedule,rows:'+rows.length)
				if(rows.length){
					// 可提醒数据列表
					for(let remind of rows){
						let winId = 'bus_remind_'+remind.id //窗口id
						// 发起请求获取详情
						axios.post(
								API_DOMAINS.BUS + '/public/bus/Getstop',
								qs.stringify({ sid : remind.code,
									stopid : remind.num,
									stoptype : remind.stoptype
								}),{
									// headers: {       //三种头部请求都不行,懵逼,先改用了qs
									// 	'Content-Type': 'application/json',
									//   'Content-Type': 'multipart/form-data',
									// 	'Content-Type': 'application/x-www-form-urlencoded'
									// }
								}
						).then((resp)=>{
							let respData = resp.data
							if(respData instanceof Array && respData.length){  //返回数据为数组
								//已经到了提醒时间
								let data = Object.assign({},respData[0],{id:remind.id})
								if((data.distance/60) <= remind.timing){
									console.log(respData)
									let winURL = global.winURL +'#/promptBox/bus/'+JSON.stringify(data)
									WinsManage.createPromptBoxsWin(winId,  { winURL})
									console.info(new Date() + ':' +winURL)
								}else{
									WinsManage.closeWin('promptBoxs.'+winId)
									console.log('时间不够：'+JSON.stringify(respData)+","+remind.timing)
								}
							}else{  //{"error":"-2"}
								WinsManage.closeWin('promptBoxs.'+winId)
								console.log('未到站：'+JSON.stringify(respData))
							}
						}).catch((err)=>{
							console.info('请求错误：'+err)
						})
					}
				}
			})
		});
	}
}

//开启任务调度
TaskScheduleManage.startTask(TASK_SCHEDULE.BUS_REMIND);
