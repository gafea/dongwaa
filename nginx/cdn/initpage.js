const resourceNETpath = `https://cakko.ml/hid/`

//getPageHTML payload
const bottombarbuttons = [
    'Today,/,tdy,' + resourceNETpath + 'ico2/today.png',
    'Library,/_lib/,lib,' + resourceNETpath + 'ico2/dig.png',
    'Search,/_dig/,dig,' + resourceNETpath + 'ico2/search.png',
    'Settings,/_set/,set,' + resourceNETpath + 'ico2/settings.png'
]

function getPageHTML_home() {
    return `<div class="edge2edge_page" id="dwhomecard"><button class="aobh" style="background:none" onclick="boot('/2021-10_w7-23h 無職轉生 1B')">2021-10_w7-23h 無職轉生 1B</button><br>
    <button class="aobh" style="background:none" onclick="boot('/_lib/')">library</button></div>` + renderBottomBar('tdy')
}

function getPageHTML_library() {
    return `<style>body, html{scroll-behavior:unset} #divheadbuffer{display:none!important} .bottom_wrp{position:fixed!important}
    body{padding-bottom:calc(5vh + 4.5em)} .lib_div{min-height:calc(101vh - 5vh - 4.5em)}
    @media (max-width:950px) { body{padding-bottom:calc(env(safe-area-inset-bottom) + 5.5em)} .lib_div{min-height:calc(101vh - env(safe-area-inset-bottom) - 5.5em)} }
    @media (max-width:520px) { body{padding-bottom:calc(env(safe-area-inset-bottom) + 4.5em)} .lib_div{min-height:calc(101vh - env(safe-area-inset-bottom) - 4.5em)} }
    @media print { .bottom_wrp{display:none!important} }
    </style>` + renderBottomBar('lib')
}

function getPageHTML_search() {
    return `<div class="card" id="card3"><div style="margin:env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left)"><div class="flxb">
    <style>.dwagb:hover > #iL2a{box-shadow: 0 0.5em 1em rgba(0,0,0,.3);transition-duration:0.1s} .dwagb > #iL2a > #iL2ax > #iL3c{margin:0.4em} .dwagb > #iL2a > #iL2ax > .dwts{padding:0;margin:0.4em 0.25em 0.25em 0.25em}</style>
    <div id="iR1"><div style="pointer-events:all"><div class="flx"><p72><b>Search</b></p72></div></div></div></div>
    <div id="iL1"><div id="fdigbtn" class="flx"><label for="search_dw_box"><img alt="Search" src="` + resourceNETpath + `ico2/search.png" draggable="false"></label><p3 id="digsrtxt">Search</p3>
    <form onsubmit="dwSearch('/'.concat(document.getElementById('search_dw_box').value));this.blur();return false"><input autofocus id="search_dw_box" name="dw" type="search" placeholder="dig for dongwaa" value="" title="Search"></form></div>
    <div class="zhGnuWwpNxI" id="search_result"></div>
    </div></div></div></div>` + renderBottomBar('dig')
}

function getPageHTML_settings() {
    return `settings` + renderBottomBar('set')
}

