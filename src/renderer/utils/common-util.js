/**
 * 浏览器工具类
 */
let BrowserUtil = {
    /**
     * [isFullscreenEnabled 判断全屏模式是否是可用]
     * @return [支持则返回true,不支持返回false]
     */
    isFullscreenEnabled(){
        return document.fullscreenEnabled       ||
            document.mozFullScreenEnabled    ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled || false;
    },
    /**
     * [isFullscreen 判断浏览器是否全屏]
     * @return [全屏则返回当前调用全屏的元素,不全屏返回false]
     */
    isFullscreen(){
        return document.fullscreenElement    ||
            document.msFullscreenElement  ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement || false;
    },
    //浏览器进入全屏   https://blog.csdn.net/byc233518/article/details/78774409
    fullScreen(element) {

        if (BrowserUtil.isFullscreenEnabled()) {
            if(BrowserUtil.isFullscreen() === false){
                var el = element instanceof HTMLElement ? element : document.documentElement;
                var rfs = el.requestFullscreen ||
                    el.webkitRequestFullscreen ||
                    el.mozRequestFullScreen    ||
                    el.msRequestFullscreen;
                if (rfs) {
                    rfs.call(el);
                } else if (window.ActiveXObject) {
                    var ws = new ActiveXObject("WScript.Shell");
                    ws && ws.SendKeys("{F11}");
                }
            }else{
                console.log('浏览器已全屏');
            }
        } else {
            console.log('浏览器当前不能全屏');
        }


    },
    exitFull() {
        if(BrowserUtil.isFullscreen() ) {
            var efs = document.exitFullscreen ||
                document.webkitExitFullscreen ||
                document.mozCancelFullScreen ||
                document.msExitFullscreen;
            if (efs) {
                efs.call(document);
            } else if (window.ActiveXObject) {
                var ws = new ActiveXObject("WScript.Shell");
                ws && ws.SendKeys("{F11}");
            }
        }else{
            console.log('浏览器未全屏');
        }
    },
    /**
     * 禁用键盘按键
     */
    disableKeyboard(event) {
        let ev = event || window.event; //获取event对象
        let obj = ev.target || ev.srcElement; //获取事件源
        let key = ev.key ? ev.key.toUpperCase() : '';   //按键大写
        if ((ev.altKey) && ((ev.keyCode == 37) || //屏蔽 Alt+ 方向键 ←
            (ev.keyCode == 39))) { //屏蔽 Alt+ 方向键 →
            console.log("不准你使用ALT+方向键前进或后退网页！");
            return false;
        }
        if ((key == 'F5' && ev.keyCode == 116) || //屏蔽 F5 刷新键
            (ev.ctrlKey && ev.keyCode == 82 && key == 'R')) { //Ctrl + R
            return false;
        }
        if ( (ev.keyCode == 122 && key == 'F11') ||
             (ev.keyCode == 123 && key == 'F12') ) { //屏蔽F11,F12
            return false;
        }
        //屏蔽 Ctrl+n
        if (ev.ctrlKey && ev.keyCode == 78 && key == 'N')
            return false;
        //屏蔽 shift+F10
        if (ev.shiftKey && ev.keyCode == 121 && key == 'F10')
            return false;
        //屏蔽 shift 加鼠标左键新开一网页
        if (obj.tagName == "A" && ev.shiftKey)
            return false;
        //屏蔽Alt+F4
        if (ev.altKey && ev.keyCode == 115  && key == 'F4') {
            window.showModelessDialog("about:blank", "", "dialogWidth:1px;dialogheight:1px");
            return false;
        }

        //屏蔽回退键路由切换（当文本模式则有效）[部分浏览器]
        //获取作为判断条件的事件类型
        let vReadOnly = obj.getAttribute('readonly');
        let vEnabled = obj.getAttribute('enabled');
        //处理null值情况
        vReadOnly = (vReadOnly == null) ? false : vReadOnly;
        vEnabled = (vEnabled == null) ? true : vEnabled;

        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
        //并且readonly属性为true或enabled属性为false的，则退格键失效
        let flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea" || editFlag == 'true') && (vReadOnly == true || vEnabled != true)) ? true : false;

        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
        let flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && editFlag != 'true') ? true : false;

        //判断
        if (flag1 || flag2) {
            return false;
        }
    },
    /**
     * 禁用浏览器事件
     */
    disableBrowserEvent() {
        //禁止拖动
        // document.body.ondragstart = function () { return false }
        //防止页面后退
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL)
        });
        //屏蔽鼠标右键、Ctrl+N、Shift+F10、F11、F5刷新、退格键
        document.oncontextmenu = function () {  //屏蔽鼠标右键
            return false
        }
        window.onhelp = function () { //屏蔽F1帮助
            return false
        }
        //禁止键盘 作用于Firefox、Opera
        document.onkeypress = BrowserUtil.disableKeyboard;
        //禁止键盘 作用于IE、Chrome
        document.onkeydown = BrowserUtil.disableKeyboard;
    },
    enableBrowserEvent() {
        delete document.body.ondragstart
        delete document.oncontextmenu
        delete window.onpopstate
        delete window.onhelp
        delete window.onkeydown
        delete window.onkeypress
    }
}

