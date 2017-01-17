<?php
$hostname="http://www.beijing-dentsu.com.cn/happynewyear2015/happynewyear2015/";
//$hostname="http://card.koo7.com/";

$cardName_orig=isset($_GET['cards'])?$_GET['cards']:"";

$imgDir="upload";
$cur_url=$hostname."preview.php?cards=".$cardName_orig;
if(empty($cardName_orig)){
    $cardName=$imgDir."/default.jpg";
}else{
    $cardName=$imgDir."/".$cardName_orig.".jpg";
}

//$cardName=$cardName_orig.".jpg";

$share_img=$hostname."share1.jpg";
$flag=true;
if(stripos($theusagt , "iPhone") !== false || stripos($theusagt , "iPod") !== false){
    $flag=false;
}else if(stripos($theusagt , "Mobile") !== false){
    $flag=false;
}
else if(stripos($theusagt , "Android") !== false){
    $flag=false;
}
else if(stripos($theusagt , "Windows Phone") !== false){
    $flag=false;
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=0.5,target-densitydpi=device-dpi,user-scalable=no,minimum-scale=0.5, maximum-scale=0.5">
    <title>2015羊年喜洋洋！</title>
    <link rel="icon" href="assets/logo.ico" type="image/x-icon"/>
    <link rel="shortcut icon" href="assets/logo.ico" type="image/x-icon"/>

    <script src="js/easeljs-0.7.1.min.js"></script>
    <script src="js/tweenjs-0.5.1.min.js"></script>
    <script src="js/movieclip-0.7.1.min.js"></script>
    <script src="http://yx.xnimg.cn/minisite/common/js/jquery-1.7.1.min.js"></script>

    <script>
        var canvas, stage, mc;
        var sw,sh,sx;
        var scaleNum;
        var offset;
        var imgUrl,tempImg;


        function init() {
            canvas = document.getElementById("canvas");
            stage = new createjs.Stage(canvas);

            addImg("<?php echo $hostname.$cardName; ?>");

            stage.update();
            createjs.Ticker.setFPS(31);
            createjs.Ticker.addEventListener("tick", stage);
        }

        function addImg(e)
        {
            imgUrl = new Image();
            imgUrl.onload = userLoaded;
            imgUrl.src = e;
        }
        function userLoaded() {
            sh=window.innerHeight-100;
            sw=Math.round(imgUrl.width*sh/imgUrl.height);
            scaleNum=sh/imgUrl.height;

            stage.canvas.width = canvas.width=sw;
            stage.canvas.height = canvas.height=sh;

            offset=(window.innerWidth-sw)/2;
            canvas.style.position="absolute";
            canvas.style.left=offset+"px";

            tempImg = new createjs.Bitmap(imgUrl);
            stage.addChild(tempImg);
            tempImg.scaleX=tempImg.scaleY=scaleNum;
        }
        jQuery(function(){
            jQuery(".linkbox").css("padding-top",window.innerHeight-95);
        })


        /*
         * jwl1978_cn@sina.com
         * v1.0
         */
        var dataForWeixin={
            appId:'gh_b49343bb8b1c',
            MsgImg:"<?php echo $share_img; ?>",
            TLImg:"<?php echo $share_img; ?>",
            link:'<?php echo $cur_url; ?>',
            title:'2015羊年喜洋洋！',
            titlequan:'恭祝羊年喜洋洋，\n自制贺卡乐分享！',
            desc:'恭祝羊年喜洋洋，\n自制贺卡乐分享！',
            descquan:'恭祝羊年喜洋洋，\n自制贺卡乐分享！',
            callback:function(){

            }
        };


        (function(){
            var onBridgeReady=function(){
                //WeixinJSBridge.call('hideToolbar');
                // 发送给好友;
                WeixinJSBridge.on('menu:share:appmessage', function(argv){
                    WeixinJSBridge.invoke('sendAppMessage',{
                        "appid":dataForWeixin.appId,
                        "img_url":dataForWeixin.TLImg,
                        "img_width":"120",
                        "img_height":"120",
                        "link":dataForWeixin.link,
                        "desc":dataForWeixin.desc,
                        "title":dataForWeixin.title
                    }, function(res){(dataForWeixin.callback)();});
                });
                // 分享到朋友圈;
                WeixinJSBridge.on('menu:share:timeline', function(argv){
                    (dataForWeixin.callback)();
                    WeixinJSBridge.invoke('shareTimeline',{
                        "img_url":dataForWeixin.TLImg,
                        "img_width":"120",
                        "img_height":"120",
                        "link":dataForWeixin.link,
                        "desc":dataForWeixin.descquan,
                        "title":dataForWeixin.titlequan
                    },  function(res){});
                });
                // 分享到微博;
                WeixinJSBridge.on('menu:share:weibo', function(argv){
                    WeixinJSBridge.invoke('shareWeibo',{
                        "content":dataForWeixin.desc+" "+dataForWeixin.link,
                        "url":dataForWeixin.link,
                        "img_url":dataForWeixin.MsgImg,
                        "pic":dataForWeixin.MsgImg,
                        "img":dataForWeixin.MsgImg,
                        "desc":dataForWeixin.desc,
                        "title":dataForWeixin.title
                    }, function(res){(dataForWeixin.callback)();});
                });
                // 分享facebook;
                WeixinJSBridge.on('menu:share:facebook', function(argv){
                    (dataForWeixin.callback)();
                    WeixinJSBridge.invoke('shareFB',{
                        "img_url":dataForWeixin.TLImg,
                        "img_width":"120",
                        "img_height":"120",
                        "link":dataForWeixin.link,
                        "desc":dataForWeixin.desc,
                        "title":dataForWeixin.title
                    }, function(res){});
                });

            };

            if(document.addEventListener){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if(document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady'   , onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady' , onBridgeReady);
            }

        })();
    </script>


</head>
<style type="text/css">
    body {
        margin-left: 0pxy;
        margin-top: 0px;
        margin-right: 0px;
        margin-bottom: 0px;
        background-image: url('assets/bg.png');
        background-repeat: repeat-x repeat-y
    }
    canvas {
        display: block;
    }

</style>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="background-color:#A70022" onload="init();">
<canvas id="canvas" width="640" height="850" style="background-color:#A70022"></canvas>
<!-- JiaThis Button BEGIN -->
<div class="linkbox" style="text-align:center; clear:both; width: 505px;  position: relative;margin: 0 auto">
    <div class="jiathis_style_32x32" style="position:absolute;margin-left:116px;">
        <div class="jiathis_style"><span class="jiathis_txt">分享至：</span><a class="jiathis_button_tsina"></a>
        <a class="jiathis_button_tqq"></a>
        <a class="jiathis_button_douban"></a>
        <a class="jiathis_button_qzone"></a>
        <?php if($flag){ ?><a class="jiathis_button_weixin"></a><?php } ?>
        <!--<a href="http://www.jiathis.com/share" class="jiathis jiathis_txt jiathis_separator jtico jtico_jiathis" target="_blank"></a>
        <a class="jiathis_counter_style"></a>-->
    </div>
</div>
<script type="text/javascript" >
    var jiathis_config={
        summary:"",
        title:"恭祝羊年喜洋洋，自制贺卡乐分享！",
        shortUrl:"",
        pic:"<?php echo $hostname.$cardName; ?>",

    hideMore:false
    }
</script>

<script type="text/javascript" src="http://v3.jiathis.com/code/jia.js" charset="utf-8"></script>
<!-- JiaThis Button END -->

</body>
</html>
