<?php

	chdir("/var/www/elements/");
	exec('git pull  2>&1', $output);
	echo implode("<br/>\n", $output);
	echo "<h3 align=center>Done</h3>";

?>