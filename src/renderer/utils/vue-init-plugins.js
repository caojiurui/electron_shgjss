import Vue from 'vue/dist/vue.esm.js'
import VueBrowserStorage from "./vue-browser-storage-util";
import ElementUI from 'element-ui'
import '../../../static/ele_theme/index.css'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI);

//浏览器缓存Map,模版中可以通过 this.$browserStorage 访问
Vue.use(VueBrowserStorage)

//把日期转换成字符串
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}

//数组移除指定元素
Array.prototype.remove = function(val){
  var index = this.indexOf(val);
  if(index != -1){
    this.splice(index,1)
  }
};

//字符串格式化
//参数 : [] 或 args,args...
String.prototype.format=function(){
  if(arguments.length==0) return this;
  if(arguments[0] && arguments[0] instanceof Array){
    for(var s=this, i=0; i<arguments[0].length; i++){
      s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[0][i]);
    }
  }else{
    for(var s=this, i=0; i<arguments.length; i++){
      s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
    }
  }
  return s;
};