function getPageHTML_dongwaa() {
    return renderTopBar('...', '', `
    <button class="dwhdab no_print" id="topbtn_edit" title="Edit dongwaa" style="display:none">
    <img src="` + resourceNETpath + `ico2/edit.png" draggable="false">
    <style>#topbtn_edit{background-color:rgba(128,128,128,.1)} #topbtn_edit:hover{background-color:rgba(128,128,128,.25)} #topbtn_edit > img{filter:brightness(0.5)} #topbtn_edit:hover:active > img{transform:scale(1.25)}</style>
    </button>
    <button class="dwhdab" id="topbtn_heart" title="Loading...">
    <img src="` + resourceNETpath + `ico2/heart.png" draggable="false">
    <style>#topbtn_heart{background-color:rgba(255,16,16,.1)} #topbtn_heart:hover{background-color:rgba(255,16,16,.25)} #topbtn_heart:hover:active > img{transform:scale(1.25)}</style>
    <div id="topbtn_heart_jscss"></div>
    </button>
    <button class="dwhdab no_print" id="topbtn_refresh" onclick="(event.altKey) ? fetch('/!dwfs/').then(rx => rx.json()).then(r => (r.status == 200) ? (event.shiftKey) ? window.location.href = '/'.concat(r.dwfs) : boot('/'.concat(r.dwfs), false) : window.location.reload(true)) : (event.shiftKey) ? window.location.reload(true) : boot(window.location.pathname, true)" title="Refresh dongwaa\nHold shift to reload page\nHold alt/option to roll a dice">
    <img src="` + resourceNETpath + `ico2/refresh.png" draggable="false">
    <style>#topbtn_refresh{background-color:rgba(48,216,96,.1)} #topbtn_refresh:hover{background-color:rgba(48,216,96,.25)} #topbtn_refresh:hover:active > img{transform:rotate(-45deg)}</style>
    </button>
    <button class="dwhdab no_print" id="topbtn_home" onclick="(event.shiftKey) ? window.open('/', '_blank') : boot('/')" title="Go to homepage\nHold shift to open in new tab">
    <img src="` + resourceNETpath + `ico2/home.png" draggable="false">
    <style>#topbtn_home{background-color:rgba(0,160,255,.1)} #topbtn_home:hover{background-color:rgba(0,160,255,.25)} #topbtn_home:hover:active > img{transform:scale(0.9)}</style>
    </button>
    `, true, `<div id="dwedit" style="display:none"></div>`) + `

    <div id="d_cnt">
    
        <!--topcard-->
        <div class="dm_top_bw">
    
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" class="dm_top_cnt_pic" id="d_tpic" onload="setTimeout(function(){document.querySelector('.dm_top_cnt_pic').classList.remove('pre-animation')},50)">
    
            <div id="d_tbg" class="dm_top_wrp" style="position:relative;background:none!important">
        
                <div class="dm_top_txt_wrp">
                    <div class="dm_top_txt flx edge2edge">
                        <p1><a class="dmbtn" id="i_dwyr" style="opacity:0"></a></p1>
                        <p1 id="i_dwtt"></p1>
                    </div>
                </div>
    
                <div class="flx dm_top_cnt_wrp"><div class="flx dm_top_picker_wrp"><div class="flx dm_top_cnt">
    
                    <div class="flx">
                        <button type="button" id="d_dwss_l" class="home_spotlight_arrow no_print" style="pointer-events:none;opacity:0"><p1 class="symbol">←</p1></button>
    
                        <div class="dwssview flx" tabindex="1002"><p1><b><div class="dwssview-wrp" id="d_dwssv" tabindex="1001"></div></b></p1></div>
                        
                        <button type="button" id="d_dwss_r" class="home_spotlight_arrow no_print" style="pointer-events:none;opacity:0"><p1 class="symbol">→</p1></button>
                    </div>
    
                    <h1 id="i_title"> </h1>
                    <h2 id="i_subtitle" style="opacity:0.5"> </h2>
    
                    <div class="flx dwc_f1"><div class="flx dwc_f1_l2" id="d_btnx" style="flex-flow:wrap!important">
                    </div></div>
    
                </div></div></div>
        
            </div>
    
        </div>
    
    
        <!--timeline-->
        <div class="flx bufLR" style="justify-content:center">
            <div class="dtl_wrp flx ricecake">
                <div class="circle_text_wrp flx circle_text_mline">
                    <div>
                        <div class="circle_text"><p1 id="t_startd"></p1></div>
                        <p3>start</p3>
                    </div>
                    <div>
                        <p1 style="margin:0.4em;opacity:0.6;user-select:none" class="symbol">→</p1>
                        <p3 style="user-select:none"> </p3>
                    </div>
                    <div>
                        <div class="circle_text"><p1 id="t_endd"></p1></div>
                        <p3>end</p3>
                    </div>
                </div>
                <div class="timeline_wrp flx" id="d_timeline"></div><div id="d_timelineX" class="timelineX"></div>
            </div>
        </div>


        <!--author & producer & studio-->
        <div class="edge2edge flx" style="justify-content:center">
            <div class="flx fatrice">
                <div class="ricecake" id="rcw_author" style="margin-left:0">
                    <div class="ricecake_plate">
                        author
                    </div>
                    <div class="ricecake_dots" id="rc_author"></div>
                </div>
                <div class="ricecake" id="rcw_producer">
                    <div class="ricecake_plate">
                        producer
                    </div>
                    <div class="ricecake_dots" id="rc_producer"></div>
                </div>
                <div class="ricecake" id="rcw_studio" style="margin-right:0">
                    <div class="ricecake_plate">
                        studio
                    </div>
                    <div class="ricecake_dots" id="rc_studio"></div>
                </div>
            </div>
            <!--
            <div class="flx fatrice">
                <div class="ricecake" style="max-width:unset">
                    <div class="ricecake_plate">
                        description
                    </div>
                    <div class="ricecake_dots" id="rc_desc"></div>
                </div>
            </div>
            -->
        </div>

    
        <!--pv_ytemb-->
        <div class="flx edge2edge dpv_carrier" id="d_pv" style="padding-top:0!important;padding-bottom:0.5em!important"></div>

        
        <!--suggestion-->
        <div class="card flx" id="d_suggest"></div>

    </div>
    <div class="card" id="d_404" style="display:none">404 not found</div>` + getPageHTML_error()
}

