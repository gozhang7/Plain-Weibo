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

var timeline = "http://weiboapi.com/2/statuses/public_timeline.json";
function getBos() {
	WB2.anyWhere(function(W){
	    W.parseCMD("/statuses/public_timeline.json", function(sResult, bStatus){
	        try{
	            console.log("Result:" + sResult)
	            console.log("Status:" + bStatus)
	        }catch(e){}
	    },{
	        method: 'get'
	    });
	});
}
