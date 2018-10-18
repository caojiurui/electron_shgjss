const Q = require('q')
const path = require('path')
const _sqlite3 = require('sqlite3').verbose();
let dbPath = process.cwd() + '/shgjss.db'
if (process.env.NODE_ENV !== 'development') {
	dbPath =  path.join(process.resourcesPath,'../','shgjss.db')
}
const _db = new _sqlite3.Database(dbPath);

//数据库工具类
class DBUtil {

	/******************* 新增数据（封装） ********************/

	/**
	 * 把对象数组插入到表内  (数组所有对象key顺序必须完全一致)
	 */
	static insertObjs = function (tableName, objArray) {

		if(objArray && objArray.length) {
			// 执行插入(事物,顺序执行)

			let _this = this
			//顺序执行函数内sql
			// _db.serialize(() => {
			// _db.run('BEGIN TRANSACTION;');

			let sql = `insert into ${tableName} (`;
			for (let key in objArray[0]) {
				sql += ` '${key}',`;
			}

			sql = sql.substring(0, sql.lastIndexOf(',')); //去除最后一个,
			sql += ") values ";

			for (let obj of objArray) {
				sql += "(";
				for (let key in obj) {
					sql += ` '${obj[key]}',`;
				}
				sql = sql.substring(0, sql.lastIndexOf(',')); //去除最后一个,
				sql += "),";
			}
			sql = sql.substring(0, sql.lastIndexOf(',')); //去除最后一个,

			return _this.insert(sql)

			// _db.run('COMMIT TRANSACTION;');
			// });
		}
		return Q.defer().reject('数据数据不存在')
	}

	//把对象插入到表内
	static insertObj = function (tableName, obj) {


		let sql = `insert into ${tableName} (`;
		for (let key in obj) {
			sql += ` '${key}',`;
		}
		sql = sql.substring(0, sql.lastIndexOf(',')); //去除最后一个,
		sql += ") values (";

		for (let key in obj) {
			sql += `'${obj[key]}',`;
		}
		sql = sql.substring(0, sql.lastIndexOf(',')); //去除最后一个,
		sql += ")";
		//执行插入
		return this.insert(sql);
	}



	/******************* 更改数据（封装） ********************/

	//更改数据 （按照条件对象）
	static updateByCond = function (tableName,obj,condObj) {
		let sql = `update ${tableName} set `
		//设置set
		let keys = Object.keys(obj)
		for(let i = 0 ;i < keys.length ; i++){
			sql += `${keys[i]} = '${obj[keys[i]]}' `
			if(i < keys.length - 1){
				sql += ' , '
			}
		}
		//设置where
		let condKeys = Object.keys(condObj)
		if(condKeys.length){
			sql += ' where '
			for(let i = 0 ;i < condKeys.length ; i++){
				sql += `${condKeys[i]} = '${condObj[condKeys[i]]}' `
				if(i < condKeys.length - 1){
					sql += ' and '
				}
			}
		}
		return this.delete(sql)
	}




	/******************* 删除数据（封装） ********************/

	//删除 （按照主键）
	static deleteByPK = function (tableName,key,value) {
		let obj = {}
		obj[key] = value
		return this.deleteByObj(tableName,obj)
	}

	//删除 （按照对象）
	static deleteByObj = function (tableName,obj) {
		let sql = `delete from ${tableName} where `
		let keys = Object.keys(obj)
		for(let i = 0 ;i < keys.length ; i++){
			sql += `${keys[i]} = '${obj[keys[i]]}' `
			if(i < keys.length - 1){
				sql += 'and '
			}
		}
		return this.delete(sql)
	}




	/******************* 新增数据（封装） ********************/

	//查 （返回多个）
	static selectAll = function (sql) {
		let def = Q.defer()
		_db.all(sql, function (err,rows) {
			if (err) {
				console.error ? console.error(`【sql err】${err}：${sql}`) : console.info(`【sql err】${err}：${sql}`)
				def.reject(err)
			} else {
				def.resolve(rows)
			}
		})
		return def.promise
	}

	//查 （返回1个）
	static selectOne = function (sql) {
		let def = Q.defer()
		_db.get(sql, function (err,row) {
			if (err) {
				console.error ? console.error(`【sql err】${err}：${sql}`) : console.info(`【sql err】${err}：${sql}`)
				def.reject(err)
			} else {
				def.resolve(row)
			}
		})
		return def.promise
	}

	/**
	 * 按照条件查找表 （返回多个）
	 * @param sqlConfig = {
	         table : 'test',                  //表名称   必填
	         colType:'all' ,                  //查找列类型,  all:全部,其他为查找cols数组列      可空
	         cols:['col1','col2'],            //当type != all时，查找列名称数组,    可空
	         colsToString : ['col1'],         //需要值转换成字符串的列数组
	         where : ' col1 = "列1" and col2 = "列2" ' ,   //筛选条件
         }
	 * @param callback
	 * @param errorCallback
	 */
	static selectByCondition = function (sqlConfig) {
		let sql = "select";
		//不存在列,查找全部
		if (sqlConfig.colType == 'all' || !sqlConfig.cols || sqlConfig.cols.length == 0) {
			sql += " * ";
		} else if (sqlConfig.cols.length) {
			for (let colName of sqlConfig.cols) {
				if (i != 0) {
					sql += ",";
				}
				sql += colName;
			}
		}
		//存在需要类型转换 int转成char
		if (sqlConfig.colsToString && sqlConfig.colsToString.length) {
			for (let colName of sqlConfig.colsToString) {
				sql += `,cast(${colName} as text) ${colName} `;
			}
		}
		sql += " from " + sqlConfig.table;
		if (sqlConfig.where) {
			sql += " where " + sqlConfig.where;
		}
		//查找数据库
		return this.selectAll(sql);
	}

	/******************* 对表操作的记录  ********************/

	/**
	 * 创建表
	 */
	static createTable = function (sql) {
		return this.run(sql)
	}

	/**
	 * 检查表是否存在
	 */
	static checkTableExist = function (args) {
		let def = Q.defer()

		let names = "('')",len = 0
		if(args instanceof Array){
			names = `( '${args.join("','")}')`
			len = args.length
		}else{
			names = `( '${args}' )`
			len = 1
		}
		this.selectOne(` select count(1) count from sqlite_master
										 where type = 'table' and name in ${names} `).then((row) => {
			if (row && row.count == len) {  //表存在
				def.resolve()
			}else{
				def.reject()
			}
		})
		return def.promise
	}

	/******************* 底层方法  ********************/

	//增
	static insert = function (sql) {
		return this.run(sql)
	}
	//删除
	static delete = function (sql) {
		return this.run(sql)
	}
	//改
	static update = function (sql) {
		return this.run(sql)
	}

	//执行更新语句
	static run = function (sql) {
		let def = Q.defer()
		_db.run(sql, function (err,rows) {
			if (err) {
				console.error ? console.error(`【sql err】${err}：${sql}`) : console.info(`【sql err】${err}：${sql}`)
				def.reject(err)
			} else {
				def.resolve(rows)
			}
		})
		return def.promise
	}

}

export default DBUtil
