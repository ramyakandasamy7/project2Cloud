var API_URL = "http://3.95.182.111:3000/"
var accountInfo;
var allGyms = {};

function initUI() {
	getAccountInfo();
	renderModals();
	renderMainContainers();
	renderListOfGyms();
	renderListOfRequests();
}

function getAccountInfo() {
	console.log(window.accountID);
	$.ajax({
		url: API_URL+"owners/"+window.accountID,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			window.accountInfo = data.Item
		} else {
			alert("Failed to get account information.");
			window.location("http://gg.mymsseprojects.com");
		}
	});
}

function renderModals() {
	$('#root').append(
		"<div class='modal fade' id='add_gym' tabindex='-1' role='dialog'>"
			+"<div class='modal-dialog' role='document'>"
				+"<div class='modal-content'>"
					+"<div class='modal-header'>"
						+"<h5 class='modal-title'>Add A Garage Gym</h5>"
						+"<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"
							+"<span aria-hidden='true'>&times;</span>"
						+"</button>"
					+"</div>"
					+"<div class='modal-body'>"
						+"<p>Modal body text goes here.</p>"
					+"</div>"
					+"<div class='modal-footer'>"
						+"<button type='button' class='btn btn-primary'>Add Gym</button>"
						+"<button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button>"
					+"</div>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}

function renderMainContainers() {
	//$('#root').empty();
	$('#root').append(
		"<nav class='navbar navbar-light bg-light'>"
			+"<span class='navbar-brand mb-0 h1'>My Account</span>"
		+"</nav>"
		+"<div class='container-fluid'>"
			+"<div class='row'>"
				+"<div class='col' id='gyms_container'>"
					+"<button type='button' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#add_gym' style='margin-top: 10px; margin-bottom: 10px;'>"
						+"<i class='fas fa-dumbbell fa-2x'></i>"
						+"<i class='fas fa-plus'></i>"
					+"</button>"
					+"<table class='table table-sm'>"
						+"<thead>"
							+"<tr>"
								+"<th>Price</th>"
								+"<th>Address</th>"
								+"<th>Equipments</th>"
								+"<th>Phone No.</th>"
								+"<th>Rating</th>"
								+"<th>Options</th>"
							+"</tr>"
						+"</thead>"
						+"<tbody id='gyms_tbody'>"
						+"</tbody>"
					+"</table>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col' id='requests_container'>"
					+"<table class='table table-sm'>"
						+"<thead>"
							+"<tr>"
								+"<th>Email</th>"
								+"<th>Date</th>"
								+"<th>Status</th>"
								+"<th>Options</th>"
							+"</tr>"
						+"</thead>"
						+"<tbody id='requests_tbody'>"
						+"</tbody>"
					+"</table>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}

function renderListOfGyms() {
	getGyms();
	let gyms = window.allGyms;
	//for ()
}

function getGyms() {
	console.log("Will get gyms soon");	
}

function renderListOfRequests() {
	
}