/**
 * 保存文件触发下载
 * @param url
 * @param saveName
 */
let SaveFile = function (url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) {
        event = new MouseEvent('click');
    } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

/**
 * 排序比较函数-比较对象为Object
 * @param key       对象属性
 * @param order     排序方式，默认升序
 * @param keyType   比较类型【Number、Date】，可不传
 * @returns {Function}
 */
let SortCompare = function (key, order, keyType) {
    return function (obj1, obj2) {
        let rtnOne = 1, rtnTwo = -1;
        if (order && order == 'desc') {
            rtnOne = -1, rtnTwo = 1;
        }

        if (obj1[key] == null || obj2[key] == null) {
            return rtnTwo;
        }
        var v1 = obj1[key], v2 = obj2[key];

        if (keyType === 'Number') {
            v1 = Number.parseFloat(v1);
            v2 = Number.parseFloat(v2);
        }

        if (keyType === 'Date') {
            v1 = new Date(v1).getTime();
            v2 = new Date(v2).getTime();
        }

        if (v1 > v2) {
            return rtnOne;
        } else if (v1 === v2) {
            return 0;
        } else {
            return rtnTwo;
        }
    }
}

//深拷贝,克隆对象，支持Object，Array，Date
let Clone = function (obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


/**
 * JS获取n至m随机整数
 */
let Random = function (n, m) {
    var c = m - n + 1;
    return Math.floor(Math.random() * c + n);
}

/**
 * 毫秒转化为 时:分:秒
 */
let FormatLongToTimeStr = function (ms) {
    if (ms <= 0) {
        return "00’00’’"
    }
    if (ms == null) {
        ms = 0;
    } else if (ms > 0 && ms < 88) {        //比如值为1-86  会出现计算错误问题
        ms = 88;
    }
    let ss = 1000;
    let mi = ss * 60;
    let hh = mi * 60;
    let dd = hh * 24;

    let day = Number.parseInt(ms / dd);
    let hour = Number.parseInt((ms - day * dd) / hh);
    let minute = Number.parseInt((ms - day * dd - hour * hh) / mi);
    let second = Math.ceil((ms - day * dd - hour * hh - minute * mi) / ss);

    let strHour = hour < 10 ? "0" + hour : "" + hour;
    let strMinute = minute < 10 ? "0" + minute : "" + minute;
    let strSecond = second < 10 ? "0" + second : "" + second;
    if (strHour == "00") {
        return strMinute + "’" + strSecond + "”";
    } else {
        return strHour + "'" + strMinute + "’" + strSecond + "”";
    }
}



/*5.加载文件*/
/* 已加载文件缓存列表,用于判断文件是否已加载过，若已加载则不再次加载*/
window.classcodes =[];
let Import={
    /*加载一批文件，_files:文件路径数组,可包括js,css,less文件,succes:加载成功回调函数*/
    LoadFileList:function(_files,succes){
        let FileArray=[];
        if(typeof _files==="object"){
            FileArray=_files;
        }else{
            /*如果文件列表是字符串，则用,切分成数组*/
            if(typeof _files==="string"){
                FileArray=_files.split(",");
            }
        }
        if(FileArray!=null && FileArray.length>0){
            var LoadedCount=0;
            for(var i=0;i< FileArray.length;i++){
                loadFile(FileArray[i],function(){
                    LoadedCount++;
                    if(LoadedCount==FileArray.length){
                        succes();
                    }
                })
            }
        }
        /*加载JS文件,url:文件路径,success:加载成功回调函数*/
        function loadFile(url, success) {
            if (!FileIsExt(classcodes,url)) {
                var ThisType=GetFileType(url);
                var fileObj=null;
                if(ThisType==".js"){
                    fileObj=document.createElement('script');
                    fileObj.src = url;
                }else if(ThisType==".css"){
                    fileObj=document.createElement('link');
                    fileObj.href = url;
                    fileObj.type = "text/css";
                    fileObj.rel="stylesheet";
                }else if(ThisType==".less"){
                    fileObj=document.createElement('link');
                    fileObj.href = url;
                    fileObj.type = "text/css";
                    fileObj.rel="stylesheet/less";
                }
                success = success || function(){};
                fileObj.onload = fileObj.onreadystatechange = function() {
                    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                        success();
                        classcodes.push(url)
                    }
                }
                document.getElementsByTagName('head')[0].appendChild(fileObj);
            }else{
                success();
            }
        }
        /*获取文件类型,后缀名，小写*/
        function GetFileType(url){
            if(url!=null && url.length>0){
                return url.substr(url.lastIndexOf(".")).toLowerCase();
            }
            return "";
        }
        /*文件是否已加载*/
        function FileIsExt(FileArray,_url){
            if(FileArray!=null && FileArray.length>0){
                var len =FileArray.length;
                for (var i = 0; i < len; i++) {
                    if (FileArray[i] ==_url) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}

export {SaveFile, SortCompare, BrowserUtil, Clone, Random, FormatLongToTimeStr,Import}
