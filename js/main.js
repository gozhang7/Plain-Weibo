var home_url = "/statuses/home_timeline.json";
var public_url = "/statuses/public_timeline.json";
var mine_url = "statuses/user_timeline.json";
var since_id;
var max_id;
var counter = 0;
var getPreviousWeibo = 0;
var getNewWeibo = 1;
var resultAmount = 20;
var max_time;
var since_time;

function login() {
	if(!checkStatus()) {
		WB2.login(checkStatus());
	}
	if(checkStatus()) {
		document.getElementById("status").innerHTML = "IN";
		loadWeibos()
	}
	else {
		console.log("Login failed...")
	}
}
function logout() {
	if(checkStatus())
		WB2.logout(checkStatus());
	document.getElementById("status").innerHTML = "OUT";
	document.getElementById("result").innerHTML = "<h3>LOGGED OUT</h3>";
}

function checkStatus() {
	var status = WB2.checkLogin();
	return status;
}

function loadWeibos(refresh, requestType) {
	WB2.anyWhere(function(W){
		if(refresh) {
			counter = 0;
			if(requestType == getPreviousWeibo) {
			    W.parseCMD(home_url, function(sResult, bStatus){
		        	renderResult(sResult, bStatus, refresh, requestType);
			    }, {
			    	max_id: max_id,
			    	count: resultAmount
			    }, {
			        method: 'get',
			        cache_time : 30
			    });
			}
			else {
			    W.parseCMD(home_url, function(sResult, bStatus){
		        	renderResult(sResult, bStatus, refresh);
			    }, {
			    	count: resultAmount
			    }, {
			        method: 'get',
			        cache_time : 30
			    });
			}
		}
		else {
			console.log("Method: more")
			console.log("since_id:" + since_id + " since_time:" + since_time)
			console.log("max_id:" + max_id + " max_time:" + max_time)
		    W.parseCMD(home_url, function(sResult, bStatus){
	        	renderResult(sResult, bStatus, refresh);
		    }, {
		    	since_id: since_id,
		    	count: resultAmount
		    }, {
		        method: 'get',
		        cache_time : 30
		    });
		}
	});
}

function refresh() {
	loadWeibos(true);
}

function more() {
	loadWeibos(false);
}

function previous() {
	loadWeibos(true, getPreviousWeibo);
}

function renderResult(data, status, refresh, requestType) {
	if(status == true) {
		var html = "";
		for (var i = 0; i < data.statuses.length; i++) {
			var text = data.statuses[i].text;
			text = processText(text);
			var date = data.statuses[i].created_at;
			date = date.split('+')[0];
			html += counter + data.statuses.length - i + ": " + date + "<br>";
			html += data.statuses[i].user.name + ": ";
			html += text + "<br><hr>";
			since_id = data.statuses[0].id;
			since_time = data.statuses[0].created_at;
			max_id = data.statuses[data.statuses.length - 1].id;
			max_time = data.statuses[data.statuses.length - 1].created_at;
		}

		counter += data.statuses.length;
			console.log("since_id:" + since_id + " since_time:" + since_time)
			console.log("max_id:" + max_id + " max_time:" + max_time)

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

function processText(data) {
	data = Autolinker.link(data);
	return data;
}
