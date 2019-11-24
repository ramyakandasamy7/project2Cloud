
var allUsers;
var allOwners;
var API_URL = "http://3.95.182.111:3000/"

function initUI() {
	renderContainers();
	getAllUsers();
	getAllOwners();
	renderUsersTable();
	renderOwnersTable();
}

function getAllUsers() {
	$.ajax({
		url: API_URL+"users",
		type: "GET",
		dataType: "json"
	}).done(function(data) {
		console.log(data);
		window.allUsers = data;
		renderUsersTable();
	});
}

function getAllOwners() {
	$.ajax({
		url: API_URL+"owners",
		type: "GET",
		dataType: "json"
	}).done(function(data) {
		console.log(data);
		window.allOwners = data;
		renderOwnersTable();
	});
}

function renderUsersTable() {
	$("#usersTbody").empty();
	for (i in window.allUsers) {
		let id = window.allUsers[i].userID;
		let username = window.allUsers[i].username;
		let password = window.allUsers[i].password;
		let loc = window.allUsers[i].location;
		let isVerified = window.allUsers[i].isVerified;

		$("#usersTbody").append(
			"<tr>"
				+"<td>"+id+"</td>"
				+"<td>"+username+"</td>"
				+"<td>"+password+"</td>"
				+"<td>"+loc+"</td>"
				+"<td>"+isVerified+"</td>"
				+"<td><button type='button' class='btn btn-primary btn-sm' onclick='deleteUser(\""+id+"\")'>Delete</button></td>"
			+"</tr>"
		);
	}
}

function renderOwnersTable() {
	$("#ownersTbody").empty();
	for (i in window.allOwners) {
		let id = window.allOwners[i].ownerID;
		let username = window.allOwners[i].username;
		let password = window.allOwners[i].password;
		let loc = window.allOwners[i].location;
		let isVerified = window.allOwners[i].isVerified;

		$("#ownersTbody").append(
			"<tr>"
				+"<td>"+id+"</td>"
				+"<td>"+username+"</td>"
				+"<td>"+password+"</td>"
				+"<td>"+loc+"</td>"
				+"<td>"+isVerified+"</td>"
				+"<td><button type='button' class='btn btn-primary btn-sm' onclick='deleteOwner(\""+id+"\")'>Delete</button></td>"
			+"</tr>"
		);
	}
}

function deleteUser(id) {
	$.ajax({
		url: API_URL+"deleteUser",
		type: "POST",
		data: {userID: id},
		dataType: "json"
	}).done(function(data, statMsg, stat) {
		if (stat.status === 200) {
			//alert("User successfully deleted!");
			location.reload();
		} else {
			alert("Error: "+data);
		}
	});
}

function deleteOwner(id) {
	$.ajax({
		url: API_URL+"deleteOwner",
		type: "POST",
		data: {ownerID: id},
		dataType: "json"
	}).done(function(data, statMsg, stat) {
		if (stat.status === 200) {
			//alert("Owner successfully deleted!");
			location.reload();
		} else {
			alert("Error: "+data);
		}
	});
}

function renderContainers() {
	$("#root").empty();
	$("#root").append(
		"<div class='container-fluid'>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<h2>Users</h2>"
					+"<table class='table table-sm'>"
						+"<thead>"
							+"<tr>"
								+"<th>User ID</th>"
								+"<th>Username</th>"
								+"<th>Password</th>"
								+"<th>Location</th>"
								+"<th>Verified</th>"
								+"<th>Delete</th>"
							+"</tr>"
						+"</thead>"
						+"<tbody id='usersTbody'>"
						+"</tbody>"
					+"</table>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<h2>Owners</h2>"
					+"<table class='table table-sm'>"
						+"<thead>"
							+"<tr>"
								+"<th>Owner ID</th>"
								+"<th>Username</th>"
								+"<th>Password</th>"
								+"<th>Location</th>"
								+"<th>Verified</th>"
								+"<th>Delete</th>"
							+"</tr>"
						+"</thead>"
						+"<tbody id='ownersTbody'>"
						+"</tbody>"
					+"</table>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}

