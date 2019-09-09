HTMLElement.prototype.outerHeight=function(e){var t=this.offsetHeight;if(!e)return t;var n=window.getComputedStyle(this);return t+=parseInt(n.marginTop,10)+parseInt(n.marginBottom,10)},HTMLElement.prototype.wrap=function(e){this.parentNode.insertBefore(e,this),this.parentNode.removeChild(this),e.appendChild(this)},NexT.utils={wrapImageWithFancyBox:function(){document.querySelectorAll(".post-body :not(a) > img").forEach(e=>{var t=$(e),n=t.attr("data-src")||t.attr("src"),r=t.wrap(`<a class="fancybox fancybox.image" href="${n}" itemscope itemtype="http://schema.org/ImageObject" itemprop="url"></a>`).parent("a");t.is(".post-gallery img")?(r.addClass("post-gallery-img"),r.attr("data-fancybox","gallery").attr("rel","gallery")):t.is(".group-picture img")?r.attr("data-fancybox","group").attr("rel","group"):r.attr("data-fancybox","default").attr("rel","default");var a=t.attr("title")||t.attr("alt");a&&(r.append(`<p class="image-caption">${a}</p>`),r.attr("title",a).attr("data-caption",a))}),$.fancybox.defaults.hash=!1,$(".fancybox").fancybox({loop:!0,helpers:{overlay:{locked:!1}}})},registerExtURL:function(){document.querySelectorAll(".exturl").forEach(e=>{e.addEventListener("click",e=>{var t=e.currentTarget.getAttribute("data-url"),n=decodeURIComponent(escape(window.atob(t)));return window.open(n,"_blank","noopener"),!1})})},registerCopyCode:function(){document.querySelectorAll("figure.highlight").forEach(e=>{const t=e=>{"mac"===CONFIG.copycode.style?e.innerHTML='<i class="fa fa-clipboard"></i>':e.innerText=CONFIG.translation.copy_button},n=document.createElement("div");n.classList.add("highlight-wrap"),e.wrap(n),e.parentNode.insertAdjacentHTML("beforeend",'<div class="copy-btn"></div>');var r=e.parentNode.querySelector(".copy-btn");r.addEventListener("click",e=>{var t=e.currentTarget,n=[...t.parentNode.querySelectorAll(".code .line")].map(e=>e.innerText).join("\n"),r=document.createElement("textarea"),a=window.scrollY;r.style.top=a+"px",r.style.position="absolute",r.style.opacity="0",r.readOnly=!0,r.value=n,document.body.append(r);const o=document.getSelection(),i=o.rangeCount>0&&o.getRangeAt(0);r.select(),r.setSelectionRange(0,n.length),r.readOnly=!1;var c=document.execCommand("copy");CONFIG.copycode.show_result&&(t.innerText=c?CONFIG.translation.copy_success:CONFIG.translation.copy_failure),r.blur(),t.blur(),i&&(o.removeAllRanges(),o.addRange(i)),document.body.removeChild(r)}),r.addEventListener("mouseleave",e=>{setTimeout(()=>{t(e.target)},300)}),t(r)})},wrapTableWithBox:function(){document.querySelectorAll("table").forEach(e=>{const t=document.createElement("div");t.className="table-container",e.wrap(t)})},registerVideoIframe:function(){document.querySelectorAll("iframe").forEach(e=>{const t=new RegExp(["www.youtube.com","player.vimeo.com","player.youku.com","player.bilibili.com","www.tudou.com"].join("|"));if(!e.parentNode.matches(".video-container")&&e.src.search(t)>0){const t=document.createElement("div");t.className="video-container",e.wrap(t);let n=Number(e.width),r=Number(e.height);n&&r&&(e.parentNode.style.paddingTop=r/n*100+"%")}})},registerScrollPercent:function(){var e=document.querySelector(".back-to-top"),t=document.querySelector(".reading-progress-bar");window.addEventListener("scroll",()=>{var n;if(e||t){var r=document.querySelector(".container").offsetHeight,a=window.innerHeight,o=r>a?r-a:document.body.scrollHeight-a,i=Math.round(100*window.scrollY/o);n=Math.min(i,100)+"%"}e&&(window.scrollY>50?e.classList.add("back-to-top-on"):e.classList.remove("back-to-top-on"),e.querySelector("span").innerText=n),t&&(t.style.width=n)}),e&&e.addEventListener("click",()=>{window.anime({targets:document.documentElement,duration:500,easing:"linear",scrollTop:0})})},registerTabsTag:function(){document.querySelectorAll(".tabs ul.nav-tabs .tab").forEach(e=>{e.addEventListener("click",e=>{e.preventDefault();var t=e.currentTarget;if(!t.classList.contains("active")){[...t.parentNode.children].forEach(e=>{e.classList.remove("active")}),t.classList.add("active");var n=document.getElementById(t.querySelector("a").getAttribute("href").replace("#",""));[...n.parentNode.children].forEach(e=>{e.classList.remove("active")}),n.classList.add("active"),n.dispatchEvent(new Event("tabs:click",{bubbles:!0}))}})}),window.dispatchEvent(new Event("tabs:register"))},registerCanIUseTag:function(){window.addEventListener("message",e=>{var t=e.data;if("string"==typeof t&&t.indexOf("ciu_embed")>-1){var n=t.split(":")[1],r=t.split(":")[2];document.querySelector(`iframe[data-feature=${n}]`).style.height=parseInt(r,10)+"px"}},!1)},registerActiveMenuItem:function(){document.querySelectorAll(".menu-item").forEach(e=>{var t=e.querySelector("a[href]");if(t){var n=t.pathname===location.pathname||t.pathname===location.pathname.replace("index.html",""),r=t.pathname!==CONFIG.root&&0===location.pathname.indexOf(t.pathname);t.hostname===location.hostname&&(n||r)?e.classList.add("menu-item-active"):e.classList.remove("menu-item-active")}})},registerSidebarTOC:function(){const e=document.querySelectorAll(".post-toc li"),t=[...e].map(e=>{var t=e.querySelector("a.nav-link");return t.addEventListener("click",e=>{e.preventDefault();var t=document.getElementById(e.currentTarget.getAttribute("href").replace("#","")).getBoundingClientRect().top+window.scrollY;window.anime({targets:document.documentElement,duration:500,easing:"linear",scrollTop:t+10})}),document.getElementById(t.getAttribute("href").replace("#",""))});var n=document.querySelector(".post-toc-wrap");!function r(a){a=Math.floor(a+1e4);let o=new IntersectionObserver((o,i)=>{let c=document.documentElement.scrollHeight+100;if(c>a)return i.disconnect(),void r(c);let s=function(e){let n=0,r=e[n];if(r.boundingClientRect.top>0)return 0===(n=t.indexOf(r.target))?0:n-1;for(;n<e.length;n++){if(!(e[n].boundingClientRect.top<=0))return t.indexOf(r.target);r=e[n]}return t.indexOf(r.target)}(o);!function(e){if(!e.classList.contains("active-current")){document.querySelectorAll(".post-toc .active").forEach(e=>{e.classList.remove("active","active-current")}),e.classList.add("active","active-current");for(var t=e.parentNode;!t.matches(".post-toc");)t.matches("li")&&t.classList.add("active"),t=t.parentNode;window.anime({targets:n,duration:200,easing:"linear",scrollTop:n.scrollTop-n.offsetHeight/2+e.getBoundingClientRect().top-n.getBoundingClientRect().top})}}(e[s])},{rootMargin:a+"px 0px -100% 0px",threshold:0});t.forEach(e=>o.observe(e))}(document.documentElement.scrollHeight)},hasMobileUA:function(){var e=navigator.userAgent;return/iPad|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP|IEMobile|Symbian/g.test(e)},isTablet:function(){return window.screen.width<992&&window.screen.width>767&&this.hasMobileUA()},isMobile:function(){return window.screen.width<767&&this.hasMobileUA()},isDesktop:function(){return!this.isTablet()&&!this.isMobile()},isMuse:function(){return"Muse"===CONFIG.scheme},isMist:function(){return"Mist"===CONFIG.scheme},isPisces:function(){return"Pisces"===CONFIG.scheme},isGemini:function(){return"Gemini"===CONFIG.scheme},initSidebarDimension:function(){var e=document.querySelector(".sidebar-nav"),t="none"!==e.style.display?e.outerHeight(!0):0,n=CONFIG.sidebar.offset||12,r=CONFIG.back2top.enable&&CONFIG.back2top.sidebar?document.querySelector(".back-to-top").offsetHeight:0,a=CONFIG.sidebarPadding+t+r;(NexT.utils.isPisces()||NexT.utils.isGemini())&&(a+=2*n-12);var o=document.body.offsetHeight-a+"px";document.querySelector(".site-overview-wrap").style.maxHeight=o,document.querySelector(".post-toc-wrap").style.maxHeight=o},updateSidebarPosition:function(){var e=document.querySelector(".sidebar-nav"),t=document.querySelector(".post-toc");if(t?(e.style.display="",e.classList.add("motion-element"),document.querySelector(".sidebar-nav-toc").click()):(e.style.display="none",e.classList.remove("motion-element"),document.querySelector(".sidebar-nav-overview").click()),NexT.utils.initSidebarDimension(),this.isDesktop()&&!this.isPisces()&&!this.isGemini()){var n=CONFIG.page.sidebar;"boolean"!=typeof n&&(n="always"===CONFIG.sidebar.display||"post"===CONFIG.sidebar.display&&t),n&&window.dispatchEvent(new Event("sidebar:show"))}},getScript:function(e,t,n){if(n)t();else{var r=document.createElement("script");r.onload=r.onreadystatechange=function(e,n){(n||!r.readyState||/loaded|complete/.test(r.readyState))&&(r.onload=r.onreadystatechange=null,r=void 0,!n&&t&&setTimeout(t,0))},r.src=e,document.head.appendChild(r)}}};