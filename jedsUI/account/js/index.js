var API_URL = "http://3.95.182.111:3000/"
var accountInfo;
var allGyms = {};

function initUI() {
	getAccountInfo();
	renderModals();
	renderMainContainers();
	//renderListOfGyms();
	//renderListOfRequests();
}

function getAccountInfo() {
	console.log(window.accountID);
	$.ajax({
		url: API_URL+"owners/"+window.accountID,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			console.log(data.Item);
			window.accountInfo = data.Item
			renderAccountInfo();
			renderListOfGyms();
		} else {
			alert("Failed to get account information.");
			window.location("http://gg.mymsseprojects.com");
		}
	});
}

function renderAccountInfo() {
	let acct = window.accountInfo;

	$('#account_info').append(
		"<button type='button' class='btn pull-right'><i class='fas fa-cog'></i></button>"
		+"<h3>Account Information</h3>"
		+"<hr/>"
		+"<p class='lead'>Username/Email: "+acct.username+"</p>"
		+"<p class='lead'>Home Address: "+acct.location+"</p>"
	);
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
						+"<form id='new_gym'>"
							+"<div class='form-group'>"
								+"<label for='cost'>Price (USD):</label>"
								+"<input type='number' class='form-control' id='cost'>"
							+"</div>"
							+"<div class='form-group'>"
								+"<label for='cost'>Address:</label>"
								+"<input type='text' class='form-control' id='address'>"
							+"</div>"
							+"<div class='input-group' style='margin-bottom: 10px;'>"
								+"<div class='input-group-prepend'>"
									+"<span class='input-group-text' id='picture'>Gym Picture</span>"
								+"</div>"
								+"<div class='custom-file'>"
									+"<input type='file' class='custom-file-input' id='inputGroupFile01'"
										+"aria-describedby='inputGroupFileAddon01'>"
									+"<label class='custom-file-label' for='inputGroupFile01'>Choose file</label>"
								+"</div>"
							+"</div>"
							+"<h5>Equipments</h5>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='bike'>Indoor Cycle Bike"
								+"</label>"
							+"</div>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='treadmill'>Treadmill"
								+"</label>"
							+"</div>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='stability_ball'>Stability Ball"
								+"</label>"
							+"</div>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='kettlebell'>Kettlebells"
								+"</label>"
							+"</div>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='dumbell'>Dumbbells"
								+"</label>"
							+"</div>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='benchpress'>Bench Press"
								+"</label>"
							+"</div>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='barbell'>Barbell"
								+"</label>"
							+"</div>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='squat_rack'>Squat Rack"
								+"</label>"
							+"</div>"
						+"</form>"
					+"</div>"
					+"<div class='modal-footer'>"
						+"<button type='button' class='btn btn-primary' onclick='addNewGym();'>Add Gym</button>"
						+"<button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button>"
					+"</div>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}

function addNewGym() {
	let ckbox   = $('#new_gym input:checkbox:checked');
	let cost    = $('#cost').val();
	let address = $('#address').val();
	let attrs   = [];
	let oid     = window.accountInfo.ownerID;

	for (let i = 0; i < ckbox.length; i++) {
		attrs.push(ckbox[i].value);
	}

	$.ajax({
		url: API_URL+"creategym",
		type: "POST",
		data: { ownerID: oid, cost: cost, location: address, attributes: JSON.stringify(attrs)},
		dataType: "json"
	}).done(function(data, message, stat) {
		console.log(data);
		console.log(stat);
	});
	
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
					+"<div class='card' style='margin-top: 10px;'>"
						+"<div class='card-body' id='account_info'>"
						+"</div>"
					+"</div>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col' id='gyms_container'>"
					+"<button type='button' class='btn btn-primary btn-sm'"
						+" data-toggle='modal' data-target='#add_gym' "
						+" style='margin-top: 10px; margin-bottom: 10px;' onclick='enterLocation();'>"
						+"<i class='fas fa-dumbbell fa-2x'></i>"
						+"<i class='fas fa-plus'></i>"
					+"</button>"
					+"<table class='table table-striped table-sm '>"
						+"<thead class='thead-dark'>"
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
					+"<table class='table table-striped table-sm'>"
						+"<thead class='thead-dark'>"
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

function enterLocation() {
	$('#address').val(window.accountInfo.location);
}

function renderListOfGyms() {
	getGyms();
	let gyms = window.allGyms;
	//for ()
}

function getGyms() {
	let oid = window.accountInfo.ownerID;

	console.log(oid);
	$.ajax({
		url: API_URL+"gyms/"+oid,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		console.log(data);
		console.log(message);
		console.log(stat);
	});
}

function renderListOfRequests() {
	
}
