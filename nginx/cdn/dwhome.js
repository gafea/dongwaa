//dwhome
function dwHome() {

    if (window.location.pathname != '/') { history.replaceState(null, null, '/') }

    document.title = 'cakko dongwaa'

    hrefToBoot();

}

var dwLib_lovelist = [];
var dwLib_dwyrAppended = [];
var dwLib_dwDivPos = [];
var dwLib_prevPos = 0;
var dwLib_pendingLoad = false;

function dwLib_boot(d) {
    dwLib_dwyrAppended = []
    dwLib_dwDivPos = []
    dwLib_prevPos = 0
    dwLib_pendingLoad = false

    window.addEventListener('scroll', dwLib_scrolling)
    dwLib_getSnippet(d, true, true)
}

function dwLib_nextSeason(current, nextSeason) {
    var yr = parseInt(current.substring(1, 5))
    var mn = parseInt(current.substring(6, 8))

    var newStr = ''

    switch (mn) {
        case 1:
            newStr = (nextSeason) ? '/' + yr + '-04' : '/' + (yr - 1) + '-10';
            break;

        case 4:
            newStr = (nextSeason) ? '/' + yr + '-07' : '/' + yr + '-01';
            break;

        case 7:
            newStr = (nextSeason) ? '/' + yr + '-10' : '/' + yr + '-04';
            break;

        case 10:
            newStr = (nextSeason) ? '/' + (yr + 1) + '-01' : '/' + yr + '-07';
            break;

        default:
            break;
    }

    return newStr;
}

function findNearestLarger(arr, val) {
    return Math.max.apply(null, arr.filter(v => { return v <= val }))
}

function dwLib_scrolling() {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

    if (!dwLib_pendingLoad) {
        if (scrollTop + clientHeight * 1.25 > scrollHeight) {
            dwLib_pendingLoad = true
            setTimeout(() => { dwLib_pendingLoad = false }, 3000)
            dwLib_dwyrAppended.sort()
            setTimeout(dwLib_getSnippet(dwLib_nextSeason(dwLib_dwyrAppended[dwLib_dwyrAppended.length - 1], true), true), 200)
        }

        if (scrollTop < clientHeight * 0.1) {
            dwLib_pendingLoad = true
            setTimeout(() => { dwLib_pendingLoad = false }, 3000)
            dwLib_dwyrAppended.sort()
            setTimeout(dwLib_getSnippet(dwLib_nextSeason(dwLib_dwyrAppended[0], false), false), 200)
        }
    }

    try {
        var u = findNearestLarger(dwLib_dwDivPos, (scrollTop + clientHeight * 0.1))
        if (u != -1 && u != dwLib_prevPos) {
            dwLib_prevPos = u;
            document.title = '🗓 '.concat(dwLib_dwyrAppended[dwLib_dwDivPos.findIndex(i => i == u)].substring(1)).concat(' - cakko dongwaa')
            history.replaceState(null, window.title, dwLib_dwyrAppended[dwLib_dwDivPos.findIndex(i => i == u)])
        }
    } catch (error) {

    }
}

