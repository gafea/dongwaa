function renderTopBar(title = ' ', subtitle = '', buttonHTML = '', showSearch = false, additionalHTML = '') {
    return `<div class="topbar flx">
    <button onclick="window.history.back();" class="acss aobh no_print" style="padding:0.5em;font-size:16px;white-space:pre;transition-duration:0s" id="btn_back" tabindex="0" title="back"><b>く<span class="no_mobile"> back</span></b></button>
    <div id="topbar_loading"></div>
    <div class="dwhdt flx dwhdto"><div class="dwhdt">
        <b id="topbar_title_wrap">
            <b id="topbar_title_inwrap_main">
                <h4 id="topbar_title">` + title + '</h4><p4 id="topbar_subtitle">' + subtitle + `</p4>
            </b>
            <b id="topbar_title_inwrap_secondary">
                <h4 id="topbar_inwrap_title"></h4><p4 id="topbar_inwrap_subtitle"></p4>
            </b>
        </b>
    </div></div>
    <div class="flx dwhda">` + buttonHTML + `</div>` + ((showSearch) ? `
    <div class="pgsbtn flx no_print">
    <label for="search_box" id="topbtn_search" class="dwhdab" onclick="if (event.shiftKey) { window.open('/_dig/', '_blank') }" title="Search box\nHold shift to open in new tab">
        <img alt="Search" src="` + resourceNETpath + `image/search.png" draggable="false">
        <style>#topbtn_search{background-color:rgba(160,160,255,.1)} #topbtn_search:hover{background-color:rgba(160,160,255,.25)} #topbtn_search:hover:active > img{transform:rotate(6deg)}</style>
    </label>
    <form onsubmit="boot('/_dig/'.concat(document.getElementById('search_box').value));this.blur();return false"><input id="search_box" name="dw" type="search" placeholder="Search for something..." title="Search for something..."></form>
    </div>` : ``) + additionalHTML + `</div>`
}

function renderBottomBar(loc) {
    return getPageHTML_error() + `<div class="bottom_wrp flx"><a href="/" style="height:52px"><img class="ckimg" src="` + resourceNETpath + `image/ck.svg" draggable="false" alt="cakko"></a>` + renderBottomBarButtons(bottombarbuttons, loc) + `<div class="ckimg"><div class="flx ckusrico"><button type="button" tabindex="1001" class="ckusrbtn">
    <a href="" tabindex="0"><img alt="" src="https://me.cakko.ml/getpp/" draggable="false"></a>
    <div class="ckusrwrp">
    
        <a tabindex="0" href="https://cakko.ml/terms">Terms</a> • <a tabindex="0" href="https://cakko.ml/privacy">Privacy</a>
         
    </div></button>
    <button type="button" tabindex="1000" class="tabview-close"><img alt="Close" src="` + resourceNETpath + `image/circle-cross.png" draggable="false"> <p5 style="opacity:0.8"><b>Close</b></p5></button>
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
        <img src="` + resourceNETpath + `image/nullicon.png" draggable="false" alt=""><p3>` + SelectedButton + `</p3><div class="tabview-sel-tri"></div>
        </button>
        `
    }

    results += `</div><button type="button" tabindex="1000" class="tabview-close"><img alt="Close" draggable="false" src="` + resourceNETpath + `image/circle-cross.png"> <p5 style="opacity:0.8"><b>Close</b></p5></button></form><style>@media only screen and (max-width:520px) {.bottom_wrp > a > .ckimg{display:none!important}}</style>`

    return results
}

var LoadingStatusQueue = 0;

