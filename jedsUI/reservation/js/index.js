
var API_URL = "http://3.95.182.111:3000/";
var gymInfo;
var cost = 0;


function initUI() {
	getGymInfo();
}

function getGymInfo() {
	let id = window.gymID;

	$.ajax({
		url: API_URL+"gym/"+id,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			console.log(data);
			window.gymInfo = data.Items[0];
			renderUI();
			getGymImageUrl();
		}
	});
}

function getGymImageUrl() {
	let id = window.gymID;
	$.ajax({
		url: API_URL+"gymPicture?id="+id,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			console.log(data);
			$('#gym_image').append(
				"<img src='"+data+"' alt='gym.jpg' height='100' width='auto'>"
			);
		}
	});
}

function renderUI() {
	let g = window.gymInfo;
	window.cost = parseInt(g.cost);
	let e = JSON.parse(g.attributes);
	console.log(e);

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
				+"<div class='col' id='gym_image'>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col'>"
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
					+"<button type='button' class='btn btn-primary btn-sm' style='margin-top: 10px;'>Pay and Reserve</button>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
	$('#datepicker').datepicker({minDate: 0});
}
