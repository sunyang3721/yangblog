$(function(){
		// var mid_href = store.get('mid_href');
	 //    if(mid_href !='' && mid_href != undefined && store.get('uid') == undefined ) {
		// 	$('.learnchapter .video  a').each(function() {
		// 		if($(this).attr('href') == mid_href) {
		// 			$(this).parents('.learnchapter').addClass('learnchapter-active');
		// 			$(this).parents('.video').show();
		// 			$(this).parents('.learnchapter')
		// 				.find('span')
		// 				.removeClass('js-close')
		// 				.addClass('js-open');
		// 		}
		// 	})
		// 	store.remove('mid_href');
		// } else if(store.get('uid') == undefined) {
		// 	//$('.learnchapter h3').eq(0).addClass('learnchapter-active').click();
		// }

		//页面打开章节打开
		// var $medias = $('.mod-chapters').find('li');
		// if(hasLearn == 0){
		// 	$('.mod-chapters').find('.chapter').addClass('chapter-active');
		// 	$('.mod-chapters').find('h3 span').addClass('js-open');

		// }else {
		// 	if($medias.length <= 20){
		// 		$('.mod-chapters').find('.chapter').addClass('chapter-active');
		// 		$('.mod-chapters').find('h3 span').addClass('js-open');
		// 	}
		// }
		

		// $(".back-btn").on("click",function(event) {
		// 	if(document.referrer&&document.referrer.indexOf("course/list")!=-1){

		// 		window.location=document.referrer
		// 	}else{
		// 		window.location="/course/list"
		// 	}
		// 	return false;
		// });

		/*记录播放记录到本地存储*/
		$('.video li').bind('click',function(){
			var mid_href = $(this).find('a').attr('href');
			store.set('mid_href', mid_href);
		})

		$('.mod-chapters').on('click', 'h3, .J-media-item', function(e){
			var $this = $(this);

			// 如果点击的是章
			if(!$this.hasClass('J-media-item')){
				var flag = $this.find('span'),
					chapter = $this.parents('.chapter');

				chapter.toggleClass('chapter-active');

				if(chapter.hasClass('chapter-active')){
					flag.removeClass('js-close').addClass('js-open');
				}else{
					flag.removeClass('js-open').addClass('js-close');
				}
			}else{
				// 点击的是节
				// 如果未登录弹出登录框，然后自动跳转到学习详情页
				if(!isLogin){
					seajs.use('login_sns', function(obj){
						obj.init();
					});
					return false;
				}
			}
		});
		//章节介绍显示
		$(".chapter").delegate('.chapter-info', 'mouseover', function(event) {
			$(this).find(".triangle").show();
			var $chapterLeft = - ($(this).find(".chapter-introubox").width()/2 -8)+'px';
			$(this).find(".chapter-introubox").css("left",$chapterLeft);
		});
		//章节介绍隐藏
		$(".chapter").delegate('.chapter-info', 'mouseleave', function(event) {
			$(this).find(".triangle").hide();
		});
	});

	
	
   