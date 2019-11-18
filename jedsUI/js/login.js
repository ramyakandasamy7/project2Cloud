
function initUI() {
	renderMainContainer('#root');
	renderModals('#root');
	//renderLoginButton('#main_container');
	renderAppTitle('#main_container');
	//renderLoginForm('#main_container');
}

function renderMainContainer(id) {
	$(id).append(
		"<div class='container-fluid' id='main_container'>"
		+"</div>"
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
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-envelope'></i></span>"
									+"</div>"
									+"<input type='text' id='login_email' class='form-control input-sm' placeholder='Email'>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-key'></i></span>"
									+"</div>"
									+"<input type='password' id='login_password' class='form-control input-sm' placeholder='Password'>"
								+"</div>"
								+"<div class='form-actions'>"
									+"<button type='button' class='btn btn-primary btn-sm'>Login</button>"
								+"</div>"
							+"</div>"
							+"<div class='tab-pane fade' id='registration_form' role='tabpanel' aria-labelledby='register_link'>"
								+"<div class='form-check'>"
									+"<input class='form-check-input' type='radio' name='accountType' id='accountTypeGoer' value='goer' checked>"
									+"<label class='form-check-label' for='accountTypeGoer'>"
										+"Garage Gym Goer"
									+"</label>"
								+"</div>"
								+"<div class='form-check'>"
									+"<input class='form-check-input' type='radio' name='accountType' id='accountTypeOwner' value='owner'>"
									+"<label class='form-check-label' for='accountTypeOwner'>"
										+"Garage Gym Owner"
									+"</label>"
								+"</div>"
								+"<div class='input-group form-group'>"
									+"<div class='input-group-prepend'>"
										+"<span class='input-group-text'><i class='fas fa-envelope'></i></span>"
									+"</div>"
									+"<input type='text' id='register_email' class='form-control input-sm' placeholder='Email' value='test.account@test.com'>"
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
					//+"<div class='modal-footer'>"
					//	+"<button type='button' class='btn btn-primary'>Save changes</button>"
					//	+"<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"
					//+"</div>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}

//function initValidation() {
//	bootstrapValidate(
//		'#register_email',
//		'email:Enter a valid email address!'
//	);
//}

function processRegistration() {
	let email = $('#register_email').val();	
	let gymgoer = $('#accountTypeGoer').is(':checked');
	let address = $('#register_location').val();
	let password = $('#register_password').val();
	let cpassword = $('#register_password_confirm').val();

	if (password !== cpassword) {
		alert("Passwords don't match!");
		return;
	}

	if (email === "" || address === "" || password === "" || cpassword === "") {
		alert("Please fill in every field.");
		return;
	}

	console.log(gymgoer);

	if (gymgoer) {
		console.log("Gym Goer");
	} else {
		console.log("Gym Owner");
	}
}

function renderAppTitle(id) {
	$(id).append(
		"<div class='jumbotron jumbotron-fluid vertical-center'>"
			+"<div class='login-button'>"
				+"<button type='button' class='btn btn-secondary' data-toggle='modal' data-target='#login_modal'>Login / Register</button>"
			+"</div>"
			+"<div class='container'>"
				+"<div class='row align-items-center'>"
					+"<div class='col-lg-4 col-md-12'>"
						+"<h1 class='display-3'>GarageGym</h1>"
						+"<p class='lead'>Say goodbye to gym memberships!</p>"
					+"</div>"
					+"<div class='col-lg-8 col-md-12'>"
						
						+"<form action='http://3.95.182.111:4000/findgym' method='POST'>"
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
	);
}

function submitZip() {
	let loc = document.getElementById('search_input').value;

	//if (isValidZip(zip)) {
	//	alert("Valid: "+zip);
	//} else {
	//	alert("Please enter a valid zip code.");
	//}
}

function isValidZip(zip) {
	return /^\d{5}(-\d{4})?$/.test(zip);
}

function renderLoginForm(id) {
	//$(id).empty();
	$(id).append(
		"<div class='row'>"
			+"<div class='col-xs-4'>"
				+"<div class='container'>"
					+"<div class='d-flex justify-content-center h-100'>"
						+"<div class='card'>"
							+"<div class='card-header'>"
								+"<h3>Sign In</h3>"
								+"<div class='d-flex justify-content-end social_icon'>"
									+"<span><i class='fab fa-facebook-square'></i></span>"
									+"<span><i class='fab fa-google-plus-square'></i></span>"
									+"<span><i class='fab fa-twitter-square'></i></span>"
								+"</div>"
							+"</div>"
							+"<div class='card-body'>"
								+"<form>"
									+"<div class='input-group form-group'>"
										+"<div class='input-group-prepend'>"
											+"<span class='input-group-text'><i class='fas fa-user'></i></span>"
										+"</div>"
										+"<input type='text' class='form-control' placeholder='username'>"
									+"</div>"
									+"<div class='input-group form-group'>"
										+"<div class='input-group-prepend'>"
											+"<span class='input-group-text'><i class='fas fa-key'></i></span>"
										+"</div>"
										+"<input type='password' class='form-control' placeholder='password'>"
									+"</div>"
									+"<div class='row align-items-center remember'>"
										+"<input type='checkbox'>Remember Me"
									+"</div>"
									+"<div class='form-group'>"
										+"<input type='submit' value='Login' class='btn float-right login_btn'>"
									+"</div>"
								+"</form>"
							+"</div>"
							+"<div class='card-footer'>"
							+"</div>"
						+"</div>"
					+"</div>"
				+"</div>"
			+"</div>"
			+"<div class='col-xs-4'>"
			+"</div>"
			+"<div class='col-xs-4'>"
			+"</div>"
		+"</div>"
	);
}
