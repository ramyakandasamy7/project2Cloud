
var pubip;
var API_URL;
var userID;
var username;
var accountType;

function initUI(pubip) {
	window.pubip = pubip;
	window.API_URL = "http://"+pubip+":3000";
	renderMainContainer('#root');
	renderModals('#root');
	//renderLoginButton('#main_container');
	renderAppTitle('#main_container');
	//renderLoginForm('#main_container');
	checkIfLoggedIn();
}

function checkIfLoggedIn() {
	let userInfo = checkCookie();
	if (userInfo !== false) {
		window.userID = userInfo.userID;
		window.username = userInfo.username;
		window.accountType = userInfo.acctType;
		localStorage.setItem('username', window.username);
		localStorage.setItem('userID', window.userID);
		/* Thinking about pulling user data when cookie exists
		 *but may be necessary...?
		 * */
		//let mode = userInfo.mode;
		//let api;
		//if (mode == "g") {
		//	api = '';
		//}
		//$.ajax({
		//	url: API_URL+"/"
		//});
		showUserSettings(window.userID, window.username, window.accountType);
	} else {
		console.log('Not logged in');
	}
}

function renderMainContainer(id) {
	$(id).append(
		"<div class='container-fluid' id='main_container'>"
		+"</div>"
	);
}

function login() {
	let email = $('#login_email').val();
	let pswd  = $('#login_password').val();
	let goer  = $('#loginGoer').is(':checked');

	if (goer === true) {
		$.ajax({
			url: window.API_URL+"/loginUser",
			type: "POST",
			data: {username: email, password: pswd},
			dataType: "json"
		}).done(function(data, message, stat) {
			window.userID = data.data.id;
			window.username = data.data.username;
			window.accountType = "g";
			setCookie(data.data.id, data.data.username, "g");
			showUserSettings(data.data.id, data.data.username, "g");
		});
	} else {
		$.ajax({
			url: window.API_URL+"/loginOwner",
			type: "POST",
			data: {username: email, password: pswd},
			dataType: "json"
		}).done(function(data, message, stat) {
			window.userID = data.data.id;
			window.username = data.data.username;
			window.accountType = "o";
			setCookie(data.data.id, data.data.username, "o");
			showUserSettings(data.data.id, data.data.username, "o");
		});
	}
}

function showUserSettings(id, user) {
	$('#login_modal').modal('hide');
	$('#account_button_container').empty();
	$('#account_button_container').append(
		"<button type='button' class='btn btn-sm' onclick='showAccountPage(\""+id+"\");'><i class='fas fa-user-cog fa-2x'></i></button>"
		+"<button type='button' class='btn btn-sm' onclick='logout();'><i class='fas fa-sign-out-alt fa-2x'></i></button>"
	);
}

function logout() {
	deleteCookie();
	localStorage.removeItem('username');
	localStorage.removeItem('userID');
	window.location.replace("http://gg.mymsseprojects.com");
}

function showAccountPage() {
	window.location.replace("http://gg.mymsseprojects.com/account?id="+window.userID+"&accttype="+window.accountType);
}

function processRegistration() {
	let email     = $('#register_email').val();	
	let gymgoer   = $('#accountTypeGoer').is(':checked');
	let address   = $('#register_location').val();
	let password  = $('#register_password').val();
	let cpassword = $('#register_password_confirm').val();
	let uemail    = encodeURIComponent(email);

	if (password !== cpassword) {
		alert("Passwords don't match!");
		return;
	}

	if (email === "" || address === "" || password === "" || cpassword === "") {
		alert("Please fill in every field.");
		return;
	}

	if (gymgoer) {
		$.ajax({
			url: window.API_URL+'/createnewUser',
			type: 'POST',
			data: {'register_email':email, 'register_password':password, 'register_location':address}
		}).done(function(data, message, stat){
			console.log(data);
			if (stat.status === 200) {
				window.location.replace("http://gg.mymsseprojects.com/verify_account?email="+email);
			}
		});
	} else {
		$.ajax({
			url: window.API_URL+'/createnewOwner',
			type: 'POST',
			data: {'register_email':email, 'register_password':password, 'register_location':address}
		}).done(function(data, message, stat){
			console.log(data);
			if (stat.status === 200) {
				window.location.replace("http://gg.mymsseprojects.com/verify_account?email="+email);
			}
		});
	}
}

