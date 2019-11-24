
function checkCookie() {
	if (!!Cookies.get('userID')) {
		return {userID: Cookies.get('userID'), username: Cookies.get('username')};
	} else {
		return false;
	}
}

function setCookie(id,user, mode) {
	Cookies.set('userID', id, { expires: 365, path: '/' });
	Cookies.set('username', user, { expires: 365, path: '/' });
	Cookies.set('mode', mode, { expires: 365, path: '/' });
}

function deleteCookie() {
	Cookies.remove('userID', { path: '/' });
	Cookies.remove('username', { path: '/' });
	Cookies.remove('mode', { path: '/' });
}


