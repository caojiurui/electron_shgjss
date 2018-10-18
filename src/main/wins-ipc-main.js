/**
 * 主窗口通讯 【主进程】        *  主进程 ←→ 渲染进程 *
 */

import {app, ipcMain, remote, webContents,dialog} from 'electron'
import { WinsManage } from './wins-manage'

//关闭当前应用  'all': 所有 , key:窗口 , key.index : 窗口数组.索引
ipcMain.on('notify-reminder-data-update', (event, winName) => {
	WinsManage.winObjs.appWins.main.webContents.send('reminder-data-update')  //通知页面更新数据
})


//关闭当前应用  'all': 所有 , key:窗口 , key.index : 窗口数组.索引
ipcMain.on('close-win', (event, winName) => {
	if(!winName || winName == 'all'){
		WinsManage.exitApp()
	}else{
		WinsManage.closeWin(winName)
	}
})