function getPageHTML_error() {
    return `<div class="card" id="d_err" style="display:none;margin:0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);max-width:100vw;overflow:hidden">
    <div class="flx" style="justify-content:flex-start">
        <style>#d_err > .flx > img{object-fit:contain;height:3.25em;margin:0.25em} @media (prefers-color-scheme: light) {#d_err > .flx > img{filter:brightness(.25)}}</style>
        <img alt="Unable to load content" src="https://cakko.ml/nojs.png">
        <div style="margin:0.25em"><h1 style="font-size:1.375em"><b>Unable to load content</b></h1><br>
        <p1 style="opacity:0.8"><b>Something's wrong, we cannot display the page to you.</b></p1></div>
    </div>
    <br><p1 style="opacity:.8"><small><b>
        Here are few things you can do:
    <br><br>
        <ui>
            <li>Hold down the shift key on your keyboard and click the reload button</li>
            <li>Close and re-open your browser</li>
            <li>Tell us you're having problems on this page with the following debug message:</li>
        </ui>
    <br></b></small></p1>
        <textarea style="width:100%;width:calc(100% - env(safe-area-inset-right) - env(safe-area-inset-left) - 0.5em);height:20em" id="d_err_msg">There are no debug message avaliable.</textarea>
    </div>`
}

function getPageHTML_404() {
    return `<meta http-equiv="refresh" content="0;URL=/!404/">`
}

function showLoading() {
    var l = document.getElementById("d_loading");
    l.innerHTML = "";
    l.style.display = 'unset';
    setTimeout(() => {
        l.style.opacity = 1;
        l.style.transform = 'translateX(0)';
    }, 25)
    setTimeout(() => {
        l.style.width = '2.25em';
    }, 25) //75
}

function hideLoading() {
    var l = document.getElementById("d_loading");
    l.style.opacity = 0;
    l.style.transform = 'translateX(-1.5em)';
    setTimeout(() => {
    	l.style.width = '0';
    }, 0) //50
    setTimeout(() => {
        l.style.display = 'none';
        l.innerHTML = "";
    }, 650) //700
}

function LoadingError(err, presistant) {
    showLoading();
    var l = document.getElementById("d_loading");
    l.innerHTML = '<style>#d_loading::before{border-color:#FF4238!important;background-color:#FF4238;color:white;animation:none;content:"✘"}</style>';
    if (presistant) {
        //setTimeout(() => alert(err), 200);
        document.getElementById("x_title").innerHTML = ' ';
        document.getElementById("x_subtitle").innerHTML = '';
        document.getElementById("d_cnt").style.display = 'none';
        document.getElementById("d_404").style.display = 'none';
        document.getElementById("d_err").style.display = 'block';
        document.getElementById("d_err_msg").value = `url: ` + window.location.href + `\ndate: ` + (new Date()).toISOString() + `\nua: ` + navigator.userAgent + `\n\n` + err
    } else {
        setTimeout(() => {
            hideLoading();
            hrefToBoot();
        }, 3000);
    }
}

function LoadingSuccess() {
    showLoading();
    var l = document.getElementById("d_loading");
    l.innerHTML = '<style>#d_loading::before{border-color:#33ff99!important;background-color:#33ff99;color:green;animation:none;content:"✓"}</style>';
    setTimeout(() => {
        hideLoading();
        hrefToBoot();
    }, 3000);
}