function renderAppTitle(id) {
	$(id).append(
		"<div class='jumbotron jumbotron-fluid vertical-center'>"
			+"<div class='login-button' id='account_button_container'>"
				+"<button type='button' class='btn btn-secondary' data-toggle='modal' data-target='#login_modal'>Login / Register</button>"
			+"</div>"
			+"<div class='container'>"
				+"<div class='row align-items-center'>"
					+"<div class='col-lg-4 col-md-12'>"
						+"<h1 class='display-3'>GarageGym</h1>"
						+"<p class='lead'>Say goodbye to gym memberships!</p>"
					+"</div>"
					+"<div class='col-lg-8 col-md-12'>"
						
						+"<form action='http://"+window.pubip+":4000/findgym' method='POST'>"
							+"<div class='input-group mb-4'>"
								+"<input type='text' class='form-control search_input' id='search_input' name='location' placeholder='Find a garage gym! Enter your location now!' aria-describedby='search_button'>"
								+"<div class='input-group-append'>"
									+"<button id='search_button' type='submit' class='btn btn-primary'><i class='fa fa-search fa-3x'></i></button>"
								+"</div>"
							+"</div>"
						+"</form>"
					+"</div>"
				+"</div>"
			+"</div>"
		+"</div>"
		+"<script>"
			+"function fillin() {"
				+"var autocomplete = null;"
				+"var input = document.getElementById('search_input');"
				+"autocomplete = new google.maps.places.Autocomplete(input);"
		 	+"}"
		+"</script>"
  		+"<script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?key=AIzaSyC4WaWG5bt4LypUmBt6Ap2fPLAjduAsCHo&libraries=places&callback=fillin'></script>"  

	);
}

function renderModals(id) {
	$(id).append(
		"<div class='modal fade' id='login_modal' tabindex='-1' role='dialog'>"
			+"<div class='modal-dialog' role='document'>"
				+"<div class='modal-content'>"
					+"<div class='modal-header'>"
						+"<h4>Login/Register</h4>"
						+"<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"
							+"<span aria-hidden='true'>&times;</span>"
						+"</button>"
					+"</div>"
					+"<div class='modal-body'>"
						+"<ul class='nav nav-tabs' role='tablist'>"
							+"<li class='nav-item'>"
								+"<a class='nav-link active' id='login_link' data-toggle='tab' href='#login_form' role='tab' aria-controls='login_form' aria=selected='true'>Login</a>"
							+"</li>"
							+"<li class='nav-item'>"
								+"<a class='nav-link' id='register_link' data-toggle='tab' href='#registration_form' aria-controls='registration_form' aria-selected='false'>Register</a>"
							+"</li>"
						+"</ul>"
						+"<div class='tab-content' id='forms' style='margin-top: 20px;'>"
							+"<div class='tab-pane fade show active' id='login_form' role='tabpanel' aria-labelledby='login_link'>"
								+"<div class='form-check'>"
									+"<input class='form-check-input' type='radio' name='accountType' id='loginGoer' value='goer' checked>"
									+"<label class='form-check-label' for='loginGoer'>"
										+"Garage Gym Goer"
									+"</label>"
								+"</div>"
								+"<div class='form-check' style='margin-bottom: 10px;'>"
									+"<input class='form-check-input' type='radio' name='accountType' id='loginOwner' value='owner'>"
									+"<label class='form-check-label' for='loginOwner'>"
										+"Garage Gym Owner"
									+"</label>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-envelope'></i></span>"
									+"</div>"
									+"<input type='text' id='login_email' class='form-control input-sm' placeholder='Email' value='jedv86@yahoo.com'>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-key'></i></span>"
									+"</div>"
									+"<input type='password' id='login_password' class='form-control input-sm' placeholder='Password' value='testpassword'>"
								+"</div>"
								+"<div class='form-actions'>"
									+"<button type='button' class='btn btn-primary btn-sm' onclick='login();'>Login</button>"
								+"</div>"
							+"</div>"
							+"<div class='tab-pane fade' id='registration_form' role='tabpanel' aria-labelledby='register_link'>"
								+"<div class='form-check'>"
									+"<input class='form-check-input' type='radio' name='accountType' id='accountTypeGoer' value='goer' checked>"
									+"<label class='form-check-label' for='accountTypeGoer'>"
										+"Garage Gym Goer"
									+"</label>"
								+"</div>"
								+"<div class='form-check' style='margin-bottom: 10px;'>"
									+"<input class='form-check-input' type='radio' name='accountType' id='accountTypeOwner' value='owner'>"
									+"<label class='form-check-label' for='accountTypeOwner'>"
										+"Garage Gym Owner"
									+"</label>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-envelope'></i></span>"
									+"</div>"
									+"<input type='text' id='register_email' class='form-control input-sm' placeholder='Email' value='jedv86@yahoo.com'>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-home'></i></span>"
									+"</div>"
									+"<input type='text' id='register_location' class='form-control input-sm' placeholder='Address' value='1770 Wayne Circle, San Jose, CA 95131'>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-key'></i></span>"
									+"</div>"
									+"<input type='password' id='register_password' class='form-control input-sm' placeholder='Password' value='testpassword'>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-key'></i></span>"
									+"</div>"
									+"<input type='password' id='register_password_confirm' class='form-control input-sm' placeholder='Confirm Password' value='testpassword'>"
								+"</div>"
								+"<div class='form-actions'>"
									+"<button type='button' class='btn btn-primary btn-sm' onclick='processRegistration();'>Register</button>"
								+"</div>"
							+"</div>"
						+"</div>"
					+"</div>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}
