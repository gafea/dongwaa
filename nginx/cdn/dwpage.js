function dwPage(dwid_url) {

	showLoading()

	fetch('/!dwfs/' + dwid_url.split('/')[0])
		.then(response => response.json())
		.then(dwfs_resp => {

			if (dwfs_resp.status == 200) {

				init_data(dwfs_resp)

			} else {

				var dwid_guess = decodeURI(dwid_url).split('/')[0].substring(decodeURI(dwid_url).split('/')[0].split(' ')[0].length + 1)
				var guess = dwid_guess.split(' ')[0]
				var guess_dwss = ""
				try { guess_dwss = dwid_guess.split(' ')[1] } catch (error) { guess_dwss = undefined }

				if (guess == '') {on9jai()} else {

				fetch('/!dwfs/' + guess)
					.then(response => response.json())
					.then(dwfs_resp => {
						if (dwfs_resp.status == 200 && (dwfs_resp.dwfs == decodeURI(dwid_url).split('/')[0] || dwfs_resp.dwfs.indexOf(decodeURI(dwid_url).split('/')[0]) > -1)) {

							history.replaceState(null, null, '/'.concat(guess).concat((guess_dwss != undefined) ? '/'.concat(guess_dwss) : ''))
							dwid_url = (guess_dwss != undefined) ? guess.concat('/').concat(guess_dwss) : guess ;
							init_data(dwfs_resp)

						} else {
						
					 		(signinlevel === 2) ? download_data(decodeURI(dwid_url).split('/')[0], dwfs_resp, 0, true, true) : on9jai() ;

						}
					})

				}

			}

		})
		.catch(function (err) {
			console.log('[!dwfs] error: ' + err)
			setTimeout(() => {
				LoadingError(err, true);
			}, 1000)
		});

	function init_data(dwfs_resp) {
		var target_dw = '';
		var noSeasonOne = false;
		var dwss_in_dwfs_pos = 0;

		var url_dwss = decodeURI(dwid_url.split('/')[0]);
		if (dwid_url.split('/')[1] != undefined) { url_dwss += ' '.concat(dwid_url.split('/')[1]) };

		if (Array.isArray(dwfs_resp.dwfs)) { //returned array
			dwfs_resp.dwfs.sort();
			if (dwid_url.split('/')[1] == '') {
				target_dw = dwfs_resp.dwfs[0];
				dwss_in_dwfs_pos = 0;
			} else {
				target_dw = dwfs_resp.dwfs.find(l => l.endsWith(url_dwss));
				dwss_in_dwfs_pos = dwfs_resp.dwfs.findIndex(dwfsX => dwfsX === target_dw);
			};
		} else { //returned single
			target_dw = dwfs_resp.dwfs;
			if (target_dw.split(' ')[2] != undefined) { noSeasonOne = true } //check should expect season 1
		}

		download_data(target_dw, dwfs_resp, dwss_in_dwfs_pos, noSeasonOne, false)
	}

	function download_data(target_dw, dwfs_resp, dwss_in_dwfs_pos, noSeasonOne, try_direct) {
		fetch('/!dw/' + target_dw)
			.then(response => response.json())
			.then(function (dw_resp) {
				if (dw_resp.status == 200) {
					if (try_direct) {
						noacc("direct view does not allow this function")
					} else {
						document.getElementById("topbtn_heart").style.display = 'unset'
						refreshHeart(dw_resp)
						if (noSeasonOne) { history.replaceState(null, null, '/'.concat(dwid_url.split('/')[0]).concat('/').concat(target_dw.split(' ')[2])) }
						else if (dwid_url.split('/')[1] == undefined) { history.replaceState(null, null, window.location.pathname.concat('/')) }
					}
					if (signinlevel === 2) { admin_dwmeta_showedit(target_dw) }
					appendData(dw_resp, dwfs_resp, dwss_in_dwfs_pos, noSeasonOne, try_direct)
					hideLoading()
					hrefToBoot()
				} else { on9jai() }
			})
			.catch(function (err) {
				console.log('[!dwpage] error: ' + err)
				LoadingError(err, true)
			});
	}

	function on9jai() {
		/*hideLoading();
		document.title = '404 - cakko dongwaa';
		document.getElementById("d_cnt").style.display = 'none';
		document.getElementById("d_err").style.display = 'none';
		document.getElementById("d_404").style.display = 'block';
		document.getElementById("x_title").innerHTML = '404';
		document.getElementById("topbtn_heart").style.display = 'none';*/
		initPage('404')
	}

	function refreshHeart(data) {

		var pf = '/!acc/'.concat(authemail).concat('/dwlove/').concat(data.dwid).concat((data.dwss) ? ' '.concat(data.dwss) : '').concat('/')

		if (authemail != undefined) {

			document.getElementById('topbtn_heart').onclick = function () { }
			document.getElementById('topbtn_heart').title = 'Loading...'
			document.getElementById('topbtn_heart_jscss').innerHTML = `<style>
			#topbtn_heart, #topbtn_heart:hover{animation:2.8s ease infinite breathing;user-select:none;cursor:progress}
			#topbtn_heart:hover:active, #topbtn_heart:hover:active > img{transform:scale(1)!important}
			@keyframes breathing { 0% {opacity:1} 25% {opacity:1;filter:grayscale(0)} 62.5% {opacity:0.75;filter:grayscale(1)} 100% {opacity:1;filter:grayscale(0)}}
			</style>`

			fetch(`${pf}`).then(response => response.json())
				.then(dwlovestat => {
					switch (dwlovestat.status) {
						case 200:
							updateHeart(dwlovestat.resp, pf)
							break

						case 403:
							noacc(`Please sign in again.\nYour previous session details are invalid.`)
							break

						case 404:
							noacc(`Something's wrong.\nPlease click the reload button in your browser.`)
							break

						case 500:
							noacc(`Something's wrong, we cannot connect with our server.\nTry again later.`)
							break

						case 502:
						case 503:
						case 504:
							noacc(`Something's wrong, we didn't get a timely response from our server.\nTry again later.`)
							break
					}
				})
				.catch(function (err) { console.log('[!dw_acc_love] error: ' + err); noacc(`Something's wrong, we didn't connect with our server.\nTry again later.`) })
		} else { noacc(`Please sign in first.\nYou'll need an account to like this dongwaa.`) }

	}

	function noacc(msg) {
		document.getElementById('topbtn_heart').onclick = function () {
			alert(msg)
		}
		document.getElementById('topbtn_heart').title = msg
		document.getElementById('topbtn_heart_jscss').innerHTML = `<style>
		#topbtn_heart{filter:grayscale(1);user-select:none;cursor:not-allowed}
		#topbtn_heart > img {filter:contrast(0)}
		#topbtn_heart:hover:active{transform:scale(1)!important}
		</style>`
	}

	function changeHeart(stat, path) {
		if (authemail != undefined) {

			showLoading()

			fetch(path.concat('set?s=').concat((stat) ? '1' : '0'))
				.then(response => response.json())
				.then(dwlovestat => {

					if (dwlovestat.status == 200) {

						updateHeart(stat, path)

						LoadingSuccess()

					} else { LoadingError(dwlovestat.status) }

				}).catch(err => { console.log('[!dw_acc_love_change] error: ' + err); LoadingError(err) })

		}
	}

	function updateHeart(stat, path) {

		var heart = document.getElementById('topbtn_heart')
		var heartcss = document.getElementById('topbtn_heart_jscss')

		if (stat) { //loved before

			heart.title = `unlike this dongwaa`
			heartcss.innerHTML = `<style>
			#topbtn_heart{background-color:rgba(255,32,64,.85)}
			#topbtn_heart:hover{background-color:rgba(255,32,64,0.975)}
			#topbtn_heart > img {filter:brightness(0) invert(1) opacity(0.9)}
			#topbtn_heart:hover > img {filter:brightness(0) invert(1) opacity(1)}
			</style>`

			heart.onclick = function () {
				document.getElementById('topbtn_heart').onclick = function () { }
				changeHeart(false, path)
			}

		} else { //not loved yet

			heart.title = `like this dongwaa`
			heartcss.innerHTML = ''

			heart.onclick = function () {
				document.getElementById('topbtn_heart').onclick = function () { }
				changeHeart(true, path)
			}

		}

	}

	function appendData(data, dwssStrX, ssPos, noSeasonOne, try_direct) {

		document.getElementById("d_err").style.display = 'none';
		document.getElementById("d_404").style.display = 'none';
		document.getElementById("d_cnt").style.display = 'block';

		document.querySelector('.dm_top_cnt_pic').classList.add('pre-animation');


		//set wallpaper
		var toppic = "";
		if (data.pv_ytemb != undefined) {
			if (Array.isArray(data.pv_ytemb)) {
				toppic = data.pv_ytemb.sample().split(',')[1];
				if (toppic == "") {
					toppic = data.pv_ytemb[0].split(',')[1];
				}
			} else {
				toppic = data.pv_ytemb.split(',')[1];
			}
		}
		if (toppic != "") {
			toppic = "https://i.ytimg.com/vi/".concat(toppic).concat("/maxresdefault.jpg")
		} else {
			toppic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
		}
		document.getElementById("d_tpic").src = toppic;


		//set season info and buttons
		var dwssStr = data.dwss;
		if (Array.isArray(dwssStrX.dwfs) && data.dwss == undefined) { dwssStr = '1' };

		var center_dwss = document.getElementById("d_dwssv");
		center_dwss.innerHTML = '';
		if (!noSeasonOne && dwssStr != undefined && dwssStrX.dwfs != undefined) {
			var ssname = '1';
			var urlname = '';
			for (let i = 0; i < dwssStrX.dwfs.length; i++) {
				if (i > 0) { ssname = dwssStrX.dwfs[i].split(' ').slice(-1).pop(); urlname = ssname }

				if (i == ssPos) {
					center_dwss.innerHTML += '<button type="button" tabindex="0" class="dwssview-sel dwssview-sel-s">Season ' + ssname + '<div class="dwssview-sel-tri no_print"></div></button>';
					document.getElementById("x_subtitle").innerHTML = 'Season ' + ssname
				} else {
					center_dwss.innerHTML += `<a href="/`.concat(data.dwid).concat('/').concat(urlname).concat(`" onclick="setTimeout(document.activeElement.blur(), 1000)" class="dwssview-sel dwssview-sel-h">Season `).concat(ssname).concat(`</a>`);
				}
			}
			center_dwss.style.display = 'inline-block';
		} else if (noSeasonOne && ((dwssStrX.dwfs != undefined) || (data.dwss != undefined))) {
			center_dwss.innerHTML += '<button type="button" tabindex="0" class="dwssview-sel dwssview-sel-s">Season ' + ((dwssStrX.dwfs != undefined) ? dwssStrX.dwfs.split(' ').slice(-1).pop() : data.dwss) + '<div class="dwssview-sel-tri no_print"></div></button>';
			center_dwss.style.display = 'inline-block';
			document.getElementById("x_subtitle").innerHTML = 'Season ' + ((dwssStrX.dwfs != undefined) ? dwssStrX.dwfs.split(' ').slice(-1).pop() : data.dwss)
		} else {
			center_dwss.style.display = 'none';
			document.getElementById("x_subtitle").innerHTML = ''
		};

		if (!try_direct) {
			var arrowL = document.getElementById("d_dwss_l");
			if (ssPos > 0) {
				arrowL.style.pointerEvents = 'auto';
				arrowL.style.opacity = 1;

				var target_dwidX = dwssStrX.dwfs[ssPos - 1];
				var cutoffX = target_dwidX.split(' ')[0].length + 1;
				arrowL.onclick = function () { boot('/'.concat(target_dwidX.substring(cutoffX).replace(' ', '/'))) };
			} else {
				arrowL.style.pointerEvents = 'none';
				arrowL.style.opacity = 0;
			};

			var arrowR = document.getElementById("d_dwss_r");
			if (ssPos < dwssStrX.dwfs.length - 1 && Array.isArray(dwssStrX.dwfs)) {
				arrowR.style.pointerEvents = 'auto';
				arrowR.style.opacity = 1;

				var target_dwid = dwssStrX.dwfs[ssPos + 1];
				var cutoff = target_dwid.split(' ')[0].length + 1;
				arrowR.onclick = function () { boot('/'.concat(target_dwid.substring(cutoff).replace(' ', '/'))) };
			} else {
				arrowR.style.pointerEvents = 'none';
				arrowR.style.opacity = 0;
			};
		}


		//set title
		document.getElementById("i_dwyr").innerHTML = '#'.concat(data.dwyr);
		document.getElementById("i_dwyr").href = '/'.concat(data.dwyr);
		document.getElementById("i_dwyr").style.opacity = 1;
		document.getElementById("i_dwtt").innerHTML = phrase_dwtt(data.dwtt);

		var bst = getBestLangSubTitle(data, navigator.language, false);

		if (data.name.ja != undefined) {
			document.title = getBestLangSubTitle(data, navigator.language, true).concat(' - cakko dongwaa');
			document.getElementById("x_title").innerHTML = getBestLangSubTitle(data, navigator.language, true);
			document.getElementById("i_title").innerHTML = data.name.ja;
			document.getElementById("i_subtitle").innerHTML = getBestLangSubTitle(data, navigator.language, false, true);
		} else {
			document.title = bst.concat(' - cakko dongwaa');
			document.getElementById("x_title").innerHTML = bst;
			document.getElementById("i_title").innerHTML = bst;
			document.getElementById("i_subtitle").innerHTML = '';
		}

		var btnx = document.getElementById("d_btnx");
		btnx.innerHTML = '';
		if (data.website != undefined) { btnx.innerHTML += getBtnxHTML(data.website, getHostName(data.website), resourceNETpath + 'ico2/website.png', '#33cc66'); }
		if (data.twitter != undefined) { btnx.innerHTML += getBtnxHTML('https://twitter.com/' + data.twitter, '@' + data.twitter, resourceNETpath + 'twitter.png', '#55acee'); }
		if (data.wiki_en != undefined) { btnx.innerHTML += getBtnxHTML(data.wiki_en, 'Wikipedia', resourceNETpath + 'wiki.png', 'grey'); }

		//timeline
		var start_ep = '1';
		if (data.ep_counter_startfrom != undefined) { start_ep = 1 + parseFloat(data.ep_counter_startfrom); }
		var end_ep = '?';
		if (data.total_ep != undefined) {
			if (data.ep_counter_startfrom != undefined) { end_ep = parseInt(data.total_ep) + parseInt(data.ep_counter_startfrom); } else { end_ep = data.total_ep }
		}
		document.getElementById("t_startd").innerHTML = start_ep;
		document.getElementById("t_endd").innerHTML = end_ep;

		var timeline = document.getElementById("d_timeline");
		var timelineX = document.getElementById("d_timelineX");
		timeline.innerHTML = '';
		timelineX.innerHTML = '';
		renderTimeline();

		async function renderTimeline() {
			//no startdate
			if (data.startdate == undefined || data.startdate == '0001-01-01') {
				timeline.innerHTML += '<div class="timeline_arrow"></div>';
				timeline.innerHTML += '<div class="timeline_arrow"></div>';
				timeline.innerHTML += '<div class="timeline_arrow"></div>';
				timeline.innerHTML += '<div class="label jtx" style="margin:0 0.8em"><p1><b>' + data.dwyr + '</b></p1></div>';
				timelineX.style.display = 'none';
				return true;
			}

			//hv startdate, calc remain time
			var total_ep_calc = 12;
			if (data.total_ep != undefined) { total_ep_calc = data.total_ep }

			var adjRelease = {};
			if (typeof data.special_arri != 'undefined') {
				if (!Array.isArray(data.special_arri)) { //item = 1
					adjRelease[parseInt(data.special_arri.split(',')[0])] = data.special_arri.substring(data.special_arri.split(',')[0].length + 1);
				} else { //item > 1
					for (var i = 0; i < data.special_arri.length; i++) {
						adjRelease[parseInt(data.special_arri[i].split(',')[0])] = data.special_arri[i].substring(data.special_arri[i].split(',')[0].length + 1);
					}
				}
			}

			var dateChanged = [];
			var dateArr = new Array();
			var nextD = new Date(data.startdate + 'T' + data.dwtt.split('-')[1].replace('mh', ':30:00').replace('h', ':00:00') + '+08:00');
			for (var u = 1; (u - 1) < total_ep_calc; u++) {
				if (adjRelease[u] == undefined || adjRelease[u] == "") { //normal, use next 7 days
					dateArr[u] = nextD;
					dateChanged[u] = false;
				} else { //adjusted, set new adjusted date
					dateArr[u] = new Date(adjRelease[u].replace('_', 'T') + ':00+08:00');
					dateChanged[u] = true;
				}
				nextD = dateArr[u].addDays(7);
			}
			adjRelease = {};
			//console.log(dateArr)

			for (x = 1; (x - 1) < total_ep_calc; x++) { if (Date.now() < dateArr[x].getTime()) { break } }
			var xPlus = (data.ep_counter_startfrom != undefined) ? parseInt(data.ep_counter_startfrom) : 0;

			//ongoing dongwaa
			if (x <= total_ep_calc) {
				var releaseDate = dateArr[x];
				var rDateStr = new Date(releaseDate.getTime() - (releaseDate.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
				if (x > 1) { timeline.innerHTML += '<div class="circle_text_mline" style="margin-right:0.6em"><div><div class="circle_text" id="i_timeline_nxt"><p1>' + (x - 1 + xPlus) + '</p1><div id="circle_check"></div></div>' + ((data.total_ep == undefined) ? '<p3>(prediction)</p3>' : '') + '</div></div>'; }
				timeline.innerHTML += '<div class="timeline_arrow" id="d_timeline_arrow3"></div>';
				timeline.innerHTML += '<div class="timeline_arrow" id="d_timeline_arrow2"></div>';
				timeline.innerHTML += '<div class="timeline_arrow" id="d_timeline_arrow1"></div>';
				timeline.innerHTML += '<div class="circle_text_mline" style="margin-left:0.8em"><div><div class="circle_text" id="i_timeline_nxt"><p1>' + (x + xPlus) + '</p1><div class="i_timeline_nxtX"></div></div><p3>' + rDateStr + '</p3></div></div>';
				timelineX.style.display = 'block';
				timelineX.innerHTML += '<div class="label jtx" style="margin:0.4em 0.8em"><b><p1 id="tmr-' + data.dwid + '"></p1></b></div>';

				if (dateChanged[x]) { document.getElementsByClassName('i_timeline_nxtX')[0].setAttribute("id", "circle_delay") }

				renderTimeText(releaseDate.getTime() - Date.now(), document.getElementById('tmr-' + data.dwid), document.getElementsByClassName('i_timeline_nxtX')[0], document.getElementById('d_timeline_arrow1'), document.getElementById('d_timeline_arrow2'), document.getElementById('d_timeline_arrow3'));
				var tid = setInterval(async function () { var ix = (releaseDate.getTime() - Date.now()); renderTimeText(ix, document.getElementById('tmr-' + data.dwid), document.getElementsByClassName('i_timeline_nxtX')[0], document.getElementById('d_timeline_arrow1'), document.getElementById('d_timeline_arrow2'), document.getElementById('d_timeline_arrow3'), tid) }, 59990);
				return true;
			}

			//ended dongwaa
			timelineX.style.display = 'none';
			if (data.total_ep != undefined) {
				var rDateStrE = new Date(dateArr[x - 1].getTime() - (dateArr[x - 1].getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
				timeline.innerHTML += '<div class="circle_text_mline"><div><div class="circle_text" id="i_timeline_nxt"><p1>' + (x - 1 + xPlus) + '</p1><div id="circle_check"></div></div><p3>ended at ' + rDateStrE + '</p3></div></div>';
			} else { //if we don't know the total ep and hv passed 12 weeks from startdate, show question mark instead
				timeline.innerHTML += `<div class="circle_text_mline"><div><div class="circle_text" id="i_timeline_nxt"><p1>?</p1></div><p3>we don't know if it has ended yet</p3></div></div>`;
			}
			return true;

		}

		function renderTimeText(microsec, target, tl_nxt, ar1, ar2, ar3, tid) {
			seconds = Number(microsec / 1000);
			var d = Math.floor(seconds / (3600 * 24));
			var h = Math.floor(seconds % (3600 * 24) / 3600);
			var m = Math.floor(seconds % 3600 / 60);
			//var s = Math.floor(seconds % 60);
			var output = '';

			if (d > 0) { output = d + "d " + h + "h" }
			else if (h > 0) { output = h + "h " + m + "m" }
			else if (m > 0) { output = m + "m" }

			try {
				if (output != '' && microsec > 0) { //still hv time left
					target.innerHTML = output;
					if (d < 2) {
						renderArrow(ar3, 1);
						if (d < 1) {
							renderArrow(ar2, 1);
							if (h < 1) {
								renderArrow(ar1, 1);
							} else { renderArrow(ar1, 0) }
						} else { renderArrow(ar2, 0); renderArrow(ar1, 0) }
					} else { renderArrow(ar3, 0); renderArrow(ar2, 0); renderArrow(ar1, 0) }
				} else { //done
					target.innerHTML = '0m';
					renderArrow(ar1, 1);
					renderArrow(ar2, 1);
					renderArrow(ar3, 1);
					tl_nxt.setAttribute("id", "circle_check");
					clearInterval(tid);
					return false;
				}
			} catch (error) {
				console.log(error);
				clearInterval(tid);
			}
		}

		function renderArrow(ar, target) {
			if (target === 0) { //deactivate
				ar.style.borderTop = '0.2em solid rgba(128,128,128,.3)';
				ar.style.borderRight = '0.2em solid rgba(128,128,128,.3)';
			} else if (target === 1) { //activate
				ar.style.borderTop = '0.35em solid rgba(128,128,128,.7)';
				ar.style.borderRight = '0.35em solid rgba(128,128,128,.7)';
			}
		}



		//pv_ytemb
		var pvHTML = '';
		if (data.pv_ytemb != undefined) {
			if (Array.isArray(data.pv_ytemb)) {
				data.pv_ytemb.sort().reverse().forEach(function callback(pvl, pvlindex) { addpv(pvl, pvlindex) });
				pvHTML += '</div>';
			} else {
				addpv(data.pv_ytemb, 0);
			}
		}

		function addpv(pvl, pvlindex) {
			var pvid = pvl.split(',')[0];
			var pvlx = pvl.substring(pvid.length + 1);
			if (pvlx != undefined && pvlx != '') {
				if (pvlindex == 1) {
					pvHTML += `<button type="button" class="dpv_hide_btn_lbl_wrp no_print" onclick="getElementById('dpv_hidex').style.display = 'flex'; this.style.display = 'none'"><label for="dpv_checkbox" class="dpv_hide_btn_lbl">show more</label></button><input type="checkbox" class="dpv_hide_btn" id="dpv_checkbox"><div class="dpv_hide flx" id="dpv_hidex">`
				}
				pvHTML += '<div id="pv-yt-' + pvlx + '" class="dpv_ytemb"><div class="flx dpv_txt"><div class="label dpv_lvl"><b>PV ' + pvid + '</b></div><a href="https://youtu.be/' + pvlx + '">youtu.be/' + pvlx + '</a></div><iframe src="https://www.youtube-nocookie.com/embed/' + pvlx + '" allowfullscreen frameborder="0"></iframe></div>';
			}
		}
		document.getElementById("d_pv").innerHTML = pvHTML;

		//author & producer & studio
		document.getElementById("rc_author").innerHTML = '<h3>'.concat((data.author != undefined) ? data.author : '???').concat('</h3>')
		document.getElementById("rc_producer").innerHTML = '<h3>'.concat((data.producer != undefined) ? data.producer : '???').concat('</h3>')
		document.getElementById("rc_studio").innerHTML = '<h3>'.concat((data.studio != undefined) ? data.studio : '???').concat('</h3>')

		//sugggest similar
		var suggestHTML = document.getElementById("d_suggest");
		suggestHTML.innerHTML = ''

		for (let si = 0; si < 4; si++) {
			fetch('/!dwfs/')
				.then(response => response.json())
				.then(dwfsR_resp => {

					if (dwfsR_resp.status == 200) {
						var target_dwidR = (Array.isArray(dwfsR_resp.dwfs)) ? dwfsR_resp.dwfs[Math.floor(Math.random() * dwfsR_resp.dwfs.length)] : dwfsR_resp.dwfs;
						var cutoffR = target_dwidR.split(' ')[0].length + 1;
						suggestHTML.innerHTML += `<button class="aobh" style="background:none" onclick="boot('/`.concat(target_dwidR.substring(cutoffR).replace(' ', '/')).concat( (target_dwidR.substring(cutoffR).replace(' ', '/').split('/').length > 1) ? '' : '/' ).concat(`')">random: `).concat(target_dwidR.substring(cutoffR)).concat(`</button>`);
					}

				});
		}

	}

}

Date.prototype.addDays = function (days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}

Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + (h * 60 * 60 * 1000));
	return this;
}

Array.prototype.sample = function () {
	return this[Math.floor(Math.random() * this.length)];
}

function getBestLangSubTitle(data, lang, use_JPN_if_can, allowEmpty) {

	try {

		switch (lang.substring(0, 2).toLowerCase()) {

			case "zh":
				if (data.name.zh != undefined) {
					return data.name.zh;
				} else if (use_JPN_if_can && data.name.ja != undefined) {
					return data.name.ja;
				} else if (data.name.en != undefined) {
					return data.name.en;
				} else if (data.name.romaji != undefined) {
					return data.name.romaji;
				} else {
					return (allowEmpty) ? '' : data.dwid;
				}

			case "en":
				if (data.name.en != undefined) {
					return data.name.en;
				} else if (data.name.romaji != undefined) {
					return data.name.romaji;
				} else {
					return (allowEmpty) ? '' : data.dwid;
				}

			case "ja":
				if (use_JPN_if_can && data.name.ja != undefined) {
					return data.name.ja;
				} else if (data.name.romaji != undefined) {
					return data.name.romaji;
				} else if (use_JPN_if_can) {
					return (allowEmpty) ? '' : data.dwid;
				} else {
					return '';
				}

			default:
				if (use_JPN_if_can && data.name.ja != undefined) {
					return data.name.ja;
				} else if (data.name.en != undefined) {
					return data.name.en;
				} else if (data.name.romaji != undefined) {
					return data.name.romaji;
				} else {
					return (allowEmpty) ? '' : data.dwid;
				}

		}

	} catch (error) {

		return (allowEmpty) ? '' : data.dwid;

	}

}

function findPVpic(pv_ytemb) {

	var url = "";

	while (true) {
		url = "https://i.ytimg.com/vi/" + pv_ytemb.sample().split(',')[1] + "/maxresdefault.jpg";

		var http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();

		if (http.status != 404) {
			return url;
		}
	}

}

function phrase_dwtt(dwtt) {
	if (dwtt != 'w8-00h') {

		var dX = new Date(Date.UTC(2021, 1, dwtt.charAt(1), parseInt(dwtt.split('-')[1].substring(0, 2)), (dwtt.split('-')[1].substring(2) === 'mh') ? 30 : 0))
		dX = dX.addHours(-8) //HKT to UTC

		var weekdayX = dX.toLocaleString(navigator.language, { weekday: 'long' });
		return weekdayX.concat(' ').concat(dX.toLocaleTimeString(navigator.language, { hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit' }).replace('24:', '00:'));

	} else { return 'new!' }
}

function getBtnxHTML(link, text, icoLink, textColor) {
	return '<a style="margin:0.25em;padding:0.75em" class="aobh" href="' + link + '" rel="noopener" target="_blank"><img id="dwhi" src="' + icoLink + '"><p1 style="vertical-align:middle;font-size:medium;font-weight:bolder;color:' + textColor + '"> ' + text + '</p1></a>'
}

function getHostName(url) {
	var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
	if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
		return match[2];
	} else {
		return null;
	}
}

function checkValid_dwyrURL(path) {

	return (path.length === 8 && path[0] === '/' && path.substring(1, 5) > 1899 && path[5] === '-' && path.substring(6, 8) > 0 && path.substring(6, 8) < 13)

}

function reformat_dwyrURL(s, useTodayToJumpAhead) {

	var npath = s.substr(0, 6)

	var canJump = ((new Date()).getDate() > 23)

	switch (s.substring(6, 8)) {

		case '01':
		case '02':
		case '03':
			(useTodayToJumpAhead && canJump && (new Date()).getMonth() === 3) ? npath += '04' : npath += '01'
			break

		case '04':
		case '05':
		case '06':
			(useTodayToJumpAhead && canJump && (new Date()).getMonth() === 6) ? npath += '07' : npath += '04'
			break

		case '07':
		case '08':
		case '09':
			(useTodayToJumpAhead && canJump && (new Date()).getMonth() === 9) ? npath += '10' : npath += '07'
			break

		case '10':
		case '11':
		case '12':
			(useTodayToJumpAhead && canJump && (new Date()).getMonth() === 12) ? npath = '/' + parseInt(s.substr(1, 5) + 1) + '-01' : npath += '10'
			break
	}

	return npath;

}