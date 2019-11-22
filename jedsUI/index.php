<?php
session_start();
?>

<html>
	<head>
		<title>Project 2</title>
		<link rel='icon' href='imgs/favicon.ico' type='image/x-icon'/>
		<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
		<link rel='stylesheet' href='css/login.css?t=<?php echo time();?>'/>
		<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script>
		<script src="https://kit.fontawesome.com/a215ff507f.js" crossorigin="anonymous"></script>
		<script type='text/javascript' src='js/login.js?t=<?php echo time();?>'></script>
		<script type='text/javascript' src='js/bootstrap-validate.js'></script>
		<script type='text/javascript'>
			$(document).ready(function() {
				initUI();
			});
		</script>
	</head>
	<body>
		<div id='root'></div>
	</body>
</html>
