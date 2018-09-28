import Vue from 'vue';
import axios from 'axios'
import { Loading, Message } from 'element-ui'

Vue.prototype.$http = axios;

//java服务器中不需要代理
if(process.env.ENV_CONFIG === 'dev'){
  Vue.prototype.$http.defaults.baseURL = '/api/'
}else{
  Vue.prototype.$http.defaults.baseURL = ''
  Vue.prototype.$http.defaults.timeout = 10*1000    // 超时时间
}

var loadinginstace
axios.interceptors.request.use(
  (config) => {

    //防止IE浏览器get方式请求缓存
    if (!!window.ActiveXObject || "ActiveXObject" in window && config.method.toUpperCase() == 'GET') {
      config.url += '?' + Math.random()
    }

    if(config.loading && !document.querySelector('.el-loading-mask')){
      loadinginstace && loadinginstace.close()  //关闭前一个loading
      //重新创建loading
      loadinginstace = Loading.service({
        target: document.getElementById('main')
        // fullscreen: true
      })
      loadinginstace.requestURL = config.url;
    }
    let method = config.method;
    let data = config.data;
    //更改参数为jquery的方式,所有的参数都通过data提交过来
    if(method && !config.isRequestBody){
      if(method.toUpperCase() =='GET' &&
        !config.params && data){ //存在data
        config.params = data
      }else if(method.toUpperCase() =='POST' &&
               data &&
               data instanceof Object &&
               Object.keys(data).length > 0 ){

        let formData = new FormData()     //ie好像没URLSearchParams
        for (var key of Object.keys(data)) {
          formData.append(key,data[key])
        }
        config.data = formData
      }
    }
    return config
  },
  (error) => {
    loadinginstace && loadinginstace.close()  //关闭loading
    Message.error({ message: '网络请求错误,'+ error })
    return error
  })

axios.interceptors.response.use(
  (response) => {
    //来自同个请求响应再关闭loading
    if(loadinginstace && response.config.url.indexOf(loadinginstace.requestURL) != -1){
      loadinginstace.close()  //关闭loading
    }
    if(response.status === 200){  //成功
      var data = response.data;
      if('string' === typeof data){
        console.log('typeof response.data is string');
        try {
          data = JSON.parse(data);
        } catch (e) {
        }
      }
      return data
    }else{ //失败
      Message.error({ message: '服务器发生错误!' })
    }
    return response
  },
  (error) => {
    loadinginstace && loadinginstace.close()  //关闭loading
    Message.error({ message: '网络响应错误,'+ error })
    return error
  })

export default axios
