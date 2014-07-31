var HOME_URL = "/statuses/home_timeline.json";
var PUBLIC_URL = "/statuses/public_timeline.json";
var MINE_URL = "statuses/user_timeline.json";
var since_id;
var max_id;
var counter = 0;
var getPreviousWeibo = 0;
var getNewWeibo = 1;
var RESULTAMOUNT = 20;
var max_time;
var since_time;

$(document).ready(init);

function init() {
	if(status()) {
		document.getElementById("status").innerHTML = "IN";
		refresh();
	}
}

function login() {
	if(!status()) {
		WB2.login(status());
	}
	if(status()) {
		document.getElementById("status").innerHTML = "IN";
		loadWeibos();
	}
	else {
		alert("Login failed...");
	}
}
function logout() {
	if(status())
		WB2.logout();
	document.getElementById("status").innerHTML = "OUT";
	document.getElementById("result").innerHTML = "<h3>LOGGED OUT</h3>";
}

function status() {
	var status = WB2.checkLogin();
	return status;
}

function checkStatus() {
	if(!status())
		alert("Please login first...");
}

/*
*	Load weibos
*	@url: url to send request to
*	@refresh: is this request a refresh or request more. Refresh quest will clear all previous data while request more will not.
*	@requestType: request previous data or new data
*/
function loadWeibos(url, refresh, id, requestType) {
	checkStatus();
	WB2.anyWhere(function(W){
		if(refresh)
			counter = 0;
		if(requestType == getNewWeibo) {
		    W.parseCMD(url, function(sResult, bStatus){
	        	renderResult(sResult, bStatus, refresh);
		    }, {
		    	since_id: id,
		    	count: RESULTAMOUNT
		    }, {
		        method: 'get',
		        cache_time : 30
		    });
		}

		if(requestType == getPreviousWeibo) {
		    W.parseCMD(url, function(sResult, bStatus){
	        	renderResult(sResult, bStatus, refresh);
		    }, {
		    	max_id: id,
		    	count: RESULTAMOUNT
		    }, {
		        method: 'get',
		        cache_time : 30
		    });
		}
	});
}

function refresh() {
	loadWeibos(HOME_URL, true, 0, getNewWeibo);
}

function more() {
	loadWeibos(HOME_URL, false, since_id, getNewWeibo);
}

function previous() {
	loadWeibos(HOME_URL, true, max_id, getPreviousWeibo);
}

function renderResult(data, status, refresh) {
	if(status == true) {
		var html = formatWeibo(data);

		if(refresh)
			document.getElementById("result").innerHTML = html;
		else
			document.getElementById("result").innerHTML = html + document.getElementById("result").innerHTML;
	}
	else {
		document.getElementById("result").innerHTML = "Error, see console for more detail";
		console.log(data);
	}
}

function formatWeibo(data) {
	var html = "";
	if(data) {
		for (var i = 0; i < data.statuses.length; i++) {
			var text = processText(data.statuses[i].text);
			var date = (data.statuses[i].created_at).split('+')[0];
			var midImg = data.statuses[i].bmiddle_pic;
			var username = data.statuses[i].user.name;
			var reweiboImg = data.statuses[i].retweeted_status ? data.statuses[i].retweeted_status.bmiddle_pic : null;
			var reweiboText = data.statuses[i].retweeted_status ? processText(data.statuses[i].retweeted_status.text) : null;
			var reweiboName = data.statuses[i].retweeted_status ? processText(data.statuses[i].retweeted_status.user.name) : null;

			html += "<div class=weibo id=weibo_" + (counter + data.statuses.length - i) + ">";
			html += counter + data.statuses.length - i + ": " + date + "<br>";
			html += username + ": " + text;

			if(midImg)
				html += " <a href=" + midImg + " target=_blank>" + "[Img]" + "</a>";
			if(reweiboText && reweiboName) {
				html += "<br><div class=innerWeibo>" + reweiboName + ": " + reweiboText;	
				if(reweiboImg)
					html += " <a href=" + reweiboImg + " target=_blank>" + "[Img]" + "</a></div>";
			}
			html += "<hr></div>";

			since_id = data.statuses[0].id;
			since_time = data.statuses[0].created_at;
			max_id = data.statuses[data.statuses.length - 1].id;
			max_time = data.statuses[data.statuses.length - 1].created_at;
		}
		counter += data.statuses.length;
	}
	return html;
}

function processText(data) {
	data = Autolinker.link(data, {newWindow: true, twitter: false});
	return data;
}
