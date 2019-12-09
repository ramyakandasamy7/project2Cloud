var pubip;
var API_URL;
var accountInfo;
var allGyms = {};
var allRequests = {};

function initUI(pubip) {
	window.pubip = pubip;
	window.API_URL = "http://"+pubip+":3000";
	renderModals();
	renderMainContainers();
	getAccountInfo();
}

function getAccountInfo() {
	let acctType = Cookies.get('mode');
	let email = Cookies.get('username');
	if (acctType == "o") {
		$.ajax({
			url: window.API_URL+"/owners/"+window.accountID,
			type: "GET",
			dataType: "json"
		}).done(function(data, message, stat) {
			if (stat.status === 200) {
				window.accountInfo = data.Item
				renderAccountInfo();
				getListOfGyms();
				getListOfRequests();
			} else {
				alert("Failed to get account information.");
				window.location("http://gg.ramyaprojects.net");
			}
		});
	} else {
		showUserInfo(email);
		getListOfRequests();	
	}
}

function showUserInfo(email) {
	$('#accountContainer').empty();	
	$('#accountContainer').append(
		"<div class='jumbotron'>"
			+"<h4>Welcome back "+email+"!</h4>"
		+"</div>"
		+"<div class='row'>"
                        +"<div class='col' id='requests_container'>"
                                +"<h5>My Gym Requests</h5>"
                                +"<table class='table table-striped table-sm' style='vertical-align: middle;'>"
                                        +"<thead class='thead-dark'>"
                                                +"<tr>"
                                                        +"<th>Location</th>"
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
	);
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
									+"<input type='file' class='custom-file-input' id='gympic' "
										+"aria-describedby='gympic'>"
									+"<label class='custom-file-label' for='gympic'>Choose file</label>"
								+"</div>"
							+"</div>"
							+"<h5>Equipments</h5>"
							+"<div class='form-check'>"
								+"<label class='form-check-label'>"
									+"<input type='checkbox' class='form-check-input' value='indoor_cycle_bike'>Indoor Cycle Bike"
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
									+"<input type='checkbox' class='form-check-input' value='bench_press'>Bench Press"
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
	updateFileInput();
}

function updateFileInput() {
	$('#gympic').on('change',function(){
                var fileName = $(this).val();
                $(this).next('.custom-file-label').html(fileName);
        });
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
		url: window.API_URL+"/creategym",
		type: "POST",
		data: { ownerID: oid, cost: cost, location: address, attributes: JSON.stringify(attrs)},
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			uploadPicture(data.gymID);
		}
	});
	
}

function uploadPicture(gymID) {
	let pic = document.getElementById("gympic").files;
	var fd  = new FormData();
	fd.append('file', pic[0]);
	fd.append('gymID', gymID);

	$.ajax({
		url: window.API_URL+"/gymPictureUpload",
		type: "POST",
		data: fd,
		processData: false,
		contentType: false
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			location.reload();
		}
	});
}

