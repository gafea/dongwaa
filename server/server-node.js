const fs = require('fs');
const path = require('path');
const http = require('http');

var dw = {};
var dwfs = {};
var dwindex = [[], []];
const new_metaDir = 'meta_json';
const new_metaType = '.json';
const getAllFromDir = source => fs.readdirSync(source).map(name => path.join(source, name));
const randomProperty = obj => {var keys = Object.keys(obj); return obj[keys[keys.length * Math.random() << 0]]; };

const pushObjArray = (obj, key, content) => {
  if (typeof obj[key] == 'undefined') { //item = 0
    obj[key] = content; // from nothing to string
  } else if (!Array.isArray(obj[key])) { //item = 1
    obj[key] = [obj[key], content]; // from string to array with 2 string
  } else { //item > 1
    obj[key] = [...obj[key], content]; // from array of string to new array of string with new string added at the end
  }
}

function return404(res) {
  res.writeHead(404, { 'Content-Type': 'application/json', 'Server': 'joutou' });
  res.end(JSON.stringify({ status: 404 }));
}

//dw_fetch
function dw_fetch() {

  dw = {};
  dwfs = {};
  dwindex = [[], []];
  var dwid = '';
  var cnt = '';

  /*  meta structure:
  
    metaDir
      | - 2019
      |     | 2019-01_w6-03h xxx.json
      |     | 2019-01_w6-23h yyy.json
      |     | 2019-07_w6-23h zzz.json
      |       ...
      |
      | - 2020
      |     | 2020-01_w6-03h xxx.json
      |     | 2020-01_w6-23h yyy.json
      |     | 2020-07_w6-23h zzz.json
      |       ...
      |
      | - ...
      |
      | - draft
      |     | 2037-01_w8-00h xxx.json
      |     | 2038-01_w8-00h yyy.json
      |     | 2039-07_w8-00h zzz.json
      |       ...

  */

  try {
    //read folders from each year
    getAllFromDir(new_metaDir).forEach(metaDirFolder => {

      //don't include draft dongwaa in publicly accessable index
      if (metaDirFolder != new_metaDir.concat(path.sep).concat('draft')) {
        fs.readdir(metaDirFolder, function (err, metaDirFiles) {
          if (err) throw err;
          var metaDirFile = '';

          //get filenames from year folder
          for (var i = 0; i < metaDirFiles.length; i++) {

            metaDirFile = metaDirFiles[i];

            //check if filename is correct filetype and not missing dwid
            if (path.extname(metaDirFile) === new_metaType && metaDirFile.split(path.sep).slice(-1).pop().substring(4, 7) != '-00') {

              //add each dwid into dwfs for reverse searching
              dwid = path.basename(metaDirFile.split(' ')[1], new_metaType);
              cnt = metaDirFile.substring(0, metaDirFile.length - new_metaType.length);
              pushObjArray(dwfs, dwid, cnt);

              //read file and add into search index
              //dwindex[0] : tag's content (e.g. 'cakkomilk') -> name/tag/twitter...
              //dwindex[1] : dwid (e.g. '2020-01_w6-03h xxx') -> cnt
              dw[cnt] = JSON.parse(fs.readFileSync(path.join(new_metaDir, cnt.substring(0, 4), cnt + new_metaType), 'utf8'));
              Object.values(dw[cnt].name).forEach(name => { dwindex[0].push(name); dwindex[1].push(cnt) })
              if (Array.isArray(dw[cnt].tag)) { dw[cnt].tag.forEach(tag => { dwindex[0].push(tag); dwindex[1].push(cnt) }) } else if (dw[cnt].tag != undefined) { dwindex[0].push(dw[cnt].tag); dwindex[1].push(cnt) }
              if (dw[cnt].twitter != undefined) { dwindex[0].push(dw[cnt].twitter); dwindex[1].push(cnt) }
            };
          };
        });
      };
    });
  } catch (error) { console.log(error) };

  console.log('[dw_fetch] fetching called');

}
dw_fetch();
setInterval(() => { dw_fetch() }, 43200000); //reload every 12 hours

