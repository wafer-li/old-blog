$(document).on("DOMContentLoaded",function(){var e=$(".sidebar-inner"),t=CONFIG.sidebar.offset||12;function o(){var o,i,f,a=$(".header-inner").height()+t,n=(o=$("#footer"),i=$(".footer-inner"),f=o.outerHeight()-i.outerHeight(),o.outerHeight()+f);e.affix({offset:{top:a-t,bottom:n}}),$("#sidebar").css({"margin-top":a,"margin-left":"auto"})}o(),window.matchMedia("(min-width: 992px)").addListener(function(t){t.matches&&($(window).off(".affix"),e.removeData("bs.affix").removeClass("affix affix-top affix-bottom"),o())})});