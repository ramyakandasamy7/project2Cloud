<?php
session_start();
header("Access-Control-Allow-Origin: *");

if (isset($_GET)) {
	$id = $_GET['id'];
} else {
	$id = 0;
}
$cmd = "curl ifconfig.me";
$out = exec($cmd, $output, $ec);
?>

<html>
	<head>
		<title>Garage Gym</title>
		<link rel='icon' href='imgs/favicon.ico' type='image/x-icon'/>
		<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
		<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script>

		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  		<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

		<script src="js/jquery.redirect.js"></script>
		<script src="https://js.stripe.com/v3/"></script>

		<script src="https://kit.fontawesome.com/a215ff507f.js" crossorigin="anonymous"></script>
		<script type='text/javascript' src='/js/cookie.js?t=<?php echo time();?>'></script>
		<script type='text/javascript' src='js/starrr.js'></script>
		<script type='text/javascript' src='js/index.js?t=<?php echo time();?>'></script>
		<script type='text/javascript'>
			var gymID = "<?php echo $id; ?>";
			$(document).ready(function() {
				initUI('<?php echo "$out";?>');
			});
		</script>
	</head>
	<body>
		<div id='root'></div>
	</body>
</html>