//outgoing server
const server = http.createServer((req, res) => {

  try {

    var loc = decodeURIComponent(req.url.substring(req.url.indexOf('/', 1) + 1)) // e.g. '/!dwfs/xxx/yyy%3Fid%3Dzzz' -> 'xxx/yyy?id=zzz'

    if (req.url.startsWith('/!dw/')) { //dongwaa metadata

      //read the dw meta data stored in variable
      if (dw[loc] != undefined) {

        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8', 'Server': 'joutou' });
        var dwobj = loc.substring(8).split(' ');
        res.end(JSON.stringify({ status: 200, dwyr: loc.substring(0, 7), dwtt: dwobj[0], dwid: dwobj[1], dwss: dwobj[2], ...dw[loc] }));

      } else { return404(res) }

    } else if (req.url.startsWith('/!dwfs/')) { //dongwaa find season

      if (loc == '') { //if nothing is specified, provide random dongwaa
        var random_dwid = randomProperty(dwfs);
        if (Array.isArray(random_dwid)) { random_dwid = random_dwid[0] };
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8', 'Server': 'joutou' });
        res.end(JSON.stringify({ status: 200, dwfs: random_dwid }));
      } else if (dwfs[loc] == undefined) { //if cannot find the dongwaa as key in variable object dwfs, resp 404
        return404(res);
      } else { //found and resp
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8', 'Server': 'joutou' });
        res.end(JSON.stringify({ status: 200, dwfs: dwfs[loc] }));
      };

    } else if (req.url.startsWith('/!dwdig/')) { //dongwaa search

      //if search term empty then resp 404
      if (loc.length == 0) { return404(res) } else {

        var searchResults = []

        var hvMeta = true
        //try if the search term is excectly a dongwaa meta entry in disk, if yes, skip searching and resp the search term
        try { fs.accessSync(path.join(new_metaDir, loc.substring(0, 4), loc + new_metaType), fs.constants.F_OK) } catch (e) { hvMeta = false }

        if (hvMeta) {

          res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8', 'Server': 'joutou' })
          res.end(JSON.stringify({ status: 200, result: loc }))

        } else {

          //dwindex[0] : tag's content (e.g. 'cakkomilk') -> searchResults
          //dwindex[1] : dwid (e.g. '2020-01_w6-03h xxx') -> searchTags

          searchResults = dwindex[1].slice() //copy dwids into new var for deduction later
          var searchTags = []

          loc.toLowerCase().split(' ').forEach(searchTerm => { //extract search terms in url, the result dwid's tags need to match ALL of the search terms

            searchTags = [] //clear tags
            searchResults.forEach(searchResult => { //for each remaining dwid, push their tags into searchTags, otherwise leave empty spots
              var index = dwindex[1].indexOf(searchResult);
              while (index != -1) {
                searchTags[index] = dwindex[0][index]
                index = dwindex[1].indexOf(searchResult, index + 1);
              }
            })

            searchResults = [] //clear results
            searchTags.forEach((searchTag, index) => { //for each tags, check if it includes the search term, if yes, add the corresponding dwid into searchResults
              if (searchTag && searchTag.toLowerCase().includes(searchTerm) && !searchResults.includes(dwindex[1][index])) {
                searchResults.push(dwindex[1][index])
              }
            })

          }) //after looping through all search terms, remaining dwid will be saved in searchResults

          searchTags = [] //clear tags

          if (searchResults == '') { return404(res) } else {
            res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8', 'Server': 'joutou' })
            res.end(JSON.stringify({ status: 200, result: searchResults }))
          }

          searchResults = [] //clear results

        }

      }

    } else if (req.url.startsWith('/!dwyr/')) { //dongwaa library

      //should be in the format of yyyy-MM, aka length of 7, if not resp 404
      if (loc.length != 7) { return404(res) } else {
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8', 'Server': 'joutou' })
        var snippet = {}
        Object.keys(dw).filter(word => word.startsWith(loc)).forEach(dwid => { //for each dw starts with 'yyyy-MM', add into results, provide snippet too
          snippet[dwid] = {}
          Array.from(["name", "pv_ytemb"]).forEach(keyToCopy => {
            snippet[dwid][keyToCopy] = dw[dwid][keyToCopy]
          })
        })
        res.end(JSON.stringify({ status: 200, snippet: snippet }))
      }

    } else if (req.url == '/!404' || req.url == '/!404/') { //404 html page

      res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8', 'Server': 'joutou' });
      res.end(`<html><head><meta charset="utf-8"><link type="image/ico" rel="shortcut icon" href="https://cakko.ml/favicon.ico"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"><title>404 Not Found</title></head><body><div class="b flx"><a href="/" class="y aobh no_print"><p1><b>Return to Home</b></p1></a><div class="x flx"><div class="p"><div class="flx"><div class="s"><p1><b>404</b></p1></div><h1><b>Not Found</b></h1></div><p1 style="opacity:0.8"><b>The page you're looking for is not found.</b></p1></div>
        <img alt="404 Not Found" class="i" src="data:image/png;base64,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"></div></div><style>
        body{margin:0;background-color:black;font-family:AppleSDGothicNeo-Regular, PingFangHK-Regular, Calibri, Microsoft JhengHei, verdana}
        h1{font-size:1.375em;margin:0} p1{font-size:0.975em}
        .b{color:white;justify-content:space-between;position:fixed;bottom:0;left:0;right:0;border-top:0.15em solid #3f3c39;padding:0.75em;padding:0.75em calc(0.75em + env(safe-area-inset-right)) calc(0.75em + env(safe-area-inset-bottom)) calc(0.75em + env(safe-area-inset-left))}
        .i{object-fit:contain;height:3.25em} .p, .i, .aobh{margin:0.25em} .x, .i{order:1} .y, .p{order:2}
        .s{display:inline;border-radius:0.25em;background-color:#800080;padding:0.1em 0.25em;margin:0.25em 0.375em 0.25em 0}
        .flx{flex-flow:wrap;display:flex;align-items:center} .flx div{vertical-align:middle}
        a{text-decoration:none;color:#3993ff} a:hover{color:#5bb5ff}
        .aobh{transition-duration:0.1s;border-radius:0.5em;padding:0.5em;user-select:none;cursor:pointer}
        .aobh:hover{background:rgba(255,255,255,.05)}
        .aobh:active{background:rgba(255,255,255,.1)}
        .aobh:hover:active{transform:scale(0.95)}
        @media print{.no_print{display:none!important} body, .s{background-color:white} .s{border:1px solid black} .b{color:black} .i{filter:brightness(0.2)}}
        </style></body></html>`);

    } else if (req.url.startsWith('/!acc/')) { //acc server is down, or running in local mode

      res.writeHead(504, { 'Content-Type': 'application/json;charset=utf-8', 'Server': 'joutou' })
      res.end(JSON.stringify({ status: 504 }))

    } else if (req.url == '/favicon.ico') { //favicon

      if (fs.existsSync('favicon.ico')) {
        fs.readFile('favicon.ico', function (err, datax) {
          if (err) { res.writeHead(404); res.end(); } else {
            res.writeHead(200, { 'Content-Type': 'image/x-icon', 'Server': 'joutou' });
            res.end(datax);
          };
        });
      } else { res.writeHead(404); res.end(); }

    } else if (req.url.startsWith('/.well-known/acme-challenge/')) { //acme-challenge

      if (fs.existsSync('C:\webserver\nginx' + req.url)) {
        fs.readFile('C:\webserver\nginx' + req.url, function (err, datax) {
          if (err) { res.writeHead(404); res.end(); } else {
            res.writeHead(200, { 'Content-Type': 'text/plain', 'Server': 'joutou' });
            res.end(datax);
          };
        });
      } else { res.writeHead(404); res.end(); }

    } else if (req.url == '/robots.txt') { //robots.txt

      res.writeHead(200, { 'Content-Type': 'text/plain', 'Server': 'joutou' })
      res.end(`User-agent: *
Allow: /
Allow: /*

Allow: /_dig/
Disallow: /_dig/*

Disallow: /!acc/*`)

    } else { //dongwaa html

      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8', 'Server': 'joutou' });
      fs.readFile('metajson.html', 'utf8', function (err, datax) {
        res.end(datax);
      });

    }

  } catch (error) { console.log(error); res.writeHead(500, { 'Content-Type': 'application/json', 'Server': 'joutou' }); res.end(JSON.stringify({ status: 500 })) }
});
server.listen(7001)
console.log("Server Started / 7001")

//internal api server
const serverAPI = http.createServer((req, res) => {
  console.log(req.url)
  if (req.url == '/dwfetch') {
    dw_fetch()
    res.writeHead(200, { 'Content-Type': 'application/json', 'Server': 'joutou' })
    res.end(JSON.stringify({ status: 200 }))

  } else if (req.url == '/dwfskeys') {
    var r = ``
    Object.keys(dwfs).forEach(key => r += `<option value=\\\"` + key + `\\\">`)
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Server': 'joutou' })
    res.end(`<datalist id=\\\"dwfskeys\\\">` + r + `</datalist>`)
    r = ``

  } else { return404(res) }
})
serverAPI.listen(7002)
console.log("Internal API Server Started / 7002")