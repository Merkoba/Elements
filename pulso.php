<?php

	$ip = getenv('HTTP_CLIENT_IP')?:
	getenv('HTTP_X_FORWARDED_FOR')?:
	getenv('HTTP_X_FORWARDED')?:
	getenv('HTTP_FORWARDED_FOR')?:
	getenv('HTTP_FORWARDED')?:
	getenv('REMOTE_ADDR');



	chdir("/var/www/elements/");
	exec('sudo -u gitdude git pull  2>&1', $output);
	echo implode("Ver=1<br/>\n", $output);

?>