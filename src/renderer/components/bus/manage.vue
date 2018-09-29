<template>
    <div class="div-block">
        <h2> 公交通知管理
            <el-button type="danger" style="float: right;margin-top:-13px"
                       size="medium" round @click="addRemindClick">添加提醒
            </el-button>
        </h2>

        <el-table
                :data="tableData"
                style="width: 100%"
                height="455">
            <el-table-column
                    fixed
                    label="线路"
                    width="80">
                <template slot-scope="scope">
                    <span style="color: #409EFF; font-size: 16px; font-weight: bold;">
                        {{scope.row.road_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="线路详情"
                    width="150">
                <template slot-scope="scope">
                    {{ scope.row.stoptype == 1 ? scope.row['z_fls'] : scope.row['f_fls'] }}
                </template>
            </el-table-column>
            <el-table-column
                    label="提醒站点"
                    width="130">
                <template slot-scope="scope">
                    <span style="color: #F56C6C; "> {{scope.row.station_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="提醒时间"
                    width="120">
                <template slot-scope="scope">
                    {{scope.row.remind_time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="timing"
                    label="提前提醒时长(分)"
                    width="80">
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="remark"-->
                    <!--label="内容"-->
                    <!--width="120">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="next_remind_time"
                    label="下次提醒时间"
                    width="90">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="110">
                <template slot-scope="scope">
                    <el-button @click="handleSetStatusClick(scope.row)" type="text" size="small"> {{ scope.row.status == 1 ? '停止提醒' : '开始提醒'}}</el-button>
                    <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>

	import WinUtils from '@/utils/electron-win-utils'
    import * as BusManageDBUtil from '@/db/bus/manage.sql'
    import { REMIND_STATUS } from '../../../core/constants/bus-constant'

	export default {
		data() {
			return {
				tableData: [/* {id,road_name,z_fls,z_fls,z_flt,f_flt,station_name,status,
				                stoptype,remind_time,timing,remark }    */]
			}
		},
		methods: {
			handleDelClick(row) {
                BusManageDBUtil.deleteRoadRemindById(row.id).then(()=>{
	                this.tableData.splice(this.tableData.findIndex((remind, index, arr) => {
                        return remind.id === row.id
                    }),1)
	                this.$message.success('删除提醒成功！')
                },()=>{
	                this.$message.error('删除提醒失败！')
                })
			},
            handleSetStatusClick(row){
				//已提醒设置未提醒,提醒设置已提醒
                let status = row.status ? REMIND_STATUS.REMIND_STATUS_STOP : REMIND_STATUS.REMIND_STATUS_START
                BusManageDBUtil.updateRemindStatusById(row.id, status).then( ()=>{
	                this.$message.success((row.status ? '停止': '设置') + '提醒成功！')
	                row.status = status
                },()=>{
	                this.$message.error((row.status ? '停止': '设置') + '提醒成功！')
                })
            },
			addRemindClick() {
				this.$router.push('/bus/new')
			},
		},
		beforeCreate() {
            BusManageDBUtil.getAllRoadRemindList().then( (rows)=>{
                this.tableData = rows
            })
		},
		mounted() {
			WinUtils.setSize({height: 600, width: 850, position: 'center'})
		}
	}
</script>