function renderMainContainers() {
	//$('#root').empty();
	$('#root').append(
		"<nav class='navbar navbar-light bg-dark' style='margin-bottom: 20px;'>"
                        +"<a class='navbar-brand' href='http://gg.ramyaprojects.net'>"
                                +"<img src='/imgs/favicon.ico'>"
                        +"</a>"
                +"</nav>"
		+"<div class='container-fluid' id='accountContainer'>"
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
					+"<h5>My Gyms</h5>"
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
								+"<th>Rating</th>"
								+"<th>Options</th>"
							+"</tr>"
						+"</thead>"
						+"<tbody id='gyms_tbody'>"
						+"</tbody>"
					+"</table>"
				+"</div>"
			+"</div>"
			+"<hr/>"
			+"<div class='row'>"
				+"<div class='col' id='requests_container'>"
					+"<h5>My Gym Requests</h5>"
					+"<table class='table table-striped table-sm'>"
						+"<thead class='thead-dark'>"
							+"<tr>"
								+"<th>Location</th>"
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

function getListOfGyms() {
	let oid = window.accountInfo.ownerID;

	$.ajax({
		url: window.API_URL+"/gyms/"+oid,
		type: "GET",
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			window.allGyms = data.Items;
			renderListOfGyms();
		}
	});
}

function getListOfRequests() {
	if (window.accountInfo !== undefined) {
		let oid = window.accountInfo.ownerID;
		$.ajax({
			url: window.API_URL+"/requests/"+oid,
			type: "GET",
			dataType: "json"
		}).done(function(data, message, stat) {
			console.log("Owner Requests");
			console.log(data);
			if (stat.status === 200) {
				window.allRequests = data.Items;
				renderListOfRequests();
			}	
		});
	} else {
		$.ajax({
			url: window.API_URL+"/request/"+window.accountID,
			type: "GET",
			dataType: "json"
		}).done(function(data, message, stat){
			console.log("User Requests");
			console.log(data);
			if (stat.status === 200) {
				window.allRequests = data.Items;
				renderListOfRequests();
			}
		});
	}
}

function renderListOfGyms() {
	let gyms = window.allGyms;

	for (i in gyms) {
		let g = gyms[i];
		$('#gyms_tbody').append(
			"<tr>"
				+"<td>$"+g.cost+"</td>"
				+"<td>"+g.locationofGym+"</td>"
				+"<td>"+g.attributes+"</td>"
				+"<td>"+g.rating+"</td>"
				+"<td>"
					+"<button type='button' class='btn btn-primary btn-sm' style='margin-right: 10px;'>Edit</button>"
					+"<button type='button' class='btn btn-danger btn-sm' onclick='deleteGym(\""+g.gymID+"\");'>Remove</button>"
				+"</td>"
			+"</tr>"
		);
	}
}

function deleteGym(id) {
	let confirmed = confirm("Are you sure you want to delete this gym?");

	if (confirmed === true) {
        	$.ajax({
        	        url: window.API_URL+"/deletegym",
        	        type: "POST",
        	        data: {gymID: id},
        	        dataType: "json"
        	}).done(function(data, statMsg, stat) {
        	        if (stat.status === 200) {
        	                location.reload();
        	        } else {
        	                alert("Error: "+data);
        	        }
        	});
	}
}

function renderListOfRequests() {
	let rqs = window.allRequests;

	for (i in rqs) {
		let rq  = rqs[i];
		let rid = rq.requestID;
		let gid = rq.gymID;
		let oid = rq.ownerID;
		let uid = rq.userID;
		let drq = rq.dateRequest;
		let sts = rq.status;
		let opt;

		if (window.accountInfo !== undefined) {
			if (sts === "Pending") {
				opt =  "<button type='button' class='btn btn-primary btn-sm' style='margin-right: 10px;' onclick='confirmRequest(\""+rid+"\")'>Confirm</button>";
				opt += "<button type='button' class='btn btn-danger btn-sm' onclick='declineRequest(\""+rid+"\");'>Decline</button>";
			} else {
				opt = "";
			}
		} else {
			if (sts === "Pending") {
				opt =  "<button type='button' class='btn btn-danger btn-sm' style='margin-right: 10px;' onclick='cancelRequest(\""+rid+"\")'>Cancel</button>";
			} else {
				opt = "";
			}
		}

		switch(sts) {
			case "Pending":
				sts = "<p class='text-info'>"+sts+"</p>"
				break;
			case "Cancelled":
				sts = "<p class='text-sencondary'>"+sts+"</p>"
				break;
			case "Confirmed":
				sts = "<p class='text-success'>"+sts+"</p>"
				break;
			default:
				sts = "<p class='text-dark'>"+sts+"</p>"
		}

		$.ajax({
			url: window.API_URL+"/gym/"+gid,
			type: "GET",
			dataType: "json"
		}).done(function(data, message, stat) {
			if (stat.status === 200) {
				let loc = data.Items[0].locationofGym;
				$('#requests_tbody').append(
					"<tr>"
						+"<td>"+loc+"</td>"
						+"<td>"+drq+"</td>"
						+"<td>"+sts+"</td>"
						+"<td>"+opt+"</td>"
					+"</tr>"
				);
			}
		});
	}
}

function confirmRequest(rid) {
	$.ajax({
		url: window.API_URL+"/modifyrequeststatus",
		type: "POST",
		data: {requestID:rid, status: "Confirmed"},
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			location.reload();
		}
	});
}

function declineRequest(rid) {
	$.ajax({
		url: window.API_URL+"/modifyrequeststatus",
		type: "POST",
		data: {requestID:rid, status: "Declined"},
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			location.reload();
		}
	});
}

function cancelRequest(rid) {
	$.ajax({
		url: window.API_URL+"/modifyrequeststatus",
		type: "POST",
		data: {requestID:rid, status: "Cancelled"},
		dataType: "json"
	}).done(function(data, message, stat) {
		if (stat.status === 200) {
			location.reload();
		}
	});
}
