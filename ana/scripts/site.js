/**
 * author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 */
(function ($) {
    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        var mode = document.compatMode;

        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }

        return height;
    }

    $(window).scroll(function () {
        var vpH = getViewportHeight(),
            scrolltop = (document.documentElement.scrollTop ?
                document.documentElement.scrollTop :
                document.body.scrollTop),
            elems = [];
        
        // naughty, but this is how it knows which elements to check for
        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }
        });

        if (elems.length) {
            $(elems).each(function () {
                var $el = $(this),
                    top = $el.offset().top,
                    height = $el.height(),
                    inview = $el.data('inview') || false;

                if (scrolltop > (top + height) || scrolltop + vpH < top) {
                    if (inview) {
                        $el.data('inview', false);
                        $el.trigger('inview', [ false ]);                        
                    }
                } else if (scrolltop < (top + height)) {
                    if (!inview) {
                        $el.data('inview', true);
                        $el.trigger('inview', [ true ]);
                    }
                }
            });
        }
    });
    
    // kick the event to pick up any elements already in view.
    // note however, this only works if the plugin is included after the elements are bound to 'inview'
    $(function () {
        $(window).scroll();
    });
})(jQuery);

/* Smooth Scrolling */
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        || location.hostname == this.hostname) {

      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 62
        }, 1000);
        return false;
      }
    }
  });
});

$(document).ready(function() {
	
	var $window = $(window),
		$secondBG = $('#slide2'),
		$eighthBG = $('#slide8'),
		$ninthBG = $('#slide9'),
		windowHeight = 1120;
	
	$('.slide').bind('inview', function (event, visible) {
		var currentNav = $(this).attr("id");
		var navSelect = $('#quick-nav').find('a[href="#'+currentNav+'"]');

		if (visible == true) {
			$(this).addClass('inview');
			$(navSelect).addClass('current');
		}
		else {
			$(this).removeClass('inview');
			navSelect.removeClass('current');
		}
	});
	
	function newPos(x, windowHeight, pos, adjuster, inertia){
		//function that is called for every pixel the user scrolls. Determines the position of the background
		/*arguments: 
			x = horizontal position of background
			windowHeight = height of the viewport
			pos = position of the scrollbar
			adjuster = adjust the position of the background
			inertia = how fast the background moves in relation to scrolling
		*/
		return x + "% " + (-((windowHeight + pos) - adjuster) * inertia)  + "px";
	}
	
	function Move(){ 
		var pos = $window.scrollTop(),
			horizon = 50;
		//SLIDE 2
		if($secondBG.hasClass("inview")){
			$secondBG.css({'backgroundPosition': newPos(horizon, windowHeight, pos, 1120, 0.2)});
		}
		//SLIDE 8
		if($eighthBG.hasClass("inview")){
			$eighthBG.css({'backgroundPosition': newPos(horizon, windowHeight, pos, 12280, 0.2)});
		}
		//SLIDE 9
		if($ninthBG.hasClass("inview")){
			$ninthBG.css({'backgroundPosition': newPos(horizon, windowHeight, pos, 13480, 0.2)});
		}
	}
		
	$window.resize(function(){
		Move();
	});		
	
	$window.bind('scroll', function(){
		Move();
	});	
});