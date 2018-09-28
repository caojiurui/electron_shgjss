import {app} from 'electron'
import { WinsManage } from './wins-manage'
import './wins-ipc-main'
import './task-schedule'
import * as BusManageDBUtil from '../renderer/db/bus/manage.sql'
import {CheckTableIsExist} from '../core/sqlite/init-db.sql'

let path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
	global.__indexpath = '../../'
}else{
	global.__indexpath = process.cwd()
}
global.iconPath = path.join(global.__indexpath, 'build', 'icons', 'icon_1.ico')


global.winURL = process.env.NODE_ENV === 'development'
		? `http://localhost:9080`
		: `file://${__dirname}/index.html`

app.on('ready', () => {

	if (makeSingleInstance()) return app.quit()

	//检查判断是否创建表
	CheckTableIsExist().then(()=>{
		//判断是否存在提醒,不存在则默认显示出窗口,否则隐藏
		BusManageDBUtil.getRemindCount().then((row)=>{
			WinsManage.createMainWin({winURL : global.winURL+'#/bus/manage',show : row.count == 0 })
		})
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (WinsManage.winObjs.appWins.main === null) {
		WinsManage.winObjs.appWins.createMainWin({winURL : global.winURL+'#/bus/manage'})
	}
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// 单例应用,第二次进来获取焦点
function makeSingleInstance() {
	if (process.mas) return false

	return app.makeSingleInstance(() => {
		let mainWindow = WinsManage.winObjs.appWins.main
		if (mainWindow) {
			if (mainWindow.isMinimized()){
				mainWindow.restore()
				mainWindow.focus()
			} else if(!mainWindow.isVisible()){
				mainWindow.show()
				mainWindow.setSkipTaskbar(true)
				mainWindow.focus()
			}
		}
	})
}
