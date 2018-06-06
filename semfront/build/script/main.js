$(document).ready(function(){
    
    $('.event-pop > li').hover(function() {
        $(this).addClass('open');
    }, function() {
		$(this).removeClass('open');
    });  
    
    $("#user-block li.mobo-search").on("click",function(e) {
        $(this).parent().parent().addClass("open"); 
		$(".headerSearch").addClass("open");
	});
	
	$(".menuBtnMobi").on("click", function(e){
		$(this).parent().toggleClass("open");
	});
	
	$(".tgl a").on("click", function (e) {
		$(".right-panel").toggleClass("open");
	});
    
	$(".quick-nav ul li.mobo-search").on("click",function(e) {
        $(this).parent().parent().parent().addClass("open");
		$(".headerSearch").addClass("open");
    });
    
	$(".quick-links .mobo-cls").on("click",function(e) {
        $(this).parent().removeClass("open");
		$(".headerSearch").removeClass("open");
    });
	
	// Global tabs
	var tab_id;
	$('.tabs ul li, .tabsContainer ul li').click(function(){
		tab_id = $(this).attr('data-tab');
		$(this).siblings().removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).siblings('.tabContent').removeClass('current');
		$("#"+tab_id).addClass('current');			
	});
	$('.tabs ul li:first-child, .tabsContainer ul li:first-child').addClass('current');
	$('.tabs').each(function(item, index){
		var dt = $(this).find('ul li:first-child').attr('data-tab');
		$("#"+dt).addClass('current');
	});
	$('.tabsContainer').each(function(item, index){
		var dt = $(this).find('ul li:first-child').attr('data-tab');
		$("#"+dt).addClass('current');
	});	
	
	// scorecard view page
	if($(window).width() <= 767){
		$('.matchScoreContainer').hide();
		$('.scorecardview .tabs ul li').click(function(){
			if($(this).attr('data-tab') == 'msTab' || $(this).attr('data-tab') == 'mdTab'){
				$('.matchStateSection').show();
				$('.matchScoreContainer').hide();
			}else{
				$('.matchStateSection').hide();
				$('.matchScoreContainer').show();			
			}
		});	
	}
	
	// Login page tabs
	var selTab = '';
	var isopen = false;
	$('.slideMenuBtn').on('click', function(e){
		e.preventDefault();
		var tabItem = $(this).attr('data-tab');
		$('.slideMenuContent').removeClass('current');
		$("#"+tabItem+'_tab.slideMenuContent').addClass('current');	
		$(this).parent().parent(".menuMobi").toggleClass("open");
	});
	
	// Footer position set
	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();
	setFooter();
	$(window).resize(function(){
		if ($(window).width() != windowWidth || $(window).height() != windowHeight) {
			windowWidth  = $(window).width();
			windowHeight = $(window).height();
			setFooter();
		}
	});
	
	// Sticky tabs
	/* if($('.tabsContainer').length > 0){
		$(window).scroll(function(){
			if($('.tabsWrapper').offset().top < ($(window).scrollTop() + 60)){
				$('.tournamentpage').addClass('sticky');
			}else{
				$('.tournamentpage').removeClass('sticky');
			}
		});
	} */
	
});

function setFooter(){
	pageHeight = $('.loginPage').height() + $('header.sticky').height() + $('footer').height() + 40;
	if(pageHeight <= $(window).height()){
		$('.footer').addClass('footerSticky');
	}else{
		$('.footer').removeClass('footerSticky');
	}	
}

$(document).mouseup(function (e){
    var container = $(".headerSearch");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.parent().removeClass("open");
    }	
});
$(document).mouseup(function (e){
	var container = $(".menuMobi");
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.removeClass("open");
	}
});
$(document).mouseup(function (e){
	var container = $(".right-panel");
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.removeClass("open");
	}
});
$(document).mouseup(function (e){
	var container = $(".slideMenuContent");
	if (!container.is(e.target) // if the target of the click isn't the container...
			&& container.has(e.target).length === 0) // ... nor a descendant of the container
	{
		container.removeClass("current");
	}
});