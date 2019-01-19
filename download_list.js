

function r(s){return s.replace(/,/g, ';')}
function checker(elm, type) {  if (elm != undefined) {    if (type == 'src') {     return elm.getAttribute('src');    }	if (type == 'click') {     elm.click();    }	if (type == 'href') {      return elm.href;    }    if (type == 'text') {      return elm.innerText.trim().replace(/,/g, '');    }    if (type == 'next') {      return elm;    }  } else {    return '';  }}
function reg(elm, n){if(elm != null){return elm[n];}else{return '';}}
function unq(arrgh){	return arrgh.filter((elm,pos,arr) =>{	return arr.indexOf(elm) == pos;});}
var cn = (ob, nm) => {    return ob.getElementsByClassName(nm)  };
var tn = (ob, nm) => {    return ob.getElementsByTagName(nm)  };
function cleanName(fullname) {    var regXcommaplus = new RegExp(",.+");    var regXjunk = new RegExp('\\(|\\)|"|\\s*\\b[jJ][rR]\\b.*|\\s*\\b[sS][rR]\\b.*|\\s*\\bIi\\b.*|\\s*\\bI[Ii][Ii]\\b.*|\\s*\\bI[Vv]\\b.*|\\s+$', 'g');    var regXendDot = new RegExp("\\.$");    return fullname.replace(regXcommaplus, "").replace(regXjunk, "").replace(regXendDot, "");  }
function fixCase(fullname) {    return fullname.replace(/\w\S*/g, function(txt) {      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();    });  }


function processResponse(obj){
	var arr = [];
	for(i=0; i<obj.length; i++){
		if(obj[i].firstName != null){
			var fn = r(fixCase(cleanName(obj[i].firstName)));
			var ln = r(fixCase(cleanName(obj[i].lastName)));
			var job = r(obj[i].occupation);
			var pid = obj[i].publicIdentifier;
			var uid = reg(/.{39}$/.exec(obj[i].entityUrn),0);
			var tid = obj[i].trackingId;
			arr.push([fn,ln,job,pid,uid,tid])
        }
	}
	return arr;
}

var containArr = [];

function getConnections(n) {
  var rando = Math.round(Math.random() * 100);
  var start = p*40;
  
  setTimeout(() => {
    fetch("https://www.linkedin.com/voyager/api/relationships/connections?start="+start+"&count=40&sortType=RECENTLY_ADDED", {
        "credentials": "include",
        "headers": {
          "accept": "application/vnd.linkedin.normalized+json+2.1",
          "accept-language": "en-US,en;q=0.9",
          "csrf-token": "ajax:1299043396168461531",
          "x-li-lang": "en_US",
          "x-li-page-instance": "urn:li:page:d_flagship3_people_connections;vz0YKnqaSuWtzlVxHdCPHw==",
          "x-li-track": "{\"clientVersion\":\"1.2.6128\",\"osName\":\"web\",\"timezoneOffset\":-5,\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}",
          "x-restli-protocol-version": "2.0.0"
        },
        "referrer": "https://www.linkedin.com/mynetwork/invite-connect/connections/",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors"
      })
      .then(res => {
        return res.json();
      })
      .then(jdat => {
        containArr.push(processResponse(jdat.included))
      })
  }, ((n) * 5000) + rando)
}

var pages = Math.ceil(parseInt(checker(tn(cn(document, 'mn-connections__header')[0], 'h1')[0], 'text').replace(/\D+/g, ''))/40);

for(p=0; p<pages; p++){
	getConnections(p)
}