function LoadingStatus(type, presistant = false, title = '', subtitle = '') {
    if (type != 'hide' && LoadingStatusQueue > 0) {
        //console.log('[LoadingStatus] ' + type + ' queued')
        setTimeout(() => {LoadingStatus(type, presistant, title, subtitle)}, 500, type, presistant, title, subtitle);
        return false;
    }

    var l = document.getElementById("topbar_loading");
    var presistTime = 2850;
    switch (type) {
        case 'success':
            LoadingStatus('show')
            presistTime = 2850; LoadingStatusQueue += 1; setTimeout(() => {LoadingStatusQueue -= 1}, presistTime + 750)
            l.innerHTML = '<style>#topbar_loading::before{border-color:#33ff99!important;background-color:#33ff99;color:green;animation:none;content:"✓"}</style>'
            break
        case 'warning':
            LoadingStatus('show')
            presistTime = 6350; LoadingStatusQueue += 1; setTimeout(() => {LoadingStatusQueue -= 1}, presistTime + 750)
            l.innerHTML = '<style>#topbar_loading::before{border-color:#ffaa33!important;animation:none}</style>'
            setTimeout(() => {l.style.opacity = 0.3}, 600)
            setTimeout(() => {l.style.opacity = 1}, 1300)
            setTimeout(() => {l.style.opacity = 0.3}, 2000)
            setTimeout(() => {l.style.opacity = 1}, 2700)
            break
        case 'error':
            LoadingStatus('show')
            presistTime = 6850; LoadingStatusQueue += 1; setTimeout(() => {LoadingStatusQueue -= 1}, presistTime + 750)
            l.innerHTML = '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;color:white;animation:none;content:"✘"}</style>'
            setTimeout(() => {l.innerHTML = '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;animation:none}</style>'}, 850)
            setTimeout(() => {l.innerHTML = '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;color:white;animation:none;content:"✘"}</style>'}, 1350)
            setTimeout(() => {l.innerHTML = '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;animation:none}</style>'}, 1850)
            setTimeout(() => {l.innerHTML = '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;color:white;animation:none;content:"✘"}</style>'}, 2350)
            setTimeout(() => {l.innerHTML = '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;animation:none}</style>'}, 2850)
            setTimeout(() => {l.innerHTML = '<style>#topbar_loading::before{border-color:#FF4238!important;background-color:#FF4238;color:white;animation:none;content:"✘"}</style>'}, 3350)
            break
        case 'show':
            LoadingStatusQueue += 1; setTimeout(() => {LoadingStatusQueue -= 1}, 50)
            l.innerHTML = "";
            l.style.display = 'unset';
            setTimeout(() => {
                l.style.opacity = 1;
                l.style.transform = 'translateX(0)';
                l.style.width = '2.25em';
            }, 25)
            presistant = true;
            break
        case 'hide':
            LoadingStatusQueue += 1; setTimeout(() => {LoadingStatusQueue -= 1}, 700)
            l.style.opacity = 0;
            l.style.transform = 'translateX(-1.5em)';
            setTimeout(() => {
                l.style.width = '0';
            }, 0) //50
            setTimeout(() => {
                l.style.display = 'none';
                l.innerHTML = "";
            }, 650) //700
            presistant = true;
            break
    }
    if (title) {
        document.getElementById("topbar_title_inwrap_main").style.opacity = 0
        document.getElementById("topbar_title_inwrap_secondary").style.opacity = 0
        document.getElementById("topbar_inwrap_title").innerText = title
        document.getElementById("topbar_inwrap_subtitle").innerText = subtitle
        setTimeout(() => {
            document.getElementById("topbar_title_inwrap_main").style.display = 'none';
            document.getElementById("topbar_title_inwrap_secondary").style.opacity = 1;
        }, 200)
    }
    if (!presistant) {
        setTimeout(() => {LoadingStatus('hide')}, presistTime - 300)
        setTimeout(() => {
            document.getElementById("topbar_title_inwrap_secondary").style.opacity = 0
        }, presistTime - 200)
        setTimeout(() => {
            document.getElementById("topbar_title_inwrap_main").style.display = 'block'
            document.getElementById("topbar_inwrap_title").innerText = ''
            document.getElementById("topbar_inwrap_subtitle").innerText = ''
            setTimeout(() => {document.getElementById("topbar_title_inwrap_main").style.opacity = 1}, 200)
        }, presistTime)
    }
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

//<a href=""> -> <a onclick="boot()">
function hrefInterrupt(event) {
	if (event.target.getAttribute('href').startsWith('/')) {
		event.preventDefault();
		boot(event.target.getAttribute('href'));
	}
}

//list of post-script cleanup
function postCleanup() {
    document.querySelectorAll('a').forEach(link => link.addEventListener('click', hrefInterrupt));
}

//load new page
var prev_boot_call = 'none';
var isBootRunning = false;

function boot(path, noHistory) {

    //check if boot is already running, prevent accidental double-clicking and overwriting
    if (isBootRunning) {
        console.log('[boot] boot aready running! current process: '.concat(prev_boot_call).concat(', ').concat(path).concat(' will be skipped loading.'));
        return false; //stop running boot
    }

    isBootRunning = true;

    //check should add current URL into history, then change URL shown in browser
    (noHistory) ? history.replaceState(null, window.title, path) : history.pushState({ plate: path }, window.title, path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    //window.removeEventListener('scroll', dwLib_scrolling); //remove infinite scroll script from lib
    //document.querySelectorAll('.lib_div').forEach(e => e.remove()); //remove lib div from body

    if (path == '/' || path == '' || path == undefined) { //home page
        path = '/';

    } else if (path.startsWith('/!')) { //reserved for api call, invalid for HTML, no init and no script
        path = undefined;

    } else { //any other page
        //path = path;

    }

    if (prev_boot_call != path) { //if already init page then don't init it again

        prev_boot_call = path;
        document.getElementById('core').innerHTML = init(path);
        postCleanup();

    }

    exe(path);

    isBootRunning = false;

    return true;
}

boot(window.location.pathname, true)