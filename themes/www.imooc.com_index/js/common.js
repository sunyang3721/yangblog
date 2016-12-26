
	function a() {
		OP_CONFIG.userInfo && $.ajax({
			url: "/u/loading",
			dataType: "json",
			success: function(a) {
				0 == a.result && (a.data.remind > 0 ? $(".msg_icon").show().html(a.data.remind > 99 ? "99+" : a.data.remind) : $(".msg_icon").hide())
			}
		})
	}
	function c() {
		h = $(window).height(), t = $(document).scrollTop(), t >= 768 ? ($("#backTop").show(), $("#js-elevator-weixin").removeClass("no-goto")) : ($("#backTop").hide(), $("#js-elevator-weixin").addClass("no-goto"))
	}


	var k = 0;
	$("#header-user-card").on("mouseenter", function() {
		clearTimeout(k), $(this).hasClass("hover") || $(this).addClass("hover")
	}).on("mouseleave", function(e) {
		e.stopPropagation();
		var a = $(this);
		k = setTimeout(function() {
			a.hasClass("hover") && a.removeClass("hover")
		}, 300)
	}), $(".js-show-menu").on("click", function(e) {
		return $("html").addClass("holding"), $("body").addClass("slide-left"), $(".slide-left-opa")[0] || $("body").append('<div class="slide-left-opa" style="position: absolute; top: 0; right: 130px; left: 0;bottom: 0; background: rgba(0 ,0,0,0.3); z-index: 2000;"></div>'), document.getElementsByClassName("slide-left-opa")[0].addEventListener("touchstart", function() {
			return $("html").removeClass("holding"), $("body").removeClass("slide-left"), $(".slide-left-opa").remove(), !1
		}, !1), e.stopPropagation(), !1
	}), $("body").on("click", ".slide-left-opa", function() {
		$("html").removeClass("holding"), $("body").removeClass("slide-left"), $(".slide-left-opa").remove()
	}), !
	function() {
		$(document).on("click", "[data-ast]", function() {
			$.get("/index/adclick", {
				ast: $(this).attr("data-ast"),
				r: (new Date).getTime()
			})
		}).on("click", "[data-track]", function() {
			$.get("/index/clickuserlog", {
				track: $(this).attr("data-track"),
				r: (new Date).getTime()
			})
		})
	}()