<template>
    <div class="bus-prompt-box-container">

    </div>
</template>

<script>

	import WinUtils from '@/utils/electron-win-utils'
    import { updateNextRemindTimeById } from '@/db/bus/manage.sql'

	export default {
		data() {
			return {
				remindData: {}
			}
		},
		methods: {
			showNotiify(){
				let _this = this

                this.$notify({
                    duration: 0,
                    position: 'bottom-right',
                    title: '公交实时提醒',
                    dangerouslyUseHTMLString: true,
                    message: `<div class="bus-prompt-box">
                <audio  style="display: none" autoplay="autoplay"
                        controls="controls" loop="loop" preload="auto"
                                src="./static/audio/reminder.mp3">
                </audio>
                <i class="fa fa-bell-o"></i>
                <div class="content">
                    <span class="code">${this.remindData['@attributes'].cod}</span>公交距离你还有
                    <span class="stopnum">${this.remindData.stopdis}</span>站
                    <span class="dist">${(this.remindData.distance/1000).toFixed(1)}</span>公里,
                    预计<span class="time">${Math.ceil(this.remindData.time/60)}</span>分钟后到达,赶快出发吧!
                </div>
              </div>`,
                    onClose() {
                    	//设置下次提醒可提醒时间，当前时间+预计到达时间+预留3分钟
                        let timestamp = new Date().getTime() + _this.remindData.time*1000 + 3*60*1000
                        let nextRemindTime = new Date(timestamp).format('yyyy-MM-dd hh:mm:ss')
	                    updateNextRemindTimeById(_this.remindData.id,nextRemindTime).then(()=>{
                            WinUtils.close();   //窗口关闭
                        })
                    },
                });
            }
        },
		mounted() {
			if (this.$route.params.data) {
				try {
                    //[{"@attributes":{"cod":"206路"},"terminal":"沪B-52541","stopdis":"4","distance":"3395","time":"879"}]
                    this.remindData = JSON.parse(this.$route.params.data)
                    this.showNotiify()
				}catch (e) {
					//点击取消后,本次不再提醒
                    WinUtils.close()
                }
			}else{
                WinUtils.close()
            }
		},
	}
</script>

<style>
    .bus-prompt-box i.fa {
        font-size: 26px;
        float: left;
        width: 30px;
        padding-top: 8px;
    }

    .bus-prompt-box .content {
    }

    .bus-prompt-box .content .code {
        color: #409EFF;
        font-size: 16px;
        font-weight: bold;
    }

    .bus-prompt-box .content .dist {
        color: #67C23A;
        font-size: 14px;
    }

    .bus-prompt-box .content .stopnum {
        color: #E6A23C;
        font-size: 16px;
        font-weight: bold;
    }

    .bus-prompt-box .content .time {
        color: #F56C6C;
        font-size: 18px;
        font-weight: bold;
    }
</style>
