﻿/*
* jwl1978_cn@sina.com
* v1.0
*/
function IsPC()  
{  
    var userAgentInfo = navigator.userAgent;  
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
    var flag = true;//false;// 
	
    for (var v = 0; v < Agents.length; v++) {  
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
    }  
	
    return flag;  
} 