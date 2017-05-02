<?php

	chdir("/var/www/elements/");
	exec('sudo git pull  2>&1', $output);
	echo implode("<br/>\n", $output);

?>