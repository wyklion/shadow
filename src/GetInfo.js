/**
 * Created by kk on 2015/7/3.
 */

var xmlHttp;

var text_info = {
    text:"",
    table:{
    }
};
var fontInfo = {
    "glyphs":{},
    "cssFontWeight":"normal",
    "ascender":1189,
    "underlinePosition":-100,
    "cssFontStyle":"normal",
    "boundingBox":{"yMin":-334,"xMin":-111,"yMax":1189,"xMax":1672},
    "resolution":1000,
    "original_font_information":{"postscript_name":"heiti","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"heiti","font_family_name":"heiti","copyright":"Copyright (c) Μagenta ltd, 2004","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Μagenta ltd:heiti:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2015 by Drogon3D","manufacturer_name":"Μagenta ltd","font_sub_family_name":"Regular"},
    "descender":-334,
    "familyName":"heiti",
    "lineHeight":1522,
    "underlineThickness":50
};

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  unescape(r[2]);
    return null;
}

function createXMLHttpRequest()
{
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
}

function getInfo(callback)
{
    var msgid = GetQueryString("id");
    createXMLHttpRequest();
    xmlHttp.onload = function() {
        if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
            var res = eval ("(" + xmlHttp.responseText + ")");
            if (res["result"] == "0")
            {
                alert(res["info"]);
                return;
            }
            setinfo(res);
            callback();
            //alert(res["info"]["msg"]);
        }
        else{
            alert("执行失败，请重试!");

        }
    };
    xmlHttp.onerror = function() {
        // There was a connection error of some sort
        alert("服务器连接错误！")
    };
    xmlHttp.open("GET", "http://www.3dh5game.com/games/3dmsg/getmsg.php?id=" + msgid, true);
    xmlHttp.send(null);
}

function setinfo(res){
    text_info.text = res["info"]["msg"];
    var textLength = text_info.text.length
    var num = Math.ceil(textLength/10);
    var dx = Math.ceil(textLength/num);
    var text = "";
    for(var i=0;i<num;i++){
        if(i>0)
            text += "\n";
        text += text_info.text.substring(i*dx,(i+1)*dx);
    }
    text_info.text = text;

    text_info.table = res["info"]["chars"];
    fontInfo["glyphs"] = res["info"]["member"];
    if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace(fontInfo);
}

//"res/heiti.typeface.js",
//    "res/helvetiker_regular.typeface.js",