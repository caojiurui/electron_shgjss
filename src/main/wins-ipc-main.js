/**
 * 主窗口通讯 【主进程】        *  主进程 ←→ 渲染进程 *
 */

import {app, ipcMain, remote, webContents,dialog} from 'electron'
import { WinsManage } from './wins-manage'

//创建提示框
ipcMain.on('new-prompt-box', (event, arg) => {
	WinsManage.createPromptBoxsWin(arg.id || new Date().getTime(),
																  { winURL : global.winURL +'#/promptBox/bus/0'})
})

//创建提示框
ipcMain.on('new-prompt-box', (event, arg) => {
	const options = {
		type: 'info',
		title: '信息',
		message: "这是一个信息对话框. 很不错吧？",
		buttons: ['是', '否']
	}
	dialog.showMessageBox(options, (index) => {
		event.sender.send('information-dialog-selection', index)
	})
})


//关闭当前应用  'all': 所有 , key:窗口 , key.index : 窗口数组.索引
ipcMain.on('close-win', (event, winName) => {
	if(!winName || winName == 'all'){
		WinsManage.exitApp()
	}else{
		WinsManage.closeWin(winName)
	}
})
