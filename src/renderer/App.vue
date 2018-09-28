<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import WinUtils from '@/utils/electron-win-utils'

	export default {
		name: 'shgjss',
		beforeCreate() {
			// InitBusTables()
			// this.$electron.ipcRenderer.send('new-prompt-box')
		}
	}
</script>

<style>
    body, .el-notification {
        -webkit-app-region: drag
    }

    .el-notification .el-notification__closeBtn {
        -webkit-app-region: no-drag;
    }
</style>