function renderTopBar(title = ' ', subtitle = '', buttonHTML = '', showSearch = false, additionalHTML = '') {
    return `<div class="dwdt_top flx">
    <button onclick="window.history.back();" class="acss aobh no_print" style="padding:0.5em;font-size:16px;white-space:pre;transition-duration:0s" id="btn_back" tabindex="0"><b>く back</b></button>
    <div id="d_loading"></div>
    <div class="dwhdt flx dwhdto"><div class="dwhdt"><b onclick="window.scrollTo({top: 0, behavior: 'smooth'})" style="cursor:pointer"><p71 id="x_title">` + title + '</p71><p77 id="x_subtitle">' + subtitle + `</p77></b></div></div>
    <div class="flx dwhda">` + buttonHTML + `</div>` + ((showSearch) ? `
    <div class="pgsbtn flx no_print">
    <label for="search_box" id="topbtn_search" class="dwhdab" onclick="if (event.shiftKey) { window.open('/_dig/', '_blank') }" title="Search box\nHold shift to open in new tab">
        <img alt="Search" src="` + resourceNETpath + `ico2/search.png" draggable="false">
        <style>#topbtn_search{background-color:rgba(160,160,255,.1)} #topbtn_search:hover{background-color:rgba(160,160,255,.25)} #topbtn_search:hover:active > img{transform:rotate(6deg)}</style>
    </label>
    <form onsubmit="boot('/_dig/'.concat(document.getElementById('search_box').value));this.blur();return false"><input id="search_box" name="dw" type="search" placeholder="Search for something..." title="Search for something..."></form>
    </div>` : ``) + additionalHTML + `</div>`
}

function renderBottomBar(loc) {
    return getPageHTML_error() + `<div class="bottom_wrp flx"><a href="/" style="height:52px"><img class="ckimg" src="` + resourceNETpath + `ck.svg" draggable="false" alt="cakko"></a>` + renderBottomBarButtons(bottombarbuttons, loc) + `<div class="ckimg"><div class="flx ckusrico"><button type="button" tabindex="1001" class="ckusrbtn">
    <a href="" tabindex="0"><img alt="" src="https://me.cakko.ml/getpp/" draggable="false"></a>
    <div class="ckusrwrp">
    
        <a tabindex="0" href="https://cakko.ml/terms">Terms</a> • <a tabindex="0" href="https://cakko.ml/privacy">Privacy</a>
         
    </div></button>
    <button type="button" tabindex="1000" class="tabview-close"><img alt="Close" src="` + resourceNETpath + `ico/circle-cross.png" draggable="false"> <p5 style="opacity:0.8"><b>Close</b></p5></button>
    </div></div></div>
    
    <div id="divheadbuffer"></div>`
}

function renderBottomBarButtons(Buttons, SelectedButton) {
    var results = `<form class="tabview flx" tabindex="1002"><div class="tabview-wrp" tabindex="1001">`;
    var btnx = [];
    var hit = false;
    Buttons.forEach(btn => {
        btnx = btn.split(',');

        try {

            if (SelectedButton === btnx[2]) {

                results += `
                <button type="button" tabindex="1000" class="tabview-sel tabview-sel-s">
                <img src="` + btnx[3] + `" draggable="false" alt=""><p3>` + btnx[0] + `</p3><div class="tabview-sel-tri"></div>
                </button>
                `
                hit = true

            } else {

                results += `
                <button onclick="boot('` + btnx[1] + `')" class="tabview-sel tabview-sel-h">
                <img src="` + btnx[3] + `" draggable="false" alt=""><p3>` + btnx[0] + `</p3>
                </button>
                `

            }

        } catch (error) { };
    });

    if (!hit) {
        results += `
        <button type="button" tabindex="1000" class="tabview-sel tabview-sel-s">
        <img src="` + resourceNETpath + `ico2/nullicon.png" draggable="false" alt=""><p3>` + SelectedButton + `</p3><div class="tabview-sel-tri"></div>
        </button>
        `
    }

    results += `</div><button type="button" tabindex="1000" class="tabview-close"><img alt="Close" draggable="false" src="` + resourceNETpath + `ico/circle-cross.png"> <p5 style="opacity:0.8"><b>Close</b></p5></button></form><style>@media only screen and (max-width:520px) {.bottom_wrp > a > .ckimg{display:none!important}}</style>`

    return results
}

//full replace of html content
var prev_call = 'none';
var isRunning_initPage = false;

function initPage(call) {

    if (isRunning_initPage) {
        console.log('[initPage] initPage aready running! '.concat(call).concat(' will be skipped loading.'));
        return false; //stop running post-init code
    }

    isRunning_initPage = true;

    if (prev_call != call) { //if already init page then don't init it again

        var core = document.getElementById('core');
        prev_call = call;

        switch (call) {
            case 'home':
                core.innerHTML = getPageHTML_home();
                break;

            case 'library':
                core.innerHTML = getPageHTML_library();
                break;

            case 'search':
                core.innerHTML = getPageHTML_search();
                break;

            case 'settings':
                core.innerHTML = getPageHTML_settings();
                break;

            case 'dongwaa':
                core.innerHTML = getPageHTML_dongwaa();
                break;

            case 'mgr':
                core.innerHTML = getPageHTML_mgr();
                break;

            case 'mod':
                core.innerHTML = getPageHTML_mod();
                break;

            case '404':
            default:
                core.innerHTML = getPageHTML_404();
                break;
        }

    }

    isRunning_initPage = false;

    return true; //continue running post-init code
}

