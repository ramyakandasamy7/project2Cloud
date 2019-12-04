
var allUsers;
var allOwners;
var allGyms;
var allS3Folders;
var pubip;
var API_URL;

function initUI(pubip) {
	window.pubip = pubip;
	window.API_URL = "http://"+pubip+":3000";
	renderContainers();
	getAllUsers();
	getAllOwners();
	getAllGyms();
	getAllS3Folders();
	renderUsersTable();
	renderOwnersTable();
	renderGymsTable();
	renderS3FoldersTable();
}

function getAllUsers() {
	$.ajax({
		url: window.API_URL+"/users",
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
		url: window.API_URL+"/owners",
		type: "GET",
		dataType: "json"
	}).done(function(data) {
		console.log(data);
		window.allOwners = data;
		renderOwnersTable();
	});
}

function getAllGyms() {
	$.ajax({
		url: window.API_URL+"/gyms",
		type: "GET",
		dataType: "json"
	}).done(function(data) {
		console.log(data);
		window.allGyms = data;
		renderGymsTable();
	});
}

function getAllS3Folders() {
	$.ajax({
		url: window.API_URL+"/gymPictures",
		type: "GET",
		dataType: "json"
	}).done(function(data) {
		console.log(data.Contents);
		window.allS3Folders = data.Contents;
		renderS3FoldersTable();
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

function renderGymsTable() {
	$("#gymsTbody").empty();
	for (i in window.allGyms) {
		let gid    = window.allGyms[i].gymID;
		let oid    = window.allGyms[i].gymOwner;
		let cost   = window.allGyms[i].cost;
		let rating = window.allGyms[i].rating;
		let attr   = window.allGyms[i].attributes;
		let loc    = window.allGyms[i].locationofGym;

		$("#gymsTbody").append(
			"<tr>"
				+"<td>"+gid+"</td>"
				+"<td>"+oid+"</td>"
				+"<td>"+cost+"</td>"
				+"<td>"+rating+"</td>"
				+"<td>"+loc+"</td>"
				+"<td>"+attr+"</td>"
				+"<td><button type='button' class='btn btn-primary btn-sm' onclick='deleteGym(\""+gid+"\")'>Delete</button></td>"
			+"</tr>"
		);
	}
}

function renderS3FoldersTable() {
	$("#s3Tbody").empty();
	for (i in window.allS3Folders) {
		console.log(i);
		let key    = window.allS3Folders[i].Key;
		let size   = window.allS3Folders[i].Size;

		$("#s3Tbody").append(
			"<tr>"
				+"<td>"+key+"</td>"
				+"<td>"+size+"</td>"
				+"<td><button type='button' class='btn btn-primary btn-sm' onclick='deleteFolder(\""+key+"\")'>Delete</button></td>"
			+"</tr>"
		);
	}
}

function deleteUser(id) {
	$.ajax({
		url: window.API_URL+"/deleteUser",
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
		url: window.API_URL+"/deleteOwner",
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

function deleteGym(id) {
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

function deleteFolder(key) {
	$.ajax({
		url: window.API_URL+"/deleteFolder",
		type: "POST",
		data: { key: key },
		dataType: "json"
	}).done(function(data, statMsg, stat) {
		if (stat.status === 200) {
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
			+"<div class='row'>"
				+"<div class='col'>"
					+"<h2>Gyms</h2>"
					+"<table class='table table-sm'>"
						+"<thead>"
							+"<tr>"
								+"<th>Gym ID</th>"
								+"<th>Owner ID</th>"
								+"<th>Cost</th>"
								+"<th>Rating</th>"
								+"<th>Location</th>"
								+"<th>Attributes</th>"
								+"<th>Delete</th>"
							+"</tr>"
						+"</thead>"
						+"<tbody id='gymsTbody'>"
						+"</tbody>"
					+"</table>"
				+"</div>"
			+"</div>"
			+"<div class='row'>"
				+"<div class='col'>"
					+"<h2>S3 Bucket</h2>"
					+"<table class='table table-sm'>"
						+"<thead>"
							+"<tr>"
								+"<th>Key</th>"
								+"<th>Size</th>"
								+"<th>Delete</th>"
							+"</tr>"
						+"</thead>"
						+"<tbody id='s3Tbody'>"
						+"</tbody>"
					+"</table>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}

