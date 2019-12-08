<?php
session_start();
if (isset($_GET)) {
	$id = $_GET['id'];
} else {
	$id = NULL;
}
$cmd = "curl ifconfig.me";
$out = exec($cmd, $output, $ec);
?>

<html>
	<head>
		<title>Owner Verification</title>
		<link rel='icon' href='/imgs/favicon.ico' type='image/x-icon'/>
		<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
		<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script>
		<script src="https://kit.fontawesome.com/a215ff507f.js" crossorigin="anonymous"></script>
		<script type='text/javascript'>
		var id = '<?php echo "$id";?>';
		var pubip = '<?php echo "$out";?>';
		$.ajax({
			url: "http://"+pubip+":3000/verifyOwner?id="+id,
			type: "GET",
			dataType: "json"
		}).done(function(data, message, stat) {
			if (stat.status === 200) {
				$("#messageBox").append(
				 	"<h1 class='display-4'>Owner account successfuly verified!</h1>"
					+"<hr class='my-4'>"
					+"<p class='lead'>Click <a href='http://gg.ramyaprojects.net'>HERE</a> to go back to the login page or wait 5 seconds.</p>"
				);

			} else {
				$("#messageBox").append(
				 	"<h1 class='display-4'>Account NOT verified!</h1>"
					+"<p class='lead'>Something went wrong!</p>"
					+"<hr class='my-4'>"
					+"<p class='lead'>Click <a href='http://gg.ramyaprojects.net'>HERE</a> to go back to the login page or wait 5 seconds.</p>"
				);	
			}
			setTimeout(function() {
				window.location.href = 'http://gg.ramyaprojects.net';
			}, 5000);
		});
		</script>
	</head>
	<body>
		<div id='root'>
			<div class="jumbotron" id='messageBox'>
			</div>
		</div>
	</body>
</html>
