import Vue from 'vue'
import EncryptUtil from '@/utils/encrypt-util'

/**
 * 存储到页面缓存中和浏览器缓存中
 */
class StorageMap extends Map {

	constructor(args) {
		//父类构造
		super()

		//设置前缀
		this._prefix = "vue_"

		//初始化构造参数
		if (args) {
			args.forEach(
					([key, value]) => this.set(key, value)
			)
		}

		//初始化浏览器内存数据
		for (let key of Object.keys(localStorage)) {
			//判断前缀是否需要存入缓存
			if (key.startsWith(this._prefix)) {
				this.set(key, localStorage.getItem(key), {prefix: false, setStorage: false})
			}
		}
	}

	/**
	 * 设置数据
	 * @param key
	 * @param value
	 * @param options   //localStorage：自定义参数
	 *        {
	 *          setStorage : true,//是否保存至浏览器缓存,默认true
	 *          isEncrypt : true, //是否加密
	 *          prefix : false,   //是否加上前缀,默认true,
	 *          maxAge : 60*60    //生存周期(秒),
	 *        }
	 */
	set(key, value, options) {
		options = options || {}
		//设置vue数据前缀（默认是设置的）
		if (options.prefix != false) {
			key = this._prefix + key
		}
		//存放页面内存中
		super.set(key, value)

		if (options.setStorage != false) {
			//存放浏览器内存中
			if (value != null && typeof value != "string") {  //不是字符串
				value = JSON.stringify(value);
			} else if (value == null) {
				value = ''
			}
			if (options.isEncrypt) {  //需要加密
				value = EncryptUtil.encrypt(key, value)
			}
			if (options.maxAge) {  //是否存在生存周期
				var currTime = new Date().getTime()
				options.expiresTime = currTime + (options.maxAge * 1000) //设置到期时间
			}
			let data = {value, options}
			localStorage.setItem(key, JSON.stringify(data))
		}
	}

	/**
	 * 更新数据
	 * @param key
	 * @param value
	 */
	update(key, value, options) {
		options = options || {}
		//得到緩存中options参数
		let tmpVal = localStorage.getItem(this._prefix + key)

		if (tmpVal) {
			try {
				tmpVal = JSON.parse(tmpVal)
				if (tmpVal instanceof Object) {  //是json对象
					Object.assign(options, tmpVal.options)
				}
			} catch (e) {
			}
		}

		this.set(key, value, options)
	}

	/**
	 * 获取数据
	 * @param key
	 * @param isObj ：是否是json对象
	 * @returns {*}
	 */
	get(key, isObj,prefixFlag) {
		//设置vue数据前缀
		if (prefixFlag != false) {
			key = this._prefix + key
		}
		try {
			//页面内存取数据
			let value = super.get(key)
			//不存在则获取浏览器内存数据
			if (!value) {
				value = localStorage.getItem(key)
			}

			//不是字符串
			if (value && isObj != false) {
				try {
					value = JSON.parse(value)
				} catch (e) {
				}
			}

			if (value instanceof Object && value.options) {  //是json对象,且是从浏览器缓存中读取的数据
				let data = value.value
				let options = value.options || {}
				//加密了需要进行解密
				if (options.isEncrypt) {
					value = EncryptUtil.decrypt(key, data)
				} else {
					value = data
				}
				//存在到期时间需要判断是否到期
				if (options.expiresTime && new Date().getTime() >= options.expiresTime) { //到期了
					value = null
					this.delete(key, {prefix: false})
				}
			}
			//判断是否是对象
			if (value) {
				return isObj ? convertJSON(value) : value
			} else {  //
				return isObj ? {} : ''
			}
		} catch (e) {
			return isObj ? {} : ''
		}
	}

	/**
	 * 得到特殊前缀的数组
	 * @param prefix  前缀
	 * @param isObj   是否为对象数组
	 * @returns {Array}
	 */
	getArrays(prefix, isObj) {
		var array = [];
		var keyPrefix = this._prefix + prefix;
		//获取浏览器内存数据
		for (let key of Object.keys(localStorage)) {
			//判断前缀是否需要存入缓存
			if (key.startsWith(keyPrefix)) {
				array.push(this.get(key,isObj,false))
			}
		}
		return array;
	}

	/**
	 * 删除数据
	 * @param key
	 */
	delete(key, options) {
		options = options || {}
		//设置vue数据前缀（默认是设置的）
		if (options.prefix != false) {
			key = this._prefix + key
		}
		//清空页面数据
		super.delete(key)
		//清空浏览器数据
		localStorage.removeItem(key)
	}

	//删除
	remove(key, options) {
		this.delete(key, options)
	}

	/**
	 * 清空数据
	 */
	clear() {
		//清空页面数据
		super.clear()

		//清空浏览器数据
		for (let key of Object.keys(localStorage)) {
			//判断前缀是否需要存入缓存
			if (key.startsWith(this._prefix)) {
				localStorage.removeItem(key)
			}
		}
	}

	/**
	 * 判断数据是否存在,且保持数据一致
	 * @param key
	 * @returns {boolean}
	 */
	has(key) {
		let browserFlag = localStorage.hasOwnProperty(key)  //浏览器是否存在
		let pageFlag = super.has(key) //页面是否存在
		if ((browserFlag && !pageFlag) ||
				(!browserFlag && pageFlag)) {    //浏览器存在并且内存不存在，或，内存存在浏览器不存在
			this.set(key, this.get(key))
			return true
		} else {
			return false
		}
	}
}

//得到json对象
let convertJSON = function (value) {
	if (value == null || value == '') {	//为空数据
		return {}
	} else if (value != null && typeof value == "string") {	//是json字符串
		try {
			value = JSON.parse(value)
		} catch (error) {
			value = {}
		}
		return value
	} else {	//是json对象
		return value
	}
}


export default {

	install() {
		Vue.prototype.$browserStorage = new StorageMap();
	}

}
