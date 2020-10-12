/* global NexT, CONFIG */
HTMLElement.prototype.wrap=function(e){this.parentNode.insertBefore(e,this),this.parentNode.removeChild(this),e.appendChild(this)},
// https://caniuse.com/#feat=mdn-api_element_classlist_replace
"function"!=typeof DOMTokenList.prototype.replace&&(DOMTokenList.prototype.replace=function(e,t){this.remove(e),this.add(t)}),NexT.utils={
/**
   * Wrap images with fancybox.
   */
wrapImageWithFancyBox:function(){document.querySelectorAll(".post-body :not(a) > img, .post-body > img").forEach(e=>{const t=$(e),o=t.attr("data-src")||t.attr("src"),n=t.wrap(`<a class="fancybox fancybox.image" href="${o}" itemscope itemtype="http://schema.org/ImageObject" itemprop="url"></a>`).parent("a");t.is(".post-gallery img")?n.attr("data-fancybox","gallery").attr("rel","gallery"):t.is(".group-picture img")?n.attr("data-fancybox","group").attr("rel","group"):n.attr("data-fancybox","default").attr("rel","default");const a=t.attr("title")||t.attr("alt");a&&(n.append(`<p class="image-caption">${a}</p>`),
// Make sure img title tag will show correctly in fancybox
n.attr("title",a).attr("data-caption",a))}),$.fancybox.defaults.hash=!1,$(".fancybox").fancybox({loop:!0,helpers:{overlay:{locked:!1}}})},registerExtURL:function(){document.querySelectorAll("span.exturl").forEach(e=>{const t=document.createElement("a");
// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
t.href=decodeURIComponent(atob(e.dataset.url).split("").map(e=>"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)).join("")),t.rel="noopener external nofollow noreferrer",t.target="_blank",t.className=e.className,t.title=e.title,t.innerHTML=e.innerHTML,e.parentNode.replaceChild(t,e)})},
/**
   * One-click copy code support.
   */
registerCopyCode:function(){let e=document.querySelectorAll("figure.highlight");0===e.length&&(e=document.querySelectorAll("pre")),e.forEach(e=>{if(e.querySelectorAll(".code .line span").forEach(e=>{e.classList.forEach(t=>{e.classList.replace(t,"hljs-"+t)})}),!CONFIG.copycode)return;e.insertAdjacentHTML("beforeend",'<div class="copy-btn"><i class="fa fa-copy fa-fw"></i></div>');const t=e.querySelector(".copy-btn");t.addEventListener("click",()=>{const o=(e.querySelector(".code")||e.querySelector("code")).innerText,n=document.createElement("textarea");n.style.top=window.scrollY+"px",// Prevent page scrolling
n.style.position="absolute",n.style.opacity="0",n.readOnly=!0,n.value=o,document.body.append(n),n.select(),n.setSelectionRange(0,o.length),n.readOnly=!1;const a=document.execCommand("copy");t.querySelector("i").className=a?"fa fa-check-circle fa-fw":"fa fa-times-circle fa-fw",n.blur(),// For iOS
t.blur(),document.body.removeChild(n)}),e.addEventListener("mouseleave",()=>{setTimeout(()=>{t.querySelector("i").className="fa fa-copy fa-fw"},300)})})},wrapTableWithBox:function(){document.querySelectorAll("table").forEach(e=>{const t=document.createElement("div");t.className="table-container",e.wrap(t)})},registerVideoIframe:function(){document.querySelectorAll("iframe").forEach(e=>{if(["www.youtube.com","player.vimeo.com","player.youku.com","player.bilibili.com","www.tudou.com"].some(t=>e.src.includes(t))&&!e.parentNode.matches(".video-container")){const t=document.createElement("div");t.className="video-container",e.wrap(t);const o=Number(e.width),n=Number(e.height);o&&n&&(t.style.paddingTop=n/o*100+"%")}})},registerScrollPercent:function(){const e=document.querySelector(".back-to-top"),t=document.querySelector(".reading-progress-bar");
// For init back to top in sidebar if page was scrolled after page refresh.
window.addEventListener("scroll",()=>{if(e||t){const o=document.body.scrollHeight-window.innerHeight,n=o>0?Math.min(100*window.scrollY/o,100):0;e&&(e.classList.toggle("back-to-top-on",Math.round(n)>=5),e.querySelector("span").innerText=Math.round(n)+"%"),t&&(t.style.width=n.toFixed(2)+"%")}if(!Array.isArray(NexT.utils.sections))return;let o=NexT.utils.sections.findIndex(e=>e&&e.getBoundingClientRect().top>0);-1===o?o=NexT.utils.sections.length-1:o>0&&o--,this.activateNavByIndex(o)}),e&&e.addEventListener("click",()=>{window.anime({targets:document.scrollingElement,duration:500,easing:"linear",scrollTop:0})})},
/**
   * Tabs tag listener (without twitter bootstrap).
   */
registerTabsTag:function(){
// Binding `nav-tabs` & `tab-content` by real time permalink changing.
document.querySelectorAll(".tabs ul.nav-tabs .tab").forEach(e=>{e.addEventListener("click",t=>{
// Prevent selected tab to select again.
if(t.preventDefault(),e.classList.contains("active"))return;
// Add & Remove active class on `nav-tabs` & `tab-content`.
[...e.parentNode.children].forEach(t=>{t.classList.toggle("active",t===e)});
// https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
const o=document.getElementById(e.querySelector("a").getAttribute("href").replace("#",""));[...o.parentNode.children].forEach(e=>{e.classList.toggle("active",e===o)}),
// Trigger event
o.dispatchEvent(new Event("tabs:click",{bubbles:!0}))})}),window.dispatchEvent(new Event("tabs:register"))},registerCanIUseTag:function(){
// Get responsive height passed from iframe.
window.addEventListener("message",({data:e})=>{if("string"==typeof e&&e.includes("ciu_embed")){const t=e.split(":")[1],o=e.split(":")[2];document.querySelector(`iframe[data-feature=${t}]`).style.height=parseInt(o,10)+5+"px"}},!1)},registerActiveMenuItem:function(){document.querySelectorAll(".menu-item a[href]").forEach(e=>{const t=e.pathname===location.pathname||e.pathname===location.pathname.replace("index.html",""),o=!CONFIG.root.startsWith(e.pathname)&&location.pathname.startsWith(e.pathname);e.classList.toggle("menu-item-active",e.hostname===location.hostname&&(t||o))})},registerLangSelect:function(){document.querySelectorAll(".lang-select").forEach(e=>{e.value=CONFIG.page.lang,e.addEventListener("change",()=>{const t=e.options[e.selectedIndex];document.querySelectorAll(".lang-select-label span").forEach(e=>{e.innerText=t.text}),
// Disable Pjax to force refresh translation of menu item
window.location.href=t.dataset.href})})},registerSidebarTOC:function(){this.sections=[...document.querySelectorAll(".post-toc li a.nav-link")].map(e=>{const t=document.getElementById(decodeURI(e.getAttribute("href")).replace("#",""));
// TOC item animation navigate.
return e.addEventListener("click",e=>{e.preventDefault();const o=t.getBoundingClientRect().top+window.scrollY;window.anime({targets:document.scrollingElement,duration:500,easing:"linear",scrollTop:o+10})}),t})},activateNavByIndex:function(e){const t=document.querySelectorAll(".post-toc li a.nav-link")[e];if(!t||t.classList.contains("active-current"))return;document.querySelectorAll(".post-toc .active").forEach(e=>{e.classList.remove("active","active-current")}),t.classList.add("active","active-current");let o=t.parentNode;for(;!o.matches(".post-toc");)o.matches("li")&&o.classList.add("active"),o=o.parentNode;
// Scrolling to center active TOC element if TOC content is taller then viewport.
const n=document.querySelector(".post-toc-wrap");window.anime({targets:n,duration:200,easing:"linear",scrollTop:n.scrollTop-n.offsetHeight/2+t.getBoundingClientRect().top-n.getBoundingClientRect().top})},supportsPDFs:function(){const e=navigator.userAgent,t=e.includes("irefox")&&parseInt(e.split("rv:")[1].split(".")[0],10)>18,o=void 0!==navigator.mimeTypes["application/pdf"],n=/iphone|ipad|ipod/i.test(e.toLowerCase());return t||o&&!n},getComputedStyle:function(e){const t=e.cloneNode(!0);t.style.position="absolute",t.style.visibility="hidden",t.style.display="block",e.parentNode.appendChild(t);const o=t.clientHeight;return e.parentNode.removeChild(t),o},
/**
   * Init Sidebar & TOC inner dimensions on all pages and for all schemes.
   * Need for Sidebar/TOC inner scrolling if content taller then viewport.
   */
initSidebarDimension:function(){const e=document.querySelector(".sidebar-nav"),t=document.querySelector(".sidebar-inner .back-to-top"),o=e?e.offsetHeight:0,n=t?t.offsetHeight:0,a=CONFIG.sidebar.offset||12;let r=2*CONFIG.sidebar.padding+o+n;"Pisces"!==CONFIG.scheme&&"Gemini"!==CONFIG.scheme||(r+=2*a);
// Initialize Sidebar & TOC Height.
const i=document.body.offsetHeight-r+"px";document.documentElement.style.setProperty("--sidebar-wrapper-height",i)},updateSidebarPosition:function(){if(NexT.utils.initSidebarDimension(),window.screen.width<992||"Pisces"===CONFIG.scheme||"Gemini"===CONFIG.scheme)return;
// Expand sidebar on post detail page by default, when post has a toc.
const e=document.querySelector(".post-toc");let t=CONFIG.page.sidebar;"boolean"!=typeof t&&(
// There's no definition sidebar in the page front-matter.
t="always"===CONFIG.sidebar.display||"post"===CONFIG.sidebar.display&&e),t&&window.dispatchEvent(new Event("sidebar:show"))},getScript:function(e,t,o){if(o)t();else{let o=document.createElement("script");o.onload=o.onreadystatechange=function(e,n){(n||!o.readyState||/loaded|complete/.test(o.readyState))&&(o.onload=o.onreadystatechange=null,o=void 0,!n&&t&&setTimeout(t,0))},o.src=e,document.head.appendChild(o)}},loadComments:function(e,t){const o=document.querySelector(e);if(!CONFIG.comments.lazyload||!o)return void t();const n=new IntersectionObserver((e,o)=>{e[0].isIntersecting&&(t(),o.disconnect())});return n.observe(o),n}};;
/* global NexT, CONFIG */
NexT.motion={},NexT.motion.integrator={queue:[],init:function(){return this.queue=[],this},add:function(e){const t=e();return CONFIG.motion.async?this.queue.push(t):this.queue=this.queue.concat(t),this},bootstrap:function(){CONFIG.motion.async||(this.queue=[this.queue]),this.queue.forEach(e=>{const t=window.anime.timeline({duration:200,easing:"linear"});e.forEach(e=>{e.deltaT?t.add(e,e.deltaT):t.add(e)})})}},NexT.motion.middleWares={header:function(){const e=[];function t(t,o=!1){e.push({targets:t,opacity:1,top:0,deltaT:o?"-=200":"-=0"})}var o;return t(".header"),"Mist"===CONFIG.scheme&&(o=".logo-line",e.push({targets:o,scaleX:[0,1],duration:500,deltaT:"-=200"})),"Muse"===CONFIG.scheme&&t(".custom-logo-image"),t(".site-title"),t(".site-brand-container .toggle",!0),t(".site-subtitle"),("Pisces"===CONFIG.scheme||"Gemini"===CONFIG.scheme)&&t(".custom-logo-image"),document.querySelectorAll(".menu-item").forEach(t=>{e.push({targets:t,complete:()=>t.classList.add("animated","fadeInDown"),deltaT:"-=200"})}),e},subMenu:function(){const e=document.querySelectorAll(".sub-menu .menu-item");return e.length>0&&e.forEach(e=>{e.classList.add("animated")}),[]},postList:function(){const e=[],{post_block:t,post_header:o,post_body:n,coll_header:s}=CONFIG.motion.transition;function i(t,o){t&&document.querySelectorAll(o).forEach(o=>{e.push({targets:o,complete:()=>o.classList.add("animated",t),deltaT:"-=100"})})}return i(t,".post-block, .pagination, .comments"),i(s,".collection-header"),i(o,".post-header"),i(n,".post-body"),e},sidebar:function(){const e=document.querySelector(".sidebar"),t=CONFIG.motion.transition.sidebar;
// Only for Pisces | Gemini.
return!t||"Pisces"!==CONFIG.scheme&&"Gemini"!==CONFIG.scheme?[]:[{targets:e,complete:()=>e.classList.add("animated",t)}]},footer:function(){return[{targets:document.querySelector(".footer"),opacity:1}]}};;
/* global NexT, CONFIG */
NexT.boot={},NexT.boot.registerEvents=function(){NexT.utils.registerScrollPercent(),NexT.utils.registerCanIUseTag(),
// Mobile top menu bar.
document.querySelector(".site-nav-toggle .toggle").addEventListener("click",e=>{e.currentTarget.classList.toggle("toggle-close");const t=document.querySelector(".site-nav");if(!t)return;const i=document.body.classList.contains("site-nav-on"),o=NexT.utils.getComputedStyle(t);t.style.height=i?o:0;const n=()=>document.body.classList.toggle("site-nav-on"),a=()=>{t.style.overflow="hidden"},s=()=>{t.style.overflow="",t.style.height=""};window.anime(Object.assign({targets:t,duration:200,height:i?[o,0]:[0,o],easing:"linear"},i?{begin:a,complete:()=>{s(),n()}}:{begin:()=>{a(),n()},complete:s}))});document.querySelectorAll(".sidebar-nav li").forEach((e,t)=>{e.addEventListener("click",()=>{if(e.matches(".sidebar-toc-active .sidebar-nav-toc, .sidebar-overview-active .sidebar-nav-overview"))return;const i=document.querySelector(".sidebar-inner"),o=document.querySelectorAll(".sidebar-panel"),n=["sidebar-toc-active","sidebar-overview-active"];window.anime({duration:200,targets:o[1-t],easing:"linear",opacity:0,translateY:[0,-20],complete:()=>{
// Prevent adding TOC to Overview if Overview was selected when close & open sidebar.
i.classList.replace(n[1-t],n[t]),window.anime({duration:200,targets:o[t],easing:"linear",opacity:[0,1],translateY:[-20,0]})}})})}),window.addEventListener("resize",NexT.utils.initSidebarDimension),window.addEventListener("hashchange",()=>{const e=location.hash;if(""!==e&&!e.match(/%\S{2}/)){const t=document.querySelector(`.tabs ul.nav-tabs li a[href="${e}"]`);t&&t.click()}})},NexT.boot.refresh=function(){
/**
   * Register JS handlers by condition option.
   * Need to add config option in Front-End at 'scripts/helpers/next-config.js' file.
   */
CONFIG.prism&&window.Prism.highlightAll(),CONFIG.fancybox&&NexT.utils.wrapImageWithFancyBox(),CONFIG.mediumzoom&&window.mediumZoom(".post-body :not(a) > img, .post-body > img",{background:"var(--content-bg-color)"}),CONFIG.lazyload&&window.lozad(".post-body img").observe(),CONFIG.pangu&&window.pangu.spacingPage(),CONFIG.exturl&&NexT.utils.registerExtURL(),NexT.utils.registerCopyCode(),NexT.utils.registerTabsTag(),NexT.utils.registerActiveMenuItem(),NexT.utils.registerLangSelect(),NexT.utils.registerSidebarTOC(),NexT.utils.wrapTableWithBox(),NexT.utils.registerVideoIframe()},NexT.boot.motion=function(){
// Define Motion Sequence & Bootstrap Motion.
CONFIG.motion.enable&&NexT.motion.integrator.add(NexT.motion.middleWares.header).add(NexT.motion.middleWares.postList).add(NexT.motion.middleWares.sidebar).add(NexT.motion.middleWares.footer).bootstrap(),NexT.utils.updateSidebarPosition()},document.addEventListener("DOMContentLoaded",()=>{NexT.boot.registerEvents(),NexT.boot.refresh(),NexT.boot.motion()});;
/* global CONFIG */
document.addEventListener("DOMContentLoaded",()=>{"use strict";const e=()=>{localStorage.setItem("bookmark"+location.pathname,window.scrollY)},t=()=>{let e=localStorage.getItem("bookmark"+location.pathname);e=parseInt(e,10),
// If the page opens with a specific hash, just jump out
isNaN(e)||""!==location.hash||
// Auto scroll to the position
window.anime({targets:document.scrollingElement,duration:200,easing:"linear",scrollTop:e})};!function(o){
// Create a link element
const n=document.querySelector(".book-mark-link");
// Scroll event
window.addEventListener("scroll",()=>n.classList.toggle("book-mark-link-fixed",0===window.scrollY)),
// Register beforeunload event when the trigger is auto
"auto"===o&&(
// Register beforeunload event
window.addEventListener("beforeunload",e),document.addEventListener("pjax:send",e)),
// Save the position by clicking the icon
n.addEventListener("click",()=>{e(),window.anime({targets:n,duration:200,easing:"linear",top:-30,complete:()=>{setTimeout(()=>{n.style.top=""},400)}})}),t(),document.addEventListener("pjax:success",t)}(CONFIG.bookmark.save)});;
/* global CONFIG */
document.addEventListener("DOMContentLoaded",()=>{if(!CONFIG.path)
// Search DB path
return void console.warn("`hexo-generator-searchdb` plugin is not installed!");
// Popup Window
let e,t=!1;const n=document.querySelector(".search-input"),o=(e,t,n=!1)=>{const o=[],r=new Set;return e.forEach(e=>{if(CONFIG.localsearch.unescape){const t=document.createElement("div");t.innerText=e,e=t.innerHTML}const s=e.length;if(0===s)return;let c=0,i=-1;for(n||(t=t.toLowerCase(),e=e.toLowerCase());(i=t.indexOf(e,c))>-1;)o.push({position:i,word:e}),r.add(e),c=i+s}),
// Sort index by position of keyword
o.sort((e,t)=>e.position!==t.position?e.position-t.position:t.word.length-e.word.length),[o,r]},r=(e,t,n)=>{let o=n[0],{position:r,word:s}=o;const c=[],i=new Set;for(;r+s.length<=t&&0!==n.length;){i.add(s),c.push({position:r,length:s.length});const e=r+s.length;
// Move to next position of hit
for(n.shift();0!==n.length&&(o=n[0],r=o.position,s=o.word,e>r);)n.shift()}return{hits:c,start:e,end:t,count:i.size}},s=(e,t)=>{let n="",o=t.start;for(const{position:r,length:s}of t.hits)n+=e.substring(o,r),o=r+s,n+=`<mark class="search-keyword">${e.substr(r,s)}</mark>`;return n+=e.substring(o,t.end),n},c=()=>{if(!t)return;const c=n.value.trim().toLowerCase(),i=c.split(/[-\s]+/),l=document.querySelector(".search-result-container");let a=[];if(c.length>0&&(
// Perform local searching
a=(t=>{const n=[];return e.forEach(({title:e,content:c,url:i})=>{
// The number of different keywords included in the article.
const[l,a]=o(t,e),[h,u]=o(t,c),d=new Set([...a,...u]).size,p=l.length+h.length;if(0===p)return;const g=[];0!==l.length&&g.push(r(0,e.length,l));let f=[];for(;0!==h.length;){const e=h[0],{position:t}=e,n=Math.max(0,t-20),o=Math.min(c.length,t+80);f.push(r(n,o,h))}
// Sort slices in content by included keywords' count and hits' count
f.sort((e,t)=>e.count!==t.count?t.count-e.count:e.hits.length!==t.hits.length?t.hits.length-e.hits.length:e.start-t.start);
// Select top N slices in content
const m=parseInt(CONFIG.localsearch.top_n_per_article,10);m>=0&&(f=f.slice(0,m));let C="";(i=new URL(i,location.origin)).searchParams.append("highlight",t.join(" ")),0!==g.length?C+=`<li><a href="${i.href}" class="search-result-title">${s(e,g[0])}</a>`:C+=`<li><a href="${i.href}" class="search-result-title">${e}</a>`,f.forEach(e=>{C+=`<a href="${i.href}"><p class="search-result">${s(c,e)}...</p></a>`}),C+="</li>",n.push({item:C,id:n.length,hitCount:p,includedCount:d})}),n})(i)),1===i.length&&""===i[0])l.classList.add("no-result"),l.innerHTML='<div class="search-result-icon"><i class="fa fa-search fa-5x"></i></div>';else if(0===a.length)l.classList.add("no-result"),l.innerHTML='<div class="search-result-icon"><i class="far fa-frown fa-5x"></i></div>';else{a.sort((e,t)=>e.includedCount!==t.includedCount?t.includedCount-e.includedCount:e.hitCount!==t.hitCount?t.hitCount-e.hitCount:t.id-e.id);const e=CONFIG.i18n.hits.replace(/\$\{hits}/,a.length);l.classList.remove("no-result"),l.innerHTML=`<div class="search-stats">${e}</div>\n        <hr>\n        <ul class="search-result-list">${a.map(e=>e.item).join("")}</ul>`,window.pjax&&window.pjax.refresh(l)}},i=()=>{const n=!CONFIG.path.endsWith("json");fetch(CONFIG.path).then(e=>e.text()).then(o=>{
// Get the contents from search data
t=!0,e=n?[...(new DOMParser).parseFromString(o,"text/xml").querySelectorAll("entry")].map(e=>({title:e.querySelector("title").textContent,content:e.querySelector("content").textContent,url:e.querySelector("url").textContent})):JSON.parse(o),
// Only match articles with non-empty titles
e=e.filter(e=>e.title).map(e=>(e.title=e.title.trim(),e.content=e.content?e.content.trim().replace(/<[^>]+>/g,""):"",e.url=decodeURIComponent(e.url).replace(/\/{2,}/g,"/"),e)),
// Remove loading animation
c()})},l=()=>{const e=(()=>{const e=location.search,t=e.substr(e.indexOf("?")+1).split("&"),n={};for(const e of t){const[t,o]=e.split("=",2);t in n?n[t].push(o):n[t]=[o]}return n})(),t=e.highlight?e.highlight[0].split(/\+/).map(decodeURIComponent):[],n=document.querySelector(".post-body");if(!t.length||!n)return;const s=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,null,!1),c=[];for(;s.nextNode();)s.currentNode.parentNode.matches("button, select, textarea")||c.push(s.currentNode);c.forEach(e=>{const[n]=o(t,e.nodeValue);if(!n.length)return;((e,t,n)=>{const o=e.nodeValue;let r=t.start;const s=[];for(const{position:e,length:c}of t.hits){const t=document.createTextNode(o.substring(r,e));r=e+c;const i=document.createElement("mark");i.className=n,i.appendChild(document.createTextNode(o.substr(e,c))),s.push(t,i)}e.nodeValue=o.substring(r,t.end),s.forEach(t=>{e.parentNode.insertBefore(t,e)})})(e,r(0,e.nodeValue.length,n),"search-keyword")})};l(),CONFIG.localsearch.preload&&i(),"auto"===CONFIG.localsearch.trigger?n.addEventListener("input",c):(document.querySelector(".search-icon").addEventListener("click",c),n.addEventListener("keypress",e=>{"Enter"===e.key&&c()})),
// Handle and trigger popup window
document.querySelectorAll(".popup-trigger").forEach(e=>{e.addEventListener("click",()=>{document.body.classList.add("search-active"),
// Wait for search-popup animation to complete
setTimeout(()=>n.focus(),500),t||i()})});
// Monitor main search box
const a=()=>{document.body.classList.remove("search-active")};document.querySelector(".search-pop-overlay").addEventListener("click",e=>{e.target===document.querySelector(".search-pop-overlay")&&a()}),document.querySelector(".popup-btn-close").addEventListener("click",a),document.addEventListener("pjax:success",()=>{l(),a()}),window.addEventListener("keyup",e=>{"Escape"===e.key&&a()})});