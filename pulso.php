<?php

	chdir("/var/www/elements/");
	exec("git pull");
	echo "<h3 align=center>Done</h3>";

?>