var pubip;
var API_URL;
var gymInfo;
var cost = 0;
var stripe = Stripe('pk_test_51aGVpf9lEQ8sSjiRtFPhSDz00qrPP3vCl');
var elements = stripe.elements();
var card;

function initUI(pubip) {
	window.pubip = pubip;
	window.API_URL = "http://"+pubip+":3000";
	getGymInfo();
	//renderModals("#root");
}

function checkIfLoggedIn() {
	let userInfo = checkCookie();
	if (userInfo !== false) {
                window.userID = userInfo.userID;
                window.username = userInfo.username;
                window.accountType = userInfo.acctType;
                localStorage.setItem('username', window.username);
                localStorage.setItem('userID', window.userID);
		return true;
        } else {
		alert("Please login or create an account first before making a reservation.");
		window.location.replace('http://gg.mymsseprojects.com');
		return false;
        }
}

//function renderModals(id) {
//	$(id).append(
//		"<div class='modal fade' id='payment' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>"
//			+"<div class='modal-dialog' role='document'>"
//				+"<div class='modal-content'>"
//					+"<div class='modal-header'>"
//						+"<h5 class='modal-title'>Payment</h5>"
//						+"<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"
//							+"<span aria-hidden='true'>&times;</span>"
//						+"</button>"
//					+"</div>"
//					+"<div class='modal-body'>"
//						+"<div id='card-element'></div>"
//		                		+"<div id='card-errors' role='alert'></div>"
//					+"</div>"
//					+"<div class='modal-footer'>"
//						+"<button type='button' class='btn btn-primary' onclick='submitPayment();'>Submit Payment</button>"
//					+"</div>"
//				+"</div>"
//			+"</div>"
//		+"</div>"
//	);
//}

function submitPayment() {
	let loggedIn = checkIfLoggedIn();
	if (loggedIn === true) {
		let gi   = window.gymInfo;
		let cost = gi.cost;
		let loc  = gi.locationofGym;
		let oid  = gi.gymOwner;
		let gid  = gi.gymID;
		let gem  = localStorage.getItem('username');
		let uid  = localStorage.getItem('userID');
		let dobj = $('#datepicker').datepicker('getDate');

		let date = dobj.getFullYear() + "-" + (((dobj.getMonth() + 1) < 9) ? '0'+(dobj.getMonth()+1) : (dobj.getMonth()+1)) + "-" + ((dobj.getDate() < 9) ? '0'+dobj.getDate() : dobj.getDate());

		prepareChargeInfo(cost, oid, gem, loc, date, gid, uid);
	}
}

function prepareChargeInfo(cost, oid, gem, loc, date, gid, uid) {
	$.get(window.API_URL+"/owners/"+oid, function(data, status) {
		let oem = data.Item.username;
		processPayment(cost, oem, gem, loc, date, oid, gid, uid);
	});
}

function processPayment(cost, oem, gem, loc, date, oid, gid, uid) {
	console.log(cost);
	console.log(oem);
	console.log(gem);
	console.log(loc);
	console.log(date);
	console.log(oid);
	console.log(gid);
	console.log(uid);
	$.redirect('http://'+pubip+':5000/', {'chargeAmount':cost, 'ownerEmail':oem, 'userEmail':gem, 'gymLocation':loc, 'reserveDate':date.toString(), 'userID':uid, 'gymID':gid});
}
function getGymInfo() {
	let id = window.gymID;

	$.ajax({
		url: window.API_URL+"/gym/"+id,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			window.gymInfo = data.Items[0];
			renderUI();
			getGymImageUrl();
		}
	});
}

function getGymImageUrl() {
	let id = window.gymID;
	$.ajax({
		url: window.API_URL+"/gymPicture/"+id,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			console.log(data);
			$('#gym_image').append(
				"<img src='"+data+"' alt='gym.jpg' style='width: 100%'>"
			);
		}
	});
}

function renderUI() {
	let g = window.gymInfo;
	window.cost = parseInt(g.cost);
	let e = JSON.parse(g.attributes);

	$("#root").append(
		"<nav class='navbar navbar-light bg-dark' style='margin-bottom: 20px;'>" 
			+"<a class='navbar-brand' href='http://gg.mymsseprojects.com'>"
				+"<img src='/imgs/favicon.ico'>"
			+"</a>"
		+"</nav>"
		+"<div class='container-fluid'>"
			+"<div class='row'>"
				+"<div class='col-6' id='gym_info' style='border-right: 3px solid #eeeeee;'>"
				+"</div>"
				+"<div class='col-6' id='gym_equipments'>"
				+"</div>"
			+"</div>"
			+"<hr/>"
			+"<div class='row'>"
				+"<div class='col-12' id='gym_reservation'>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
	$('#gym_info').append(
		"<div class='container-fluid'>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<h3>Gym Information</h3>"
					+"<p class='lead'>Address: "+g.locationofGym+"</p>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<p class='lead'>Price: <strong>$"+g.cost+"</strong></p>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col' id='gym_image' style='margin-bottom: 20px;'>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col text-center'>"
					+"<div id='rating' class='starrr'></div>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
	$('#gym_equipments').append(
		"<div class='container-fluid'>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<h3>Equipments Available</h3>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<ul id='equipments'>"
					+"</ul>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
	$('.starrr').starrr({
		rating: g.rating,
		readOnly: true

	});
	for (i in e) {
		let eq = e[i];
		$('#equipments').append(
			"<li>"+eq+"</li>"
		);
	}
	$('#gym_reservation').append(
		"<div class='container-fluid'>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<h3>Reservation</h3>"
					+"<div id='datepicker'></div>"
					+"<div class='container'>"
						//+"<p class='lead'>Cost: <strong><span id='current_cost'>0</span></strong></p>"
					+"</div>"
					+"<button type='button' id='submit' class='btn btn-primary btn-sm' style='margin-top: 10px; margin-bottom: 40px;' onclick='submitPayment();'>Pay and Reserve</button>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
	$('#datepicker').datepicker({minDate: 0});
}
