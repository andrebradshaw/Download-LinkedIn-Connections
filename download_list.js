/*
- WARNING -
This script will perform ajax requests. A request is sent for each of your connection. 
LinkedIn monitors users actions, and a few hundred page views within an hour can and likely will get you temp banned. 
While these are not page views, I am not willing to test the difference in LinkedIns monitoring. 
Please let me know if you decided to test the boundaries.
You can change the time2wait variable to speed up the operation, but do this with caution. 

-Watch the build video @ https://youtu.be/3-aSSIG2OVo

-This script needs to be run here: https://www.linkedin.com/mynetw…/invite-connect/connections/
*/

var time2wait = 12000; //milliseconds

//csv header as the first item in the first level array
var containArr = [['First Name', 'Last Name', 'Current Job', 'Email', 'Phones', 'Profile Path', '39char Id', 'Tracking Id']];

var pages = Math.ceil(parseInt(checker(tn(cn(document, 'mn-connections__header')[0], 'h1')[0], 'text').replace(/\D+/g, ''))/40);

var yourCSRFtoken = "ajax:1299043396168461531";

//Utilities
function r(s){return s.replace(/,/g, ';')}
function checker(elm, type) {  if (elm != undefined) {    if (type == 'src') {     return elm.getAttribute('src');    }	if (type == 'click') {     elm.click();    }	if (type == 'href') {      return elm.href;    }    if (type == 'text') {      return elm.innerText.trim().replace(/,/g, '');    }    if (type == 'next') {      return elm;    }  } else {    return '';  }}
function reg(elm, n){if(elm != null){return elm[n];}else{return '';}}
function unq(arrgh){	return arrgh.filter((elm,pos,arr) =>{	return arr.indexOf(elm) == pos;});}
var cn = (ob, nm) => {    return ob.getElementsByClassName(nm)  };
var tn = (ob, nm) => {    return ob.getElementsByTagName(nm)  };
function cleanName(fullname) {    var regXcommaplus = new RegExp(",.+");    var regXjunk = new RegExp('\\(|\\)|"|\\s*\\b[jJ][rR]\\b.*|\\s*\\b[sS][rR]\\b.*|\\s*\\bIi\\b.*|\\s*\\bI[Ii][Ii]\\b.*|\\s*\\bI[Vv]\\b.*|\\s+$', 'g');    var regXendDot = new RegExp("\\.$");    return fullname.replace(regXcommaplus, "").replace(regXjunk, "").replace(regXendDot, "");  }
function fixCase(fullname) {    return fullname.replace(/\w\S*/g, function(txt) {      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();    });  }

//takes a 2-demensional array and downloads it as a csv
function downloadr(dat, filename, type) {
  var data = dat.map(itm => {
    return itm.toString().replace(/$/, '\r');
  }).toString().replace(/\r,/g, '\r');
  var file = new Blob([data], {
    type: type
  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 10);
  }
}

function parseContact(type, obj) {
  if (type == 'email') {
    if (obj.emailAddress != undefined) {      return obj.emailAddress;    } 
	else {      return '';    }
  }
  if (type == 'phone') {
    var ph = '';
    if (obj.phoneNumbers != undefined) {      for (o = 0; o < obj.phoneNumbers.length; o++) {        var ph = ph + obj.phoneNumbers[o].number + '; ';      }
    }
    return ph;
  }
}

//processes the response from the initial request; requests a contact record for each of the 40 responses and pushes the record into an array as an array 
function processResponse(obj,n) {
  var rando = Math.round(Math.random() * 100);
  setTimeout(() => {
    if (obj.firstName != null) {
      var fn = r(fixCase(cleanName(obj.firstName)));
      var ln = r(fixCase(cleanName(obj.lastName)));
      var job = r(obj.occupation);
      var pid = obj.publicIdentifier;
      var uid = reg(/.{39}$/.exec(obj.entityUrn), 0);
      var tid = obj.trackingId;

	console.log('getting info for '+ fn + ' ' + ln + ', ' + pid);

      fetch("https://www.linkedin.com/voyager/api/identity/profiles/" + pid + "/profileContactInfo", {
          "credentials": "include",
          "headers": {
            "accept": "application/vnd.linkedin.normalized+json+2.1",
            "accept-language": "en-US,en;q=0.9",
            "csrf-token": yourCSRFtoken,
            "x-li-lang": "en_US",
            "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base_contact_details;WgvdNFDNQf+vEf/i9IIlHw==",
            "x-li-track": "{\"clientVersion\":\"1.2.6128\",\"osName\":\"web\",\"timezoneOffset\":-5,\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}",
            "x-restli-protocol-version": "2.0.0"
          },
          "referrer": "https://www.linkedin.com/in/" + pid + "/",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": null,
          "method": "GET",
          "mode": "cors"
        })
        .then(res => {
          return res.json()
        })
        .then(jdat => {
	  var email = parseContact('email',jdat.data);
	  var phones = parseContact('phone',jdat.data);
	  containArr.push([fn, ln, job, email, phones, pid, uid, tid])
        })
    }
  }, ((n) * time2wait) + rando);

}

function getConnections(n) {
  var rando = Math.round(Math.random() * 100);
  var start = n*40;
  
  setTimeout(() => {
    fetch("https://www.linkedin.com/voyager/api/relationships/connections?start="+start+"&count=40&sortType=RECENTLY_ADDED", {
        "credentials": "include",
        "headers": {
          "accept": "application/vnd.linkedin.normalized+json+2.1",
          "accept-language": "en-US,en;q=0.9",
          "csrf-token": yourCSRFtoken,
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
        var itm = jdat.included;
	for(i=0; i<itm.length; i++){
		processResponse(itm[i], i)
	}
      })
  }, ((n) * (time2wait*40)) + rando)
}

if(/linkedin\.com\/mynetwork\/invite-connect\/connections/.test(window.location.href) === true){

	setTimeout(()=>{
		downloadr(containArr, 'mynetwork.csv', 'data:text/plain;charset=utf-8,')
	},(time2wait*(pages*40))+(time2wait*40));

	for(p=0; p<pages; p++){
		getConnections(p)
	}
	console.log('this will take about '+ Math.round(((((pages*40)*(time2wait/1000))/60)/60)/10)*10 + ' hours to complete')

} else {
	alert('please go to to linkedin.com/mynetwork/invite-connect/connections \n and run this code')
}

