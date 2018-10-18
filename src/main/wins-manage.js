/**
 * windows管理(窗口,注册表等)
 */
import {app, screen, ipcMain, remote, globalShortcut,dialog} from 'electron'
import {BrowserWindow, Menu,MenuItem, Tray} from 'electron'
import DialogManage from './dialog-manage'
const WinReg = require('winreg');


/**
 * 窗口管理类
 */
class WinsManage {

	constructor() { }

	/**
	 * 窗口对象
	 * @type {number}
	 */
	static winObjs = {
		//窗口对象
		appWins: {
			'main': null,
			'promptBoxs': {}
		},
		//托盘对象
		appTray: null
	}

	//关闭窗口,支持 name.winId
	static closeWin(winKeys) {
		let keys = winKeys.split('.')
		let name = keys[0], winId = keys[1]
		let winObjs = this.winObjs.appWins[name]
		if (winObjs && winObjs.destroy) { //主窗口存在,直接销毁
			winObjs.destroy()
			console.log('主窗口销毁：' + winKeys)
		} else if (winObjs[winId] && winObjs[winId].destroy) { //子窗口存在,直接销毁
			winObjs[winId].destroy()
			console.log('子窗口销毁：' + winKeys)
		}
	}

	//退出软件,不会触发关闭时间（强制退出）
	static exitApp() {
		app.exit(0)
	}

	//创建右下角提示窗口
	static createPromptBoxsWin(winId, options) {
		let _this = this

		let boxi = Object.keys(_this.winObjs.appWins.promptBoxs).length
		console.log("当前已存在提示框数量" + boxi)

		const {width, height} = screen.getPrimaryDisplay().workAreaSize //显示屏高宽

		let promptBox = _this.winObjs.appWins.promptBoxs[winId]
		if (promptBox) {  //窗口已存在
			promptBox.loadURL(options.winURL)
			if (options.width || options.height) {
				promptBox.setSize(options.width, options.height, options.animate || true)
				promptBox.setPosition(width - options.width, height - options.height, options.animate || true);
			}
		} else {
			//设置提示框高宽
			options.width = options.width || 350
			options.height = options.height || 115  //133
			promptBox = new BrowserWindow({
				icon: global.iconPath,
				width: options.width,
				height: options.height,
				webPreferences: {
					webSecurity: false,
					plugins: true
				},
				x: width - options.width,
				y: height - options.height,
				frame: false,
				resizable: false,
				alwaysOnTop: true,
				transparent: true
			})

			//调试框快捷键
			globalShortcut.register('Ctrl+Shift+Alt+B+' + boxi, () => {
				promptBox.webContents.openDevTools()
			})

			promptBox.on('closed', () => {
				console.log('提示窗口销毁！!')
				delete _this.winObjs.appWins.promptBoxs[winId]
			})

			promptBox.loadURL(options.winURL)

			_this.winObjs.appWins.promptBoxs[winId] = promptBox
		}
	}

	//创建主窗口
	static createMainWin(options) {
		let _this = this

		Menu.setApplicationMenu(null)
		//初始化Window
		_this.winObjs.appWins.main = new BrowserWindow({
			show: options.show == null ? true : options.show,
			icon: global.iconPath,
			height: options.height || 600,
			width: options.width || 850,
			webPreferences: {
				webSecurity: false,
				plugins: true
			},
			resizable: false,
			minimizable: false,
			maximizable: false
			// frame: false,
			// transparent : true
		})
		_this.winObjs.appWins.main.loadURL(options.winURL)

		_this.winObjs.appWins.main.on('closed', () => {
			console.log('主窗口销毁！!')
			_this.winObjs.appWins.main = null
		})

		//调试框快捷键
		globalShortcut.register('Ctrl+Shift+Alt+M', () => {
			_this.winObjs.appWins.main.webContents.openDevTools()
		})

		// 设置关闭时隐藏任务栏,不关闭应用
		_this.winObjs.appWins.main.on('close', (event) => {
			_this.winObjs.appWins.main.hide();
			_this.winObjs.appWins.main.setSkipTaskbar(true);
			event.preventDefault();
		});
		_this.winObjs.appWins.main.on('show', () => {
			_this.winObjs.appTray.setHighlightMode('always')
		})
		_this.winObjs.appWins.main.on('hide', () => {
			_this.winObjs.appTray.setHighlightMode('never')
		})

		//系统托盘设置
		_this.winObjs.appTray = new Tray(global.iconPath);
		//模拟桌面程序点击通知区图标实现打开关闭应用的功能
		_this.winObjs.appTray.on('double-click', () => {
			_this.winObjs.appWins.main.isVisible() ? _this.winObjs.appWins.main.hide() : _this.winObjs.appWins.main.show()
			_this.winObjs.appWins.main.isVisible() ? _this.winObjs.appWins.main.setSkipTaskbar(false) : _this.winObjs.appWins.main.setSkipTaskbar(true)
		})

		const contextMenu = Menu.buildFromTemplate([
			{
				label: '主窗口',
				click() {
					_this.winObjs.appWins.main.show()
					_this.winObjs.appWins.main.setSkipTaskbar(true)
				}
			},{
				label: '开机启动',
				type : 'checkbox',
				click() {
					if(contextMenu.items[1].checked){
						WinRegManage.enableAutoStart()
					}else{
						WinRegManage.disableAutoStart()
					}
				}
			}, {
				label: '退出',
				click() {
					WinsManage.exitApp()
				}
			}
		]);
		_this.winObjs.appTray.setToolTip('上海公交实时提醒');  //设置此托盘图标的悬停提示内容
		_this.winObjs.appTray.setContextMenu(contextMenu);  //设置此图标的上下文菜单

		//检查开机是否启动
		WinRegManage.getAutoStartValue((result)=>{
			contextMenu.items[1].checked = result
		})


	}
}



/**
 * 注册表管理类
 */
class WinRegManage {

	constructor() { }

	static RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';

	// 设置开机启动
	static enableAutoStart(callback) {
		let key = new WinReg({ hive: WinReg.HKCU, key: this.RUN_LOCATION });
		key.set('EUC', WinReg.REG_SZ, process.execPath, (err) => {
			console.log('设置自动启动' + err);
			callback && callback(err);
		});
	}
	// 取消开机启动
	static disableAutoStart(callback) {
		let key = new WinReg({ hive: WinReg.HKCU, key: this.RUN_LOCATION });
		key.remove('EUC', (err) => {
			console.log('取消自动启动' + err);
			callback && callback(err);
		});
	}
	// 获取是否开机启动
	static getAutoStartValue(callback) {
		let key = new WinReg({ hive: WinReg.HKCU, key: this.RUN_LOCATION });
		key.get('EUC', function (error, result) {
			console.log("查询自动启动:" + JSON.stringify(result));
			console.log("file:" + process.execPath);
			if (result) {
				callback(true);
			}else {
				callback(false);
			}
		});
	}

}

export {WinsManage,WinRegManage}
