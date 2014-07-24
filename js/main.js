function login() {
	WB2.login(checkStatus());
	getBos();
}
function logout() {
	WB2.logout(checkStatus());
}

function checkStatus() {
	var status = WB2.checkLogin();
	if(status == true) {
		document.getElementById("status").innerHTML = "IN";
		getBos();
	}
	else
		document.getElementById("status").innerHTML = "OUT";
}

var timeline = "https://api.weibo.com/2/statuses/public_timeline.json";
function getBos() {
	$.get(timeline, function(data) {
		console.log(data);
	});
}
