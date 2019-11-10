
function initUI() {
	renderMainContainer('#root');
	renderLoginButton('#main_container');
	renderAppTitle('#main_container');
	//renderLoginForm('#main_container');
}

function renderMainContainer(id) {
	$(id).append(
		"<div class='container-fluid' id='main_container'>"
		+"</div>"
	);
}

function renderLoginButton(id) {
	$(id).append(
			
	);
}

function renderAppTitle(id) {
	$(id).append(
		"<div class='jumbotron jumbotron-fluid vertical-center'>"
			+"<div class='login-button'>"
				+"<button type='button' class='btn btn-secondary'>Membership</button>"
			+"</div>"
			+"<div class='container'>"
				+"<div class='row align-items-center'>"
					+"<div class='col-lg-4 col-md-12'>"
						+"<h1 class='display-4'>GarageGym</h1>"
						+"<p class='lead'>Say goodbye to gym memberships!</p>"
					+"</div>"
					+"<div class='col-lg-8 col-md-12'>"
						
						+"<div class='input-group mb-4'>"
							+"<input type='text' id='search_input' placeholder='Find a garage gym! Enter your zip code now!' aria-describedby='search_button' class='form-control'>"
							+"<div class='input-group-append'>"
								+"<button id='search_button' type='button' class='btn btn-primary' onclick='submitZip();'><i class='fa fa-search'></i></button>"
							+"</div>"
						+"</div>"
					+"</div>"
				+"</div>"
			+"</div>"
		+"</div>"
	);
}

function submitZip() {
	let zip = document.getElementById('search_input').value;
	if (isValidZip(zip)) {
		alert("Valid: "+zip);
	} else {
		alert("Please enter a valid zip code.");
	}
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