function timezoning_dwid(dwid) {

    var dwtt = dwid.split(' ')[0].split('_')[1]

    if (dwtt == 'w8-00h') {return dwid}

    var dX = new Date(Date.UTC(2021, 1, dwtt.charAt(1), parseInt(dwtt.split('-')[1].substring(0, 2)), (dwtt.split('-')[1].substring(2) === 'mh') ? 30 : 0))
    dX = dX.addHours(-8) //HKT to UTC
    
    return dwid.split(' ')[0].split('_')[0].concat('_w'.concat(dX.getDay().toString().replace('0', '7')).concat('-').concat(dX.toLocaleTimeString(navigator.language, { hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit' }).replace('24:', '00:').replace(':00', 'h').replace(':30', 'mh'))).concat(' ').concat(dwid.substring(dwid.split(' ')[0].length + 1))

}

function dwLib_createPost(id, snippet, putBottom, firstTime) {
    var timezoned_dwid = {}
    Object.keys(snippet).forEach(dwid => timezoned_dwid[timezoning_dwid(dwid)] = snippet[dwid])

    var postHTML = `<div class="dwdt_top flx" style="z-index:1;position:sticky"><div class="dwhdt flx dwhdto" style="width:auto"><div class="dwhdt"><b><p71 id="x_title">` + id + `</p71></b></div></div> 
    <button class="dwhdab no_print" id="topbtn_today" title="Scroll to today" onclick="document.getElementById(reformat_dwyrURL('/'.concat(new Date().toISOString()), true).substring(1)).scrollIntoView()">
        <img src="` + resourceNETpath + `ico2/libtoday.png" draggable="false">
        <style>#topbtn_today{background-color:rgba(128,128,128,.1)} #topbtn_today:hover{background-color:rgba(128,128,128,.25)} #topbtn_today > img{filter:brightness(0.5)} #topbtn_today:hover:active > img{transform:translateY(0)}</style>
    </button>
    <div class="pgsbtn flx no_print">
    <label for="search_dw_box-` + id + `" id="topbtn_search" class="dwhdab" onclick="if (event.shiftKey) { window.open('/_dig/', '_blank') }" title="Search dongwaa\nHold shift to open in new tab">
        <img alt="dig for dongwaa" src="` + resourceNETpath + `ico2/search.png" draggable="false">
        <style>#topbtn_search{background-color:rgba(160,160,255,.1)} #topbtn_search:hover{background-color:rgba(160,160,255,.25)} #topbtn_search:hover:active > img{transform:rotate(6deg)} @media (max-width:950px) and (min-width:521px) {.pgsbtn form{width:10em}}</style>
    </label>
    <form onsubmit="boot('/_dig/'.concat(document.getElementById('search_dw_box-` + id + `').value));this.blur();return false"><input id="search_dw_box-` + id + `" name="dw" type="search" placeholder="dig for dongwaa" title="dig for dongwaa"></form>
    </div></div><br>`;

    postHTML += `<div class="edge2edge lib_cal">`
    var calendar_items = [[],[],[],[],[],[],[],[]]
    Object.keys(timezoned_dwid).forEach(dwid => calendar_items[parseInt(dwid.split('_')[1].split(' ')[0][1]) - 1].push(dwid))

    for (let i = 0; i < 24; i++) { postHTML += `<div class="lib_week_id" style="grid-row:` + (i * 2 + 1) + `/` + (i * 2 + 2) + `">` + i + `</div>` }
    calendar_items.forEach((week_dwid, week_id) => {

        for (let hour = 0; hour < 48; hour++) {
            postHTML += `<div class="lib_week_item" style="grid-row:` + (hour + 1) + `;grid-column:` + (week_id + 2) + `">`
            week_dwid.filter(dwid => ((hour / 2).toString().split('.')[0] == parseInt(dwid.split('_')[1].split(' ')[0].split('-')[1].substring(0,2)) && dwid.split('_')[1].split(' ')[0].split('-')[1][2] == ((hour % 2 == 0) ? 'h' : 'm')))
                .forEach(dwid => {
                    postHTML += `<a class="aobh" style="display:inline-block" href="/` + dwid.substring(dwid.split(' ')[0].length + 1).replace(' ', '/') + `">` + ((dwLib_lovelist.includes(dwid.substring(dwid.split(" ")[0].length + 1))) ? '⭐ ' : '') + `<b>` + ((timezoned_dwid[dwid].name.ja != undefined) ? timezoned_dwid[dwid].name.ja + `</b><br><small>` + getBestLangSubTitle(timezoned_dwid[dwid], navigator.language, false, true) + `</small>` : getBestLangSubTitle(timezoned_dwid[dwid], navigator.language, false) + `</b>`) + `</a>`
                })
            postHTML += `</div>`
        }

    });
    postHTML += `</div>`

    const post = document.createElement('div');
    post.className = 'lib_div';
    post.id = id;
    post.innerHTML = postHTML;

    document.body.insertAdjacentElement((putBottom) ? 'beforeend' : 'afterbegin', post)
    try { if (!putBottom) { document.getElementById(dwLib_nextSeason('/' + id, true).substring(1)).scrollIntoView() } } catch (error) { }

    dwLib_dwDivPos = []
    Array.from(document.getElementsByClassName('lib_div')).forEach(lib_div => {
        dwLib_dwDivPos.push(lib_div.offsetTop)
    })

    hrefToBoot();
    if (firstTime) { window.scrollTo(0, 1) }
}

function dwLib_getSnippet(dwyr, putBottom, firstTime) {

    if (!dwLib_dwyrAppended.includes(dwyr) && (new Date().getFullYear() + 2) >= parseInt(dwyr.substring(1, 5)) && (1960 <= parseInt(dwyr.substring(1, 5)))) {

        dwLib_dwyrAppended.push(dwyr)
        dwLib_dwyrAppended.sort()

        fetch('/!dwyr' + dwyr)
            .then(response => response.json())
            .then(resp => {

                dwLib_pendingLoad = false

                if (prev_call === 'library') {

                    if (resp.status != 200 || Object.keys(resp.snippet).length == 0) {

                        (firstTime) ? boot('/_lib/', true) : dwLib_createPost(dwyr.substring(1), resp.snippet, putBottom, firstTime)

                    } else {

                        dwLib_createPost(dwyr.substring(1), resp.snippet, putBottom, firstTime)

                    }

                }

            })
            .catch(function (err) {
                console.log('[!lib] error: ' + err);
                /*document.getElementById("d_err").style.display = 'block';
                document.getElementById("d_err_msg").value = `url: ` + window.location.href + `\ndate: ` + (new Date()).toISOString() + `\nua: ` + navigator.userAgent + `\n\n` + err*/
            });

    }
}

//dwlibrary
function dwLibrary(d) {

    document.title = '🗓 '.concat(d.substring(1)).concat(' - cakko dongwaa')
    history.replaceState(null, null, d)

    if (signinlevel > 0) {

        fetch('/!acc/'.concat(authemail).concat('/dwlovelist/'))
            .then(response => response.json())
            .then(resp => {

                if (resp.status == 200) {

                    dwLib_lovelist = resp.list

                }

                dwLib_boot(d)

            })
            .catch(function (err) {
                console.log('[!lib] error: ' + err)
                dwLib_boot(d)
            })

    } else { dwLib_boot(d) }
    
}


//dwsearch
function dwSearch(q) {

    if (q == '' || q == '/' || q == undefined) { //empty query
        document.getElementById("search_result").innerHTML = `<br><br><center><img class="searchimg" src="` + resourceNETpath + `img/bigsearch.png" alt="Search"><br><br><p1 style="opacity:0.8"><b>Obāsan where should I go?</b></p1></center>`;
        document.title = 'Search - cakko dongwaa'
        history.replaceState(null, null, '/_dig/');
        var img = new Image();
        img.src = resourceNETpath + 'img/bigsearch_empty.png';

    } else if (checkValid_dwyrURL(q)) { //query is a dwyr, go directly to library
        boot(reformat_dwyrURL(q))

    } else {

        document.title = '🔍 '.concat(q.substring(1)).concat(' - cakko dongwaa');
        history.replaceState(null, null, '/_dig' + q);
        document.getElementById('search_dw_box').value = q.substring(1);

        var r = document.getElementById("search_result");
        r.innerHTML = '<div class="flx" style="justify-content:center;margin-top:1.5em"><div style="margin:0.5em"><div id="d_loading"></div></div><small><b><p1 id="search_result_txt" style="opacity:0.8">Loading...</p1></b></small></div>';

        fetch('/!dwdig' + q)
            .then(response => response.json())
            .then(digr => {

                if (digr.status != 200) { on9jai() } else {

                    if (digr.result.length > 1) { //digr result is always an array, check if array count more then 1
                        r.innerHTML = '';
                        var more_then_one_dw = false;
                        digr.result.forEach(res => {
                            if (!more_then_one_dw && res.split(' ')[1] != digr.result[0].split(' ')[1]) { more_then_one_dw = true } // there are more then one dongwaa found (ignore season)
                            r.innerHTML = '<br><a href="/' + res.substring(res.split(' ')[0].length + 1).replace(' ', '/') + '" class="aobh">' + res + '</a>' + r.innerHTML
                        });

                        hrefToBoot();

                        if (!more_then_one_dw) { //go directly to latest season if only one dongwaa found (ignore season)
                            boot('/'.concat(digr.result[digr.result.length - 1].substring(digr.result[digr.result.length - 1].split(' ')[0].length + 1).replace(' ', '/')), true)
                        }

                    } else { //go directly
                        var newurl = digr.result[0].substring(digr.result[0].split(' ')[0].length + 1).replace(' ', '/');
                        boot('/'.concat(newurl).concat((newurl.split('/').length > 1) ? '' : '/'), true)
                    }

                };

            })
            .catch(function (err) {
                console.log('[!dig] error: ' + err);
                r.innerHTML += '<style>#d_loading::before{border-color:#FF4238!important;background-color:#FF4238;color:white;animation:none;content:"✘"}</style>';
                document.getElementById("search_result_txt").innerHTML = 'Failed to load<br>Error message: '.concat(err);
            });

        function on9jai() {
            document.getElementById("search_result").innerHTML = `<br><br><center><img class="searchimg" src="` + resourceNETpath + `img/bigsearch_empty.png" alt="Search"><br><br><p1 style="opacity:0.8"><b>Not much great matches were found. Try again with different keywords?</b></p1></center>`;
        }
    }
}


//dwsettings
function dwSettings() {

    document.title = 'Settings - cakko dongwaa'

}