//make back button works
window.onpopstate = function (event) {
    boot(decodeURIComponent((event.state) ? event.state.plate : window.location.pathname), true)
}

//getting acc info in cookies
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const authemail = getCookie('authemail');

var signinlevel = (authemail != undefined) ? 1 : 0 ;

//add css into html
function installCSS(targetCSS) {
    var stylesheet = document.createElement('link')
    stylesheet.href = resourceNETpath.concat(targetCSS)
    stylesheet.rel = 'stylesheet'
    document.getElementsByTagName('head')[0].appendChild(stylesheet)
}

installCSS('webel.css');
installCSS('dongwaa.css');

//<a href=""> -> <a onclick="boot()">
function hrefInterrupt(event) {
	if (event.target.getAttribute('href').startsWith('/')) {
		event.preventDefault();
		boot(event.target.getAttribute('href'));
	}
}
//usage:
function hrefToBoot() {
    document.querySelectorAll('a').forEach(link => link.addEventListener('click', hrefInterrupt));
}

//load new page
function boot(path, noHistory) {

    //check should add current URL into history, then change URL shown in browser
    (noHistory) ? history.replaceState(null, window.title, path) : history.pushState({ plate: path }, window.title, path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.removeEventListener('scroll', dwLib_scrolling); //remove infinite scroll script from lib
    document.querySelectorAll('.lib_div').forEach(e => e.remove()); //remove lib div from body

    if (path == '/' || path == '' || path == undefined) { //home page
        initPage('home') && dwHome()

    } else if (checkValid_dwyrURL(path)) { //lib page
        initPage('library') && dwLibrary(reformat_dwyrURL(path))

    } else if (path.startsWith('/!')) { //reserved for api call, invalid for HTML
        initPage('404')

    } else if (path.startsWith('/_')) { //function page
        var caller = path.substring(2)

        if (caller.toLowerCase() == 'dig' || caller.toLowerCase().startsWith('dig/')) { //search page
            initPage('search') && dwSearch(decodeURI(caller.substring(3)))

        } else if (caller.toLowerCase() == 'lib' || caller.toLowerCase() == 'lib/') { //lib redirect
            boot(reformat_dwyrURL('/'.concat(new Date().toISOString()), true), true)

        } else if (caller.toLowerCase() == 'set' || caller.toLowerCase().startsWith('set/')) { //settings
            initPage('settings') && dwSettings()

        } else if (caller.toLowerCase() == 'mgr' || caller.toLowerCase().startsWith('mgr/')) { //old dongwaa management
            var siv = setInterval(() => {
               if (signinlevel == 2) {
                clearInterval(siv)
                initPage('mgr')
                dwmgr()
               } else if (signinlevel != -2) {
                clearInterval(siv)
                initPage('404')
               }
            }, 100);

        } else if (caller.toLowerCase() == 'mod' || caller.toLowerCase().startsWith('mod/')) { //dongwaa management
            setTimeout(() => {
                if (signinlevel == 2) {
                    initPage('mod')
                    dwmod()
                   } else if (signinlevel != -2) {
                    initPage('404')
                }
            }, 100);

        } else { //no such function
            initPage('404')

        }

    } else { //dongwaa page & 404 page
        initPage('dongwaa') && dwPage(path.substring(1))

    }

}

boot(window.location.pathname, true)

//keyboard shortcuts
document.addEventListener("keydown", e => {
    if (document.querySelector('#search_dw_box') != document.activeElement) {
        if (e.key === "Shift") {
            document.getElementById('kbShortcutMenuWrp').style.display = 'flex'
            document.getElementById('kbShortcutMenuWrp').style.opacity = 1
        }
    }
});

document.addEventListener("keyup", e => {
    if (e.key === "Shift") {
        document.getElementById('kbShortcutMenuWrp').style.opacity = 0
        setTimeout(() => {document.getElementById('kbShortcutMenuWrp').style.display = 'none'}, 160);
    }
});