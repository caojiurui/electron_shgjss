<template>
    <div class="div-block">
        <h2> 公交通知设置 </h2>

        <el-form ref="form" label-width="80px">

            <el-form-item label="线路名称">
                <el-select v-model="currRoad.id" filterable placeholder="请选择线路名称" @change="changeRoad">
                    <el-option
                            v-for="(rd,i) of road_items"
                            :key="rd.id"
                            :label="rd.name"
                            :value="rd.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="线路详情" v-if="currRoad.z_first_last_station">
                <el-row>
                    <el-radio-group v-model="stopType" @change="initRoadDetail">
                        <el-radio style="margin-left:0px" :label="1">
                            <span style="font-size: 16px;font-weight: bold">
                                {{currRoad.z_first_last_station.split('-')[0]}}</span>
                            (首:<span style="color: #409EFF;">
                                {{currRoad.z_first_last_time.split('-')[0]}}</span>)
                            &nbsp;→&nbsp;
                            <span style="font-size: 16px;font-weight: bold">
                                {{currRoad.z_first_last_station.split('-')[1]}}</span>
                            (末:<span style="color: #F56C6C;">
                                {{currRoad.z_first_last_time.split('-')[1]}}</span>)
                        </el-radio>
                        <el-radio style="margin-left:0px" :label="0">
                            <span style="font-size: 16px;font-weight: bold">
                                {{currRoad.f_first_last_station.split('-')[0]}}</span>
                            (首:<span style="color: #409EFF;">
                                {{currRoad.f_first_last_time.split('-')[0]}}</span>)
                            &nbsp;→&nbsp;
                            <span style="font-size: 16px;font-weight: bold">
                                {{currRoad.f_first_last_station.split('-')[1]}}</span>
                            (末:<span style="color: #F56C6C;">
                                {{currRoad.f_first_last_time.split('-')[1]}}</span>)
                        </el-radio>
                    </el-radio-group>
                </el-row>
            </el-form-item>

            <el-form-item label="站点名称">
                <el-select v-model="remindStationName" filterable placeholder="请选择站点">
                    <el-option
                            v-for="station in (stopType == 1 ? currRoad.z_stations : currRoad.f_stations)"
                            :key="station.num "
                            :label="station.name"
                            :value="station.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提醒时间">
                <el-time-select
                        v-model="remindTime"
                        :picker-options="pickerOptions"
                        placeholder="选择时间">
                </el-time-select>
            </el-form-item>
            <el-form-item label="提前时长">
                <el-input type="number" v-model="timing" style="width: 223px"></el-input>
                （分）
            </el-form-item>
            <el-form-item label="提醒内容">
                <el-input type="textarea" v-model="remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即添加</el-button>
                <el-button @click="onReturnList">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

	import WinUtils from '@/utils/electron-win-utils'
	import {GetBusRoadCode, GetBusRoadDetail} from '@/api/bus'
	import * as BusNewDBUtil from '@/db/bus/new.sql'

	export default {
		data() {
			return {
				road_items: [],             //线路列表 [id,name]
				pickerOptions: {
					start: '04:00',
					step: '00:05',
					end: '23:59'
				},
				currRoad: {                 //当前线路
				},
				stopType: 1,                //线路上下行方向（1：正方向,0：反方向）
				remindStationName: '',      //提醒站点名称
				remindTime: '',             //提醒时间
				timing: 10,                 //提前多少分钟提醒
				remark: '',                 //备注
			}
		},
		methods: {
			changeRoad() {
				let _this = this
                // this.loadingInstance = this.$loading({ fullscreen: true })     //loading ...
				//根据id获取线路 {id,name}
				this.currRoad = this.road_items.find((rd) => {
					return rd.id == this.currRoad.id
				});
				Object.assign(this.currRoad, {
					'code': '',                  //线路code
					'z_first_last_station': '',  //首末站(正方向)
					'f_first_last_station': '',  //首末站(反方向)
					'z_first_last_time': '',     //起点站首末车时间	05:00-22:30 (正方向)
					'f_first_last_time': '',     //终点站首末车时间 05:00-22:30 (反方向)
					'z_stations': [],            //站点列表    {station_id,num,name}
					'f_stations': []             //站点列表    {station_id,num,name}
				})

				//数据库存在详情数据
				BusNewDBUtil.getRoadDetailById(_this.currRoad.id).then((data) => {
					//继承对象详情
					Object.assign(_this.currRoad, data.road)
					//设置站点列表详情
					for (let station of data.stations) {
						if (station.stoptype == 1) {
                            _this.currRoad.z_stations.push(station)
						} else {
                            _this.currRoad.f_stations.push(station)
						}
					}

					/*
					    设置DB数据完整性 1：存在线路数据,2：存在线路和正站点数据,3：存在线路和反站点数据,4:数据完整
                    */
					if (_this.currRoad.z_stations.length && _this.currRoad.f_stations.length) {
						_this.currRoad.dataFlag = 4
					} else if (_this.currRoad.f_stations.length) {
						_this.currRoad.dataFlag = 3
                       _this.stopType = 0
					} else if (_this.currRoad.z_stations.length) {
						_this.currRoad.dataFlag = 2
					} else if (data.road) {
                        _this.currRoad.dataFlag = 1
                        _this.initRoadDetail()
					}
					this.$forceUpdate();
                    // this.loadingInstance && this.loadingInstance.close()
				}, () => {     //接口拉取详情
					//获取线路id
					GetBusRoadCode(this.currRoad.name).then(resp => {
						if (resp.sid) {
							this.currRoad.code = resp.sid
							this.initRoadDetail()
						} else {
							this.$message.error('数据发生错误!');
						}
					})
				})
			},
			initRoadDetail() {
				let _this = this
				//方向数组已存在
				if ((_this.stopType == 1 && _this.currRoad.z_stations.length) ||
						(!_this.stopType && _this.currRoad.f_stations.length)) {
					return
				}
				GetBusRoadDetail(_this.currRoad.code, _this.stopType).then(resp => {
					//获取开始站点和结束站点
					let $downgoing = $(resp).find('.downgoing')
					let $upgoing = $(resp).find('.upgoing')
					_this.currRoad.z_first_last_time = $downgoing.find(' .time .s').text() + '-' + $downgoing.find(' .time .m').text()
					_this.currRoad.f_first_last_time = $upgoing.find(' .time .s').text() + '-' + $upgoing.find(' .time .m').text()
					_this.currRoad.z_first_last_station = $downgoing.find('span:eq(0)').text() + '-' + $downgoing.find('span:eq(1)').text()
					_this.currRoad.f_first_last_station = $upgoing.find('span:eq(0)').text() + '-' + $upgoing.find('span:eq(1)').text()
					//获取所有站点信息
					let $stationArray = $(resp).find('.stationBox .stationCon')
					if ($stationArray.length) {
						let stations = []
						$stationArray.each(function (i, item) {
							stations.push({
								bus_road_id: _this.currRoad.id,
								stoptype: _this.stopType,
								num: parseInt($(this).find('.stationBor .num').text()),
								name: $(this).find('.stationBor .name').text()
							})
						})
						if (_this.stopType == 1) {
							_this.currRoad.z_stations = stations
						} else {
							_this.currRoad.f_stations = stations
						}
					}
					this.$forceUpdate();
					console.log(_this.currRoad)
				})
			},
			onSubmit() {
				let _this = this

				//保存数据至数据库
				if (this.currRoad.id && this.remindStationName) {
					//线路提醒数据对象
					let roadRemindObj = {
						bus_road_id: this.currRoad.id,
						remind_time: this.remindTime,
						timing: this.timing,
						remark: this.remark
					}

					/*
                        currRoad.dataFlag： 1：存在线路数据,          2：存在线路和正站点数据,
                                            3：存在线路和反站点数据,  4: 数据完整
                    */
					let flag = _this.currRoad.dataFlag
					//数据完整 或 不需要插入
					if ( flag == 4 ||     //数据完整
                        (_this.stopType && flag == 2 && !_this.currRoad.f_stations.length) ||   //正站点,且不存在反站点数据
                        (!_this.stopType && flag == 3 && !_this.currRoad.z_stations.length)) {     //反站点,且不存在正站点数据
                        //直接插入bus_road_remind
                        _this.insertBusRoadRemind(roadRemindObj)

					} else if (flag == 3) {

						//存在线路和反站点数据,插入正站点数组bus_road_station和bus_road_remind
						BusNewDBUtil.insertBusRoadStations(_this.currRoad.z_stations).then(() => {
							//插入bus_road_remind
                            _this.insertBusRoadRemind(roadRemindObj)
						})

					} else if (flag == 2) {

						//存在线路和正站点数据,插入反站点数组bus_road_station和bus_road_remind
						BusNewDBUtil.insertBusRoadStations(_this.currRoad.f_stations).then(() => {
							//插入bus_road_remind
                            _this.insertBusRoadRemind(roadRemindObj)
						})

					} else {

						let stationObjs = [..._this.currRoad.z_stations, ..._this.currRoad.f_stations]

						//线路数据不存在,插入bus_road,bus_road_station,bus_road_remind
						let busRoadObj = {
							bus_road_id: _this.currRoad.id,
							code: _this.currRoad.code,
							z_first_last_station: _this.currRoad.z_first_last_station,
							f_first_last_station: _this.currRoad.f_first_last_station,
							z_first_last_time: _this.currRoad.z_first_last_time,
							f_first_last_time: _this.currRoad.f_first_last_time,
						}
						//插入数据库
						BusNewDBUtil.insertBusRoadDetail(busRoadObj, stationObjs).then(() => {
							//直接插入bus_road_remind
							_this.insertBusRoadRemind(roadRemindObj)
						})
					}
				} else {
					this.$message.error('请选择线路和需要提醒的站点！')
				}
			},
            insertBusRoadRemind(roadRemindObj){
				let _this = this
	            BusNewDBUtil.insertBusRoadRemind(roadRemindObj,
                                                 _this.stopType,
                                                 _this.remindStationName).then(()=>{
			            _this.$message({
				            type:'success',
				            message:'添加线路提醒成功',
				            onClose(){
					            _this.onReturnList()    //返回主页
				            }
			            });
                }).catch(()=>{
                	_this.$message.error('添加线路失败！')
                })
            },
			onReturnList() {
				this.$router.push('/bus/manage')
			},
		},
		beforeCreate() {
			//获取线路数组 [{id,name}]
			BusNewDBUtil.getAllBusRoads().then((rows) => {
				this.road_items = rows
			})
		},
		computed: {},
		mounted() {
			WinUtils.setSize({height: 600, width: 650, position: 'center'})
		}
	}
</script>
