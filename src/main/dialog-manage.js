

/**
 * 弹框管理类
 */
import {dialog} from 'electron'


class DialogManage {

	static _showMessageBox(options){
		dialog.showMessageBox({
			type: options.type || 'info',
			title : options.title || '提示消息',
			message:options.message,
		})
	}

	static alert(args) {
		this.info(args)
	}

	static info(args) {
		if(args instanceof Object){
			this._showMessageBox({message : args.content,title : args.title})
		}else{
			this._showMessageBox({message : args.toString()})
		}
	}

}

export default DialogManage
