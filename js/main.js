/**
* --------------------------------
* main JS
* --------------------------------
*/
let fn = (function() {
	"use strict";

	return {
		//공통
		common : function(){
      fn.hideOtherList();
			fn.scrollAnimation();
		},

    // other list 페이지별로 제어
    hideOtherList : function(){
      let sectionWrapID = $(".contents").attr("id");
      $(".other-project-link").find(".list-other li").each(function(){
        if($(this).find("a").attr("id") == sectionWrapID){
          $(this).closest("li").css("display","none");
        }else {
          $(this).closest("li").css("display","block");
        }
      });
    },

    // scroll animation
    scrollAnimation : function(){

      aniEvent();

      $(document).scroll(function(){
        let scrTop = $(window).scrollTop();
        let headerHt = $(".header-container").height();
        let btnHome = $(".btn.home");
        let clientHt = $(document).outerHeight();
        let winHt = $(window).height();
        let footerHt = $(".footer").outerHeight();
        
        // scroll event common
        if( scrTop > headerHt){
          aniEvent();
          btnHome.css("bottom","-10%");
        }

        // btnHome remove
        if(scrTop == 0){
          btnHome.css("bottom","18px");
        }else if (scrTop >= (clientHt - winHt) - (footerHt + 300) ){
          btnHome.css("bottom","80px");
        }

      });

      function aniEvent(){
        $(".box-ani").each(function(){
          let winHt = $(window).height();
          let winTop =  $(window).scrollTop() + winHt;
          let elOffTop = $(this).offset().top;

          if(winTop >= elOffTop){
            $(this).addClass("aniload");
          }
        });
      }
    },
	}
})();


$(window).on("load", function(){
	fn.common();
});

