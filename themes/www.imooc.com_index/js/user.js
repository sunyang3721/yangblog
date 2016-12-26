
<!-- saved from url=(0056)http://www.imooc.com/visitlog/index/user?v=1481858608485 -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body youdao="bind">WEB_SOCKET_SWF_LOCATION = "/static/page/visitlog/WebSocketMain.swf";
WEB_SOCKET_DEBUG = true;
WEB_SOCKET_LOGGER = true;

//以下是web_socket.js 和  swfobject.js

if (typeof console == "undefined") {
	this.console = {log: function (msg){}};
}
var visitlogCountBase={
	postUrl:'http://stats.logrecord.imooc.com/index/stats',
	socketUrl:'ws://stats.visitlog.imooc.com:7080',
	getOSAndBrowser:function(){
		var os = navigator.platform;
		var userAgent = navigator.userAgent;
		var info=new Array()
		var tempArray  = "";
		if(os.indexOf("Win") &gt; -1){
			if(userAgent.indexOf("Windows NT 5.0") &gt; -1){
				info[0] = "Win2000";
			}else if(userAgent.indexOf("Windows NT 5.1") &gt; -1){
				info[0] =  "WinXP";
			}else if(userAgent.indexOf("Windows NT 5.2") &gt; -1){
				info[0] =  "Win2003";
			}else if(userAgent.indexOf("Windows NT 6.0") &gt; -1){
				info[0] =  "WindowsVista";
			}else if(userAgent.indexOf("Windows NT 6.1") &gt; -1 || userAgent.indexOf("Windows 7") &gt; -1){
				info[0] =  "Win7";
			}else if(userAgent.indexOf("Windows 8") &gt; -1){
				info[0] =  "Win8";
			}else{
				info[0] =  "Other";
			}
		}else if(os.indexOf("Mac") &gt; -1){
			info[0] =  "Mac";
		}else if(os.indexOf("X11") &gt; -1){
			info[0] =  "Unix";
		}else if(os.indexOf("Linux") &gt; -1){
			info[0] =  "Linux";
		}else{
			info[0] =  "Other";
		}

		if(/[Ff]irefox(\/\d+\.\d+)/.test(userAgent)){
			tempArray = /([Ff]irefox)\/(\d+\.\d+)/.exec(userAgent);
			info[1] =  tempArray[1] + tempArray[2];
		}else if(/MSIE \d+\.\d+/.test(userAgent)){
			tempArray = /MS(IE) (\d+\.\d+)/.exec(userAgent);
			info[1] =  tempArray[1] + tempArray[2];
		}else if(/[Cc]hrome\/\d+/.test(userAgent)){
			tempArray = /([Cc]hrome)\/(\d+)/.exec(userAgent);
			info[1] =  tempArray[1] + tempArray[2];
		}else if(/[Vv]ersion\/\d+\.\d+\.\d+(\.\d)* *[Ss]afari/.test(userAgent)){
			tempArray = /[Vv]ersion\/(\d+\.\d+\.\d+)(\.\d)* *([Ss]afari)/.exec(userAgent);
			info[1] =   tempArray[3] + tempArray[1];
		}else if(/[Oo]pera.+[Vv]ersion\/\d+\.\d+/.test(userAgent)){
			tempArray = /([Oo]pera).+[Vv]ersion\/(\d+)\.\d+/.exec(userAgent);
			info[1] =   tempArray[1] + tempArray[2];
		}else{
			info[1] =  "unknown";
		}
		return info;
	},
	getUrlType:function(url){
		var typeExp=new Array();
		typeExp[1]=/^http.*\.com\/$/;
		typeExp[2]=/^http.*\/course\/list.*$/;//课程列表
		typeExp[3]=/^http.*\/view\/.*$/;
		typeExp[4]=/^http.*\/learn\/.*$/;
		typeExp[5]=/^http.*\/video\/.*$/;
		typeExp[6]=/^http.*\/code\/.*$/;
		typeExp[7]=/^http.*\/course\/program$/,//学习计划
		typeExp[8]=/^http.*\/course\/programdetail\/pid\/.*/;//学习计划详细
		typeExp[9]=/^http.*\/corp\/index.*$/;
		typeExp[10]=/^http.*\/wenda$/;
		typeExp[11]=/^http.*\/wenda\/detail\/.*$/;
		typeExp[12]=/^http.*\/qadetail\/.*$/;
		typeExp[13]=/^http.*\/wiki(\/.*)*$/;
		typeExp[14]=/^http.*\/wenda(\/.*)*$/;
		typeExp[15]=/^http.*\/article(\/.*)*$/;
		for(var i=1;i<typeexp.length;i++){ if(i="=10||i==11){//10和11都暂停匹配了" continue;="" }="" var="" r="url.match(typeExp[i]);" if(r!="null){" return="" i;="" 0;="" },="" getfromurlhost:function(fromurl){="" if(fromurl!="" ){="" regexp="/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;" r[0];="" '';="" getcookie:function(cookie_name){="" allcookies="document.cookie;" cookie_pos="allcookies.indexOf(cookie_name);" if="" (cookie_pos="" !="-1){" +="cookie_name.length" 1;="" cookie_end="allcookies.indexOf(&quot;;&quot;," cookie_pos);="" (cookie_end="=" -1){="" value="unescape(allcookies.substring(cookie_pos," cookie_end));="" value;="" delhtmltag:function(str){="" str="str.replace(/&lt;[^">]+&gt;/g,"");//去掉所有的html标记
		str = str.replace(/[\n]/ig,"");
		str = str.replace(/(^\s*)|(\s*$)/g,"");
		if(str.length &gt; 50) {
			str = str.substring(0,50);
		}
		return str;
	}
};
var visitlogCountSocketWs={};
var visitlogCountSocket={
	check:function() {
		if (window.WEB_SOCKET_FORCE_FLASH) {
		// Keeps going.
		} else if (window.WebSocket) {
			return true;
		} else if (window.MozWebSocket) {
		// Firefox.
			window.WebSocket = MozWebSocket;
			return true;
		}
		return false;
	},
	// 连接服务端
	connect:function() {
		// 创建websocket
		visitlogCountSocketWs = new WebSocket(visitlogCountBase.socketUrl);
		// 当socket连接打开时，输入用户名
		visitlogCountSocketWs.onopen = function(){
			visitlogCountSocketWs.send(encodeURIComponent(visitlogCountInit.siteinfo));
		};
		// 当有消息时根据消息类型显示不同信息
		visitlogCountSocketWs.onmessage = function(e){
			console.log(e.data);
			//ws.send('{"type":"pong"}');
		};
		visitlogCountSocketWs.onclose = function() {
			console.log("连接关闭，定时重连");
			//this.connect();
		};
		visitlogCountSocketWs.onerror = function(e) {
			console.log(e);
		};
	}
};
var visitlogCountInit={
	siteinfo:'',
	uid:2272212,
	ip:'124.207.55.82',
	imooc_guid:'41CD1A1A-72ED-1DE9-9DD1-6FF2B4DD92B6',
	//document.ready=function(){
	init:function(){
		var os_and_browser = visitlogCountBase.getOSAndBrowser();
		//var remote_ip_info_obj = eval(remote_ip_info);
		//var country = remote_ip_info_obj.country;
		//var province = remote_ip_info_obj.province;
		//var city = remote_ip_info_obj.city;
		var country = '';
		var province = '';
		var city = '';
		var imooc_uuid = visitlogCountBase.getCookie('imooc_uuid');
		var url = window.location.href;
		var fromurl = document.referrer;
		var from_host=visitlogCountBase.getFromUrlHost(fromurl);
		var url_type = visitlogCountBase.getUrlType(url);
		this.siteinfo = '{"type":"siteinfo","data":{"imooc_uuid":"'+imooc_uuid+'","uid":"'+this.uid+'","url":"'+url+'","fromurl":"'+fromurl+'","ip":"'+this.ip+'","country":"'+country+'","province":"'+province+'","city":"'+city+'","os":"'+os_and_browser[0]+'","browser":"'+os_and_browser[1]+'","from_host":"'+from_host+'","url_type":"'+url_type+'","imooc_guid":"'+this.imooc_guid+'"}}';
		//visitlogCountSocket.connect();
		if(visitlogCountSocket.check()){
			visitlogCountSocket.connect();
			/*document.onmousedown = function (ev) {  //鼠标按下
				var oEvent = ev || event;       //判断浏览器兼容
				var disX = oEvent.clientX;    //鼠标横坐标点到div的offsetLeft距离
				var disY = oEvent.clientY;     //鼠标纵坐标点到div的offsetTop距离
				var obj = document.elementFromPoint(disX,disY);
				if(obj.nodeName=='A'){
					ele = obj;
				}else if(obj.parentNode.nodeName=='A'){
					ele = obj.parentNode;
				}else{
					return '';
				}
				var e_title = ele.title;
				var e_innerHTML = visitlogCountBase.delHtmlTag(ele.innerHTML);
				var e_id = ele.id;
				var e_class = ele.className;
				var e_hasclick = new Date().getTime();
				if(ele.hasAttribute('hasclick')){
					e_hasclick = ele.getAttribute('hasclick');
				}else{
					ele.setAttribute("hasclick",e_hasclick);
				}
				var e_href = ele.getAttribute('href');
				var clickinfo= '{"type":"click","data":{"linkname":"'+e_innerHTML+'","title":"'+e_title+'","id":"'+e_id+'","class":"'+e_class+'","hasclick":"'+e_hasclick+'","href":"'+e_href+'"}}';
				visitlogCountSocketWs.send(clickinfo);

			}*/
		}else{
			$.getJSON(visitlogCountBase.postUrl+"?data="+encodeURIComponent(this.siteinfo)+"&amp;jsoncallback=?",function(json){
				//无输出
			});
		}
	}
}
if (document.all){
	window.attachEvent('onload',function(){
		visitlogCountInit.init();
	});
}else{ 
	window.addEventListener('load',function(){
		visitlogCountInit.init();
	},false);
}

</typeexp.length;i++){></body></html>