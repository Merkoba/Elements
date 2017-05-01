var version = "18.3";

var elements = [
	{"name": "Adamant"},
	{"name": "Adamantite"},
	{"name": "Adamantium"},
	{"name": "Administratium"},
	{"name": "Administrontium"},
	{"name": "Aether"},
	{"name": "Australium"},
	{"name": "Badassium"},
	{"name": "Bavarium"},
	{"name": "Bombastium"},
	{"name": "Bureaucratium"},
	{"name": "Byzanium"},
	{"name": "Carbonadium"},
	{"name": "Cavorite"},
	{"name": "Chronoton"},
	{"name": "Cobalt Thorium G"},
	{"name": "Collapsium"},
	{"name": "Dilithium"},
	{"name": "Divinium (E115)"},
	{"name": "Duranium"},
	{"name": "Durium"},
	{"name": "Dust"},
	{"name": "Element 99"},
	{"name": "Element Zero"},
	{"name": "Feminum"},
	{"name": "Frinkonium"},
	{"name": "Harbenite"},
	{"name": "Ice-Nine"},
	{"name": "Katchin"},
	{"name": "Kryptonite"},
	{"name": "Merkoba 51"},
	{"name": "Meteorillium"},
	{"name": "Mithril"},
	{"name": "Nth Metal"},
	{"name": "Octiron"},
	{"name": "Orichalcum"},
	{"name": "Polydenum"},
	{"name": "Quadium"},
	{"name": "Radium X"},
	{"name": "Rearden Metal"},
	{"name": "Redstone"},
	{"name": "Scrith"},
	{"name": "Timonium"},
	{"name": "Transformium"},
	{"name": "Tritanium"},
	{"name": "Unobtanium"},
	{"name": "Uridium"},
	{"name": "Uru"},
	{"name": "Verterium"},
	{"name": "Vibranium"},
	{"name": "Wishalloy"},
	{"name": "Woodium"},
	{"name": "Xirdalium"},
	{"name": "Xithricite"}
];

var start_points = 1000000;

var start_count = 30;

var tick_timer;

var started_timeout;

var seed = -1;

var profits = [-1000000, -800000, -600000, -400000, -200000, 0, 200000, 400000, 600000, 800000, 1000000];

var directions = ["up", "down"];

var msg_open = false;

var highscores;

var ls_highscores = "highscores_v2";

var ls_options = "options_v4";

var msg_closeable = false;

var linear_diff = 10000 / (start_count - 1);

var count = 0;

var music_fadeout_interval;

var playing = false;

var started = false;

var paused = false;

var last_highscore = "";

var sold_on_tick = [];

var report = [];

function init()
{
	get_speed();
	get_options();
	speed_changed();
	get_seed();
	overlay_clicked();
	key_detection();
	resize_events();
	music_control();
	check_firstime();
}

function check_start()
{
	if($('#start').html() === 'Stop')
	{
		stop();
	}

	else
	{
		start();
	}
}

function start()
{
	playing = true;
	started = false;
	paused = false;
	count = 0;
	stop_loop();
	hide_overlay(true);
	generate_tiles();

	if(options.fit)
	{
		fit();
	}

	set_speed();

	$('#title').html('Starting Game');
	$('#points').html('');
	$('#start').html('Stop');
	$('body').css('background-image', 'none');
	$('#main_container').focus();

	to_top();

	play('started');

	if(music_fadeout_interval !== undefined)
	{
		clearInterval(music_fadeout_interval);
	}

	play('music');

	clear_started();

	last_highscore = "";

	sold_on_tick = [];

	report = [];

	started_timeout = setTimeout(function()
	{

		$('.element_patent_btn').each(function()
		{
			$(this).css('display', 'inline-block');
		});

		points = start_points;
		count = start_count;
		update_points();
		update_counter();
		loop();
		started = true;

	}, 3700);
}

function clear_started()
{
	if(started_timeout !== undefined)
	{
		clearTimeout(started_timeout);
	}
}

function generate_tiles()
{
	$('#main_container').html('');

	if(seed === -1)
	{
		Math.seedrandom();
	}

	else
	{
		Math.seedrandom(seed);
	}

	for(var i=0; i<elements.length; i++)
	{   
		var element = elements[i];

		element.owned = false;

		element.id = i;

		element.soldonce = false;

		element.frozen = false;

		if(isNaN(seed))
		{
			var index = 5;
		}

		else
		{
			var index = get_random_profit_index();
		}

		element.profit = profits[index];

		if(isNaN(seed))
		{
			if(i % 2 === 0)
			{
				index = 1;
			}

			else
			{
				index = 0;
			}
		}

		else
		{
			index = get_random_direction_index();
		}

		element.direction = directions[index];

		if(element.profit === 1000000 && element.direction === "up")
		{
			element.direction = "down";
		}

		else if(element.profit === -1000000 && element.direction === "down")
		{
			element.direction = "up";
		}

		if(element.direction === "up")
		{
			var dir = "UP";
		}

		else
		{
			var dir = "DOWN";
		}

		var s = "<div class='element_container";

		if(element.profit > 0)
		{
			s +=  " green";
		}

		else
		{
			s += " red";
		}

		if(options.hints && (element.profit === 0 || element.profit === 200000) && element.direction === "up")
		{
			s += " pulsating";
		}

		s += "'>";

		s += "<div class='element_name'>" + elements[i].name + "</div>";
		s += "<div class='element_profit'>" + format(element.profit) +"</div>";
		s += "<div class='element_direction'>" + dir + "</div>";
		s += "<button class='element_patent_btn' style='display:none'>Buy Patent</button>";
		s += "</div>";

		$('#main_container').append(s);
	}

	$('.element_container').each(function()
	{
		$(this).mousedown(function()
		{
			if(playing && started && !paused)
			{
				patent_btn_events(this);
			}
		})
	});
}

function fit()
{
	if($('#main_container').html() !== "")
	{
		var size = 1;

		$('#main_container').css('font-size', size + 'em');

		for(var i=0; i<20; i++)
		{
			if(document.body.scrollHeight > document.body.clientHeight)
			{
				size -= 0.025;
				
				$('#main_container').css('font-size', size + 'em');
			}
		}
	}
}

function patent_btn_events(parent)
{
	var name = $(parent).find('.element_name').get(0).innerHTML;
	var btn = $(parent).find('.element_patent_btn').get(0);

	var element = get_element(name);

	if(btn.innerHTML === 'Buy Patent')
	{
		if(element.profit <= 0)
		{
			var price = Math.abs(element.profit);
		}

		else
		{
			var price = element.profit * 5;
		}

		if(points < price)
		{
			play('nope');
			return false;
		}

		points -= price;

		report.push(-price);

		element.owned = true;

		if(element.soldonce)
		{
			if(!element.frozen)
			{
				element.frozen = true;

				$($('.element_container').get(element.id)).removeClass('green');
				$($('.element_container').get(element.id)).removeClass('red');
				$($('.element_container').get(element.id)).addClass('blue');
			}
		}

		$(btn).addClass('btn_sell');
		$(btn).html('Sell Patent');
	}

	else
	{
		if(element.frozen)
		{
			return;
		}

		if(element.profit <= 0)
		{
			var price = 0;
		}

		else
		{
			var price = element.profit * (element.profit / 200000);
		}

		points += price;

		report.push(price);

		element.owned = false;

		element.soldonce = true;

		$(btn).removeClass('btn_sell');
		$(btn).html('Buy Patent');

		sold_on_tick.push(element);

		if(sold_on_tick.length > 3)
		{
			sold_on_tick.splice(0, 1);
		}

		if(sold_on_tick.length > 2)
		{
			if(sold_on_tick[0].profit > 0)
			{
				if(sold_on_tick[0].profit === sold_on_tick[1].profit && sold_on_tick[0].profit === sold_on_tick[2].profit)
				{
					var id1 = sold_on_tick[0].id;
					var id2 = sold_on_tick[1].id;
					var id3 = sold_on_tick[2].id;

					if(id1 !== id2 && id1 !== id3 && id2 !== id3)
					{
						var pts = sold_on_tick[0].profit * 5;

						points += pts;

						report.push(pts);

						$($('.element_container').get(id1)).addClass('pulsetrio');
						$($('.element_container').get(id2)).addClass('pulsetrio');
						$($('.element_container').get(id3)).addClass('pulsetrio');

						setTimeout(function()
						{
							$($('.element_container').get(id1)).removeClass('pulsetrio');
							$($('.element_container').get(id2)).removeClass('pulsetrio');
							$($('.element_container').get(id3)).removeClass('pulsetrio');
						}, 800);
						
						sold_on_tick = [];
					}
				}
			}
		}
	}

	update_points();

	if(options.hints)
	{
		check_all_hints();
	}
}

function get_element(name)
{
	for(var i=0; i<elements.length; i++)
	{
		if(elements[i].name === name)
		{
			return elements[i];
		}
	}
}

function change_profit(element)
{
	if(element.direction === "up")
	{
		var change = 200000;
	}

	else
	{
		var change = -200000;
	}

	element.profit += change;

	if(element.profit <= -1000000)
	{
		element.direction = "up";
		$($('.element_container').get(element.id)).find('.element_direction').get(0).innerHTML = "UP";
	}

	if(element.profit >= 1000000)
	{
		element.direction = "down";
		$($('.element_container').get(element.id)).find('.element_direction').get(0).innerHTML = "DOWN";
	}
}

function format(n)
{
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function TickTimer(callback, delay) 
{
	var timerId, start, remaining = delay;

	this.pause = function() 
	{
		clearTimeout(timerId);
		remaining -= new Date() - start;
		this.active = false;
	}

	this.resume = function() 
	{
		start = new Date();
		clearTimeout(timerId);
		timerId = setTimeout(callback, remaining);
		this.active = true;
	}

	this.resume();
}

function loop() 
{
	tick_timer = new TickTimer(function() 
	{
		if(count > 0)
		{
			tick();
		}

		if(count > 0)
		{
			if(speed === "Linear")
			{
				loop_speed -= linear_diff;
			}

			loop();
		}

	}, loop_speed);
};

function stop_loop()
{
	if(tick_timer !== undefined)
	{
		tick_timer.pause();
	}
}

function tick()
{
	sold_on_tick = [];

	report.push(';');

	for(var i=0; i<elements.length; i++)
	{
		var element = elements[i];

		var cont = $('.element_container').get(i);

		element.soldonce = false;

		if(element.frozen)
		{
			element.frozen = false;
			$(cont).removeClass('blue');
		}

		else
		{
			change_profit(element);
		}

		$(cont).find('.element_profit').html(format(element.profit));

		if(element.profit > 0)
		{
			$(cont).removeClass('red');
			$(cont).addClass('green');
		}

		else
		{
			$(cont).removeClass('green');
			$(cont).addClass('red');                
		}

		if(element.owned)
		{
			points += element.profit;
			report.push(element.profit);
		}
	}
	
	update_points();

	if(points <= 0)
	{ 
		lost();
		return;
	}

	decrease_counter();

	if(options.hints)
	{
		check_all_hints();
	}

}

function check_hint(element)
{
	var cont = $('.element_container').get(element.id);

	$(cont).removeClass('pulsating');

	if(count > 1)
	{
		if(element.direction === "down" && element.owned)
		{
			$(cont).addClass('pulsating');
		}

		else if(element.profit === 0 && element.direction === "up" && !element.owned)
		{
			$(cont).addClass('pulsating');
		}

		else if(element.profit > 0 && element.profit < 1000000 && element.direction === "up" && !element.owned)
		{
			if(points >= element.profit * 5)
			{
				$(cont).addClass('pulsating');
			}
		}
	}

	else if(count === 1)
	{
		if(element.owned)
		{
			if(element.profit === -200000 && element.direction === "up")
			{
				return;
			}

			else if(element.profit === 0 && element.direction === "up")
			{
				return;
			}

			else if(element.profit === 200000 && element.direction === "up")
			{
				return;
			}

			$(cont).addClass('pulsating');
		}

		else
		{
			if(element.profit === 0 && element.direction === "up")
			{
				$(cont).addClass('pulsating');
			}
		}
	}
}

function check_all_hints()
{
	for(var i=0; i<elements.length; i++)
	{
		check_hint(elements[i]);
	}
}

function update_points()
{
	$('#points').html(format(points));
}

function decrease_counter()
{
	count -= 1;

	update_counter();

	if(count <= 0)
	{   
		ended();
	}

	else
	{
		play('pup');
	}
}

function show_instructions()
{
	var s = "<b>Instructions</b><br>";
	s += "<img src='inst.gif' id='instgif'><br><br>";
	s += "The goal is to get as much points as you can before the counter reaches 0.<br><br>";
	s += "Earn points by owning elements that have a positive profit.<br><br>";
	s += "You lose points when you own elements that have a negative profit.<br><br>";
	s += "You own an element by buying its patent.<br><br>";
	s += "You are only able to buy patents you can afford.<br><br>";
	s += "Point earnings or losses of owned patents only occur after each tick.<br><br>";
	s += "The prices for each profit point are shown in the table below:<br><br>";
	s += "<table cellspacing=0><tr><th>Profit</th><th>Buy Price</th><th>Sell Price</th></tr><tr><td>-1,000,000</td><td>1,000,000</td><td>0</td></tr><tr><td>-800,000</td><td>800,000</td><td>0</td></tr><tr><td>-600,000</td><td>600,000</td><td>0</td></tr><tr><td>-400,000</td><td>400,000</td><td>0</td></tr><tr><td>-200,000</td><td>200,000</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>200,000</td><td>200,000 x 5</td><td>200,000</td></tr><tr><td>400,000</td><td>400,000 x 5</td><td>400,000 x 2</td></tr><tr><td>600,000</td><td>600,000 x 5</td><td>600,000 x 3</td></tr><tr><td>800,000</td><td>800,000 x 5</td><td>800,000 x 4</td></tr><tr><td>1,000,000</td><td>1,000,000 x 5</td><td>1,000,000 x 5</td></tr></table><br>";
	s += "Changes in profit are either +200,000 or -200,000 per tick.<br><br>";
	s += "Check the direction to see if the profit is going to increase or decrease.<br><br>";
	s += "The direction changes when an element reaches 1,000,000 or -1,000,000 profit.<br><br>";
	s += "Selling the same kind of positive profit, from different elements, 3 times in a row before it ticks, gives a bonus of that kind of profit multiplied by 5.<br><br>";
	s += "Selling a patent and buying it again in the same tick freezes an element which makes it remain at the same state in the next tick.<br><br>";
	s += "You can click any part of the tile to buy or sell, not just the button.<br><br>";
	s += "You can change the seed (#) to have predictable initial configurations.<br><br>";
	s += "You can change the speed of the game, which changes the interval between ticks.<br><br>";
	s += "Ticks happen every 5, 10 or 15 seconds depending on your speed setting.<br><br>";
	s += "Linear speed mode starts at 15 seconds and ends at 5 seconds.<br><br>";
	s += "You start with 1 million points.<br><br>";
	s += "The game ends after 30 ticks have passed.<br><br>";
	s += "If you get 0 or fewer points after a tick, you lose.<br><br>";
	s += "<br><b>Strategy</b><br><br>";
	s += "The point is to maximize your points by selling as much as you can while spending the least.<br><br>";
	s += "The ideal is to buy at 0 UP because it costs you 0 points and sell at 1 million DOWN. Earning you 8 million in total.<br><br>";
	s += "200,000 + 400,000 + 600,000 + 800,000 + 1,000,000 + 5,000,000.<br><br>";
	s += "Selling trios is a good way to get ahead in the game.<br><br>";
	s += "For example, selling 3 elements of 1 million in a row will give you an extra 5 million bonus.<br><br>";
	s += "Trios work no matter what the directions of the elements are, just as long as they're positive and the same number.<br><br>";
	s += "Take advantage of elements freezing, which happens by selling and buying one in the same tick.<br><br>";
	s += "You can lock trios as factories.<br><br>";
	s += "For example, freezing three 1 million DOWN on consecutive ticks, getting 8 million on each tick.<br><br>";
	s += "Then it's a matter of how many factories you can maintain effectively.<br><br>";
	s += "As ticks are about to end, make sure you don't buy anything that won't earn you points, and sell what you need to sell at the last tick.<br><br>";
	s += "In the end, it's a game of picking an effective strategy, scanning and clicking quickly, and be able to have an idea of the state of the game.<br><br>";
	s += "<br><b>Shortcuts</b><br><br>";
	s += "If there is overflow, you can use UpArrow or W to scroll to the top, and DownArrow or S to scroll to the bottom.<br><br>";
	s += "You can start/stop a game with Enter.<br><br>";
	s += "Backspace opens or closes the menu.<br><br>";
	s += "Escape closes dialogs or opens the seed picker.<br><br>";
	s += "You can move up or down seeds with UpArrow and DownArrow when the seed picker input is focused.<br><br>";
	s += "You can select a seed with Enter when the seed picker input is focused.<br><br>";
	s += "You can click the tick count on the top or press Space to pause or resume a game.<br><br>";
	s += "Clicking on \"Game Ended\" shows a report of the game.<br><br>";
	s += "Clicking on the game points shows the high scores.<br><br>";

	msg(s);
}

function get_options()
{
	options = JSON.parse(localStorage.getItem(ls_options));

	if(options === null)
	{
		options = {fit: true, sounds: true, music: true, hints: false};
		localStorage.setItem(ls_options, JSON.stringify(options));
	}
}

function show_options()
{
	var s = "<b>Options</b><br><br>";

	s += "Automatically Fit Grid<br><br>";

	if(options.fit)
	{
		s += "<input id='chk_fit' type='checkbox' checked>";
	}

	else
	{
		s += "<input id='chk_fit' type='checkbox'>";
	}

	s += "<br><br><br>Enable Sounds<br><br>";

	if(options.sounds)
	{
		s += "<input id='chk_sounds' type='checkbox' checked>";
	}

	else
	{
		s += "<input id='chk_sounds' type='checkbox'>";
	}

	s += "<br><br><br>Enable Music<br><br>";

	if(options.music)
	{
		s += "<input id='chk_music' type='checkbox' checked>";
	}

	else
	{
		s += "<input id='chk_music' type='checkbox'>";
	}

	s += "<br><br><br>Enable Hints<br><br>";

	if(options.hints)
	{
		s += "<input id='chk_hints' type='checkbox' checked>";
	}

	else
	{
		s += "<input id='chk_hints' type='checkbox'>";
	}

	msg(s);

	$('#chk_fit').change(function()
	{
		options.fit = $(this).prop('checked');
		localStorage.setItem(ls_options, JSON.stringify(options));

		if(options.fit)
		{
			fit();
		}

		else
		{
			$('#main_container').css('font-size', '1em');
		}
	});

	$('#chk_sounds').change(function()
	{
		options.sounds = $(this).prop('checked');
		localStorage.setItem(ls_options, JSON.stringify(options));

		if(!options.sounds)
		{
			stop_all_sounds();
		}
	});

	$('#chk_music').change(function()
	{
		options.music = $(this).prop('checked');
		localStorage.setItem(ls_options, JSON.stringify(options));

		if(!options.music)
		{
			mute_music();
		}

		else
		{
			unmute_music();
		}
	});

	$('#chk_hints').change(function()
	{
		options.hints = $(this).prop('checked');
		localStorage.setItem(ls_options, JSON.stringify(options));

		if(playing)
		{
			start();
		}
	});
}

function show_about()
{
	var s = "<b>About</b><br><br>";
	s += "Idea and development by madprops<br><br>";
	s += "Version " + version + "<br><br>";
	s += "<a target='_blank' href='http://merkoba.com'>http://merkoba.com</a>";

	msg(s);
}

function get_highscores()
{
	highscores = JSON.parse(localStorage.getItem(ls_highscores));

	if(highscores === null)
	{
		highscores = {
			"Overall":[[-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, '']],
			"Overall - Slow":[[-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, '']],
			"Overall - Normal":[[-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, '']],
			"Overall - Fast":[[-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, '']],
			"Overall - Linear":[[-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, '']]
		};

		localStorage.setItem(ls_highscores, JSON.stringify(highscores));
	}

	else
	{
		var keys = Object.keys(highscores);

		for(var i=0; i<keys.length; i++)
		{
			if(keys[i].indexOf("Overall") !== -1)
			{
				continue;
			}

			var sum = highscores[keys[i]].reduce((a, b) => a + b, 0);

			if(sum === -999990)
			{
				delete highscores[keys[i]];
			}
		}
	}
}

function get_setting_highscores(setting)
{
	var scores = highscores[setting];

	if(scores === undefined)
	{
		highscores[setting] = [-99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999];

		return highscores[setting];
	}

	else
	{
		return scores;
	}
}

function get_setting()
{
	if(seed === -1)
	{
		var s = "#";
	}

	else
	{
		var s = "#" + parseInt(seed);
	}

	s += " - " + speed;

	return s;
}

function start_setting(setting)
{
	var sd = setting.split(" ")[0].replace('#', '');

	if(sd === '')
	{
		seed = -1;
		$('#seed').html('#');
	}

	else
	{
		seed = parseInt(sd);
		$('#seed').html('# ' + seed);
	}

	localStorage.setItem("seed", seed);

	var split = setting.split(" ");

	speed = split[split.length - 1];

	$('#speed_select').val(speed);

	localStorage.setItem("speed", speed);

	start();
}

function show_highscores()
{
	get_highscores();

	var s = "<b>High Scores</b>";

	s += "<div class='select-style2'><select id='hs_setting_select'>";

	s += "<option value='Overall'>Overall</option>";
	s += "<option value='Overall - Slow'>Overall - Slow</option>";
	s += "<option value='Overall - Normal'>Overall - Normal</option>";
	s += "<option value='Overall - Fast'>Overall - Fast</option>";
	s += "<option value='Overall - Linear'>Overall - Linear</option>";

	var keys = Object.keys(highscores);

	var setting = get_setting();
	
	if(keys.indexOf(setting) === -1)
	{
		keys.push(setting);
	}

	keys.sort();

	for(var i=0; i<keys.length; i++)
	{
		var key = keys[i];

		if(key.indexOf("Overall") !== -1)
		{
			continue;
		}

		if(key === setting)
		{
			s += "<option value='" + key + "' selected>" + key + "</option>";
		}

		else
		{
			s += "<option value='" + key + "'>" + key + "</option>";
		}
	}

	s += "</select></div><div id='scores'></div>";

	msg(s);
	
	show_scores($('#hs_setting_select option:selected').val());

	$('#hs_setting_select').change(function()
	{
		show_scores($('#hs_setting_select option:selected').val());
	});
}

function show_report()
{
	var s = "<b>Game Report</b><br>";

	s += "<div>" + get_setting() + "</div><br>";

	var pts = start_points;

	s += "<div class='grey_highlight'>" + start_count + " (" + format(pts) + ")</div><br>";

	var cnt = start_count;

	var total_tpts_positive = 0;
	var total_tpts_negative = 0;
	
	var tpts_positive = 0;
	var tpts_negative = 0;

	for(var i=0; i<report.length; i++)
	{
		var item = report[i];

		if(item === ';')
		{
			cnt -= 1;

			s += "<div>Positive: " + format(tpts_positive) + "</div><br>";
			s += "<div>Negative: " + format(tpts_negative) + "</div><br>";
			s += "<div>Balance: " + format(tpts_positive + tpts_negative) + "</div><br>";

			s += "<div class='grey_highlight'>" + cnt + " (" + format(pts) + ")</div><br>";

			tpts_positive = 0;
			tpts_negative = 0;
		}

		else
		{
			if(item !== 0)
			{
				pts += item;

				if(item > 0)
				{
					s += "<div class='green_color'>" + format(item) + "</div><br>";

					tpts_positive += item;
					total_tpts_positive += item;
				}

				else
				{
					s += "<div class='red_color'>" + format(item) + "</div><br>";

					tpts_negative += item;
					total_tpts_negative += item;
				}
			}
		}
	}

	s += "<div>Positive: " + format(tpts_positive) + "</div><br>";
	s += "<div>Negative: " + format(tpts_negative) + "</div><br>";
	s += "<div>Balance: " + format(tpts_positive + tpts_negative) + "</div><br>";

	s += "<div class='grey_highlight'>Overview</div><br>";

	s += "<div>Total Positive: " + format(total_tpts_positive) + "</div><br>";
	s += "<div>Total Negative: " + format(total_tpts_negative) + "</div><br>";
	s += "<div>Final Balance: " + format(total_tpts_positive + total_tpts_negative) + "</div><br>";
	
	s += "<div class='linkydiv' onclick='copy_report_to_clipboard()'>Copy to Clipboard</div>";

	msg(s);
}

function copy_report_to_clipboard()
{
	var textareaEl = document.createElement('textarea');
	document.body.appendChild(textareaEl);
	textareaEl.value = document.getElementById('msg').innerText.replace('Game Report', '').replace('Copy to Clipboard', '').replace(/\n\s*\n/g, '\n').trim();
	textareaEl.select();
	document.execCommand('copy');
	document.body.removeChild(textareaEl);
	play('pup2');
}

function show_scores(setting)
{
	var scores = get_setting_highscores(setting);

	var s = "";

	if(setting.indexOf("Overall") !== -1)
	{
		for(var i=0; i<scores.length; i++)
		{
			var hs = scores[i][0];
			var ss = scores[i][1];

			if(hs === -99999)
			{
				s += "----";
			}

			else
			{
				s += "<span class='clickable_score'";
				s += " onclick='show_scores(\"" + ss + "\")'>";
				s += "<div class='setting_small'>" + ss + "</div>";

				if(last_highscore !== "" && ss == last_highscore.split('=')[0] && hs == last_highscore.split('=')[1])
				{
					s += "<span class='grey_highlight'>" + format(hs) + "</span>";
				}

				else
				{
					s += "<span>" + format(hs) + "</span>";
				}

				s += "</span>";
			}

			if(i < scores.length - 1)
			{
				s += "<br><br>";
			}
		}
		
		if(setting === "Overall")
		{
			s += "<br><br><div class='linkydiv' onclick='clear_highscores()'>Clear High Scores</div>";
		}
	}
	
	else
	{
		for(var i=0; i<scores.length; i++)
		{
			var hs = scores[i];

			if(hs === -99999)
			{
				s += "----<br><br>";
			}

			else
			{
				if(last_highscore !== "" && setting == last_highscore.split('=')[0] && hs == last_highscore.split('=')[1])
				{
					s += "<span class='grey_highlight'>" + format(hs) + "</span>";
				}

				else
				{
					s += "<span>" + format(hs) + "</span>";
				}

				s += "<br><br>";
			}
		}
		
		s += "<div class='linkydiv' onclick='start_setting(\"" + setting + "\")'>Play Again</div>";
	}
	
	$('#scores').html(s);
	
	$('#hs_setting_select').val(setting);

	$('#msg').scrollTop(0);
}

function get_speed()
{
	var speeds = ["Slow", "Normal", "Fast", "Linear"];

	speed = localStorage.getItem("speed");

	if(speed === null)
	{
		speed = "Normal";
		localStorage.setItem("speed", speed);
	}

	else if(speeds.indexOf(speed) === -1)
	{
		speed = "Normal";
		localStorage.setItem("speed", speed);
	}

	$('#speed_select').val(speed);
}

function set_speed()
{
	if(speed === "Slow" || speed === "Linear")
	{
		loop_speed = 15000;
	}

	else if(speed === "Normal")
	{
		loop_speed = 10000;
	}

	else if(speed === "Fast")
	{
		loop_speed = 5000;
	}
}

function lost()
{

	playing = false;

	start_music_fadeout();

	count -= 1;

	$('#title').html('You Lost');

	count = 0;

	var s = "You got " + format(points) + " points.<br><br>You lost.<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button><br><br><button class='dialog_btn' onclick='show_instructions()'>Instructions</button>";
	
	if(!options.hints)
	{
		s += "<br><br><button class='dialog_btn' onclick='play_with_hints()'>Play with Hints</button>";
	}

	msg(s, true);

	$('#start').html('Play Again');

	play('lost');
}

function ended()
{
	$('#title').html('Game Ended');

	playing = false;

	start_music_fadeout();

	if(options.hints)
	{
		msg("Time's up!<br><br>Score: " + format(points) + "<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button><span id='hint_dis'><br><br><button class='dialog_btn' onclick='disable_hints()'>Disable Hints</button></span>", true);
		play('ended');
		return;
	}

	get_highscores();

	var setting = get_setting();
	var hs = get_setting_highscores(setting);
	var overall = highscores.Overall;
	var overall_speed = highscores["Overall - " + speed];

	if(!options.hints && points > hs[hs.length -1])
	{
		var sum = hs.reduce((a, b) => a + b, 0);

		if(sum > -999990 && points > hs[0])
		{
			msg("Time's up!<br><br>Score: " + format(points) + "<br><br>New high score!<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button><br><br><button class='dialog_btn' onclick='show_highscores()'>High Scores</button>", true);
			
			play('highscore');

			hs.push(points);
			hs.sort(function(a, b){return b-a});
			hs.splice(10, hs.length);

			localStorage.setItem(ls_highscores, JSON.stringify(highscores));
		}

		else
		{
			msg("Time's up!<br><br>Score: " + format(points) + "<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button><br><br><button class='dialog_btn' onclick='show_highscores()'>High Scores</button>", true);
			
			play('ended');
			
			if(hs.indexOf(points) === -1)
			{
				hs.push(points);
				hs.sort(function(a, b){return b-a});
				hs.splice(10, hs.length);

				localStorage.setItem(ls_highscores, JSON.stringify(highscores));
			}
		}
	}

	else
	{
		msg("Time's up!<br><br>Score: " + format(points) + "<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button><br><br><button class='dialog_btn' onclick='show_highscores()'>High Scores</button>", true);
		
		play('ended');
	}

	$('#start').html('Play Again');

	overall.sort(function(a, b)
	{
		var x=a[0];
		var y=b[0];

		return y-x;
	});

	if(points > overall_speed[overall_speed.length -1][0])
	{
		overall_speed.push([points, setting]);

		overall_speed.sort(function(a, b)
		{
			var x=a[0];
			var y=b[0];

			return y-x;
		});

		var counted = [];
		var ncounted = [];

		for(var i=0; i<overall_speed.length; i++)
		{
			if(overall_speed[i][1] === "" || ncounted.indexOf(overall_speed[i][1]) === -1)
			{
				counted.push(overall_speed[i]);
				ncounted.push(overall_speed[i][1]);

				if(counted.length === 10)
				{
					break;
				}
			}
		}

		highscores["Overall - " + speed] = counted;

		localStorage.setItem(ls_highscores, JSON.stringify(highscores));
	}

	if(points > overall[overall.length -1][0])
	{
		overall.push([points, setting]);

		overall.sort(function(a, b)
		{
			var x=a[0];
			var y=b[0];

			return y-x;
		});

		var counted = [];
		var ncounted = [];

		for(var i=0; i<overall.length; i++)
		{
			if(overall[i][1] === "" || ncounted.indexOf(overall[i][1]) === -1)
			{
				counted.push(overall[i]);
				ncounted.push(overall[i][1]);

				if(counted.length === 10)
				{
					break;
				}
			}
		}

		highscores.Overall = counted;

		localStorage.setItem(ls_highscores, JSON.stringify(highscores));
	}

	last_highscore = setting + "=" + points;
}

function overlay_clicked()
{
	$('#overlay').click(function()
	{
		hide_overlay();
	})
}

function hide_overlay(force=false)
{
	if(msg_closeable || force)
	{
		$('#overlay').css('display', 'none');
		$('#msg').css('display', 'none');
		$('#msg').html('');
		msg_open = false;
		msg_closeable = false;
	}
}

function msg(txt, temp_disable=false)
{
	to_top();
	
	$('#overlay').css('display', 'block');
	$('#msg').html(txt);
	$('#msg').css('display', 'block');
	$('#msg').scrollTop(0);
	$('#msg').focus();

	if(temp_disable)
	{
		$('.dialog_btn').prop('disabled', true);
		msg_closeable = false;

		setTimeout(function()
		{
			$('.dialog_btn').prop('disabled', false);
			msg_closeable = true;

		}, 800);
	}

	else
	{
		msg_closeable = true;
	}

	msg_open = true;
}

function refresh()
{
	document.location = document.location;
}

function play(what)
{
	if(what === "music")
	{
		if(options.music)
		{
			unmute_music();
		}

		else
		{
			mute_music();
		}

		$('#music')[0].pause();
		$('#music')[0].currentTime = 0;
		$('#music')[0].play();

	}

	else if(options.sounds)
	{
		$('#' + what)[0].pause();
		$('#' + what)[0].currentTime = 0;
		$('#' + what)[0].play();
	}
}

function music_control()
{
	$('#music')[0].ontimeupdate = function() 
	{
		if(count > 0 && this.currentTime > 73.2)
		{
			this.currentTime = 4.5;
		}
	};
}

function pause_music()
{
	$('#music')[0].pause();
}

function unpause_music()
{
	$('#music')[0].play();
}

function mute_music()
{
	$('#music')[0].volume = 0;
}

function unmute_music()
{
	$('#music')[0].volume = 1;
}

function start_music_fadeout()
{
	music_fadeout_interval = setInterval(music_fadeout, 100);
}

function music_fadeout() 
{
	var newVolume = $('#music')[0].volume - 0.01;

	if(newVolume >= 0)
	{
		$('#music')[0].volume = newVolume;
	}

	else
	{
		if(music_fadeout_interval !== undefined)
		{
			clearInterval(music_fadeout_interval);
		}

		$('#music')[0].volume = 0;
		$('#music')[0].pause();
		$('#music')[0].currentTIme = 0;
	}

}

function to_top()
{
	$('body').scrollTop(0);
}

function update_counter()
{
	$('#title').html(count);
}

function seed_picker()
{
	var s = "0 to 999<br><br><input id='seed_input'><br><br><br>";
	s += "<button class='dialog_btn' onclick='check_seed()'>Ok</button>&nbsp;&nbsp;";
	s += "<button class='dialog_btn' onclick='get_random_seed()'>?</button><br><br>";
	s += "<button class='dialog_btn' onclick='change_seed(-1)'>Random</button>";

	msg(s);

	$('#seed_input').attr('type', 'number');
	$('#seed_input').attr('max', 999);
	$('#seed_input').attr('min', 0);

	$('#seed_input').on('input', function()
	{
		if($(this).val().length > 3)
		{
			$(this).val($(this).val().substring(0, 3));
		}
	});

	if(seed !== -1)
	{
		$('#seed_input').val(seed);
	}

	$('#seed_input').focus();
}

function check_seed()
{
	var input = $('#seed_input').val().trim();

	if(input == "")
	{
		$('#seed_input').focus();
		return false;
	}

	if(isNaN(input))
	{
		$('#seed_input').focus();
		return false;
	}

	else
	{
		if(input < 0 || input > 999)
		{
			$('#seed_input').focus();
			return false;
		}

		else
		{
			change_seed(input);
		}
	}
}

function get_seed()
{
	seed = localStorage.getItem("seed");

	if(seed === null)
	{
		seed = -1;
		localStorage.setItem("seed", seed);
	}

	seed = parseInt(seed);

	if(seed === -1)
	{
		$('#seed').html('#');
	}

	else
	{
		$('#seed').html('# ' + seed);
	}
}

function change_seed(s)
{
	seed = parseInt(s);

	if(seed === -1)
	{
		$('#seed').html('#');
	}

	else
	{
		$('#seed').html('# ' + seed);
	}

	localStorage.setItem("seed", seed);

	start();
}

function get_random_seed()
{
	var r = get_random_int(0, 999);

	if($('#seed_input').val() == r)
	{
		r += 1;

		if(r > 999)
		{
			r = 0;
		}
	}

	$('#seed_input').val(r).focus();
}

function get_random_int(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function check_firstime()
{
	if(localStorage.getItem("firstime") === null)
	{
		show_instructions();
		localStorage.setItem("firstime", "check");
	}
}

function get_random_profit_index()
{
	var r = Math.random();

	var n = Math.round(r * 10);

	if(n > profits.length - 1)
	{
		n = profits.length - 1;
	}

	if(n < 0)
	{
		n = 0;
	}

	return n;
}

function get_random_direction_index()
{
	var n = Math.round(Math.random());

	if(n < 0)
	{
		n = 0;
	}

	if(n > 0)
	{
		n = 1;
	}

	return n;
}

function speed_changed()
{
	$('#speed_select').change(function()
	{
		speed = $('#speed_select option:selected').val(); 
		localStorage.setItem("speed", speed);
		start();
	});
}

function key_detection()
{
	$(document).keydown(function(e)
	{ 
		var code = e.keyCode;

		if(!$('input').is(':focus'))
		{
			if(code === 8)
			{
				toggle_menu();
				e.preventDefault();
				return;
			}

			else if(code === 13)
			{
				check_start();
				e.preventDefault();
				return;
			}

			else if(code === 32)
			{
				toggle_pause();
				e.preventDefault();
				return;
			}
		}

		else
		{
			if(code === 13)
			{
				if($('#seed_input').is(':focus'))
				{
					check_seed();
					return;
				}
			}
		}

		if(!msg_open)
		{
			if(code === 40 || code === 83)
			{
				$('body').scrollTop($(document).height() - $(window).height());
			}

			else if(code === 38 || code === 87)
			{
				$('body').scrollTop(0);
			}

			else if(code === 27)
			{
				seed_picker();
			}
		}

		else
		{
			if(code === 27)
			{
				hide_overlay();
			}
		}
	});
}

function stop()
{
	playing = false;
	clear_started();
	count = 0;
	stop_loop();
	stop_all_audio();
	hide_overlay(true);
	$('#main_container').html('');
	$('#title').html('E l e m e n t s');
	$('#points').html('');
	$('#start').html('Start');
	$('body').css('background-image', 'url(splash.jpg)');
}

function stop_all_sounds()
{
	$('.sound').each(function()
	{
		this.pause();
		this.currentTime = 0;
	});
}

function stop_the_music()
{
	$('#music')[0].pause();
	$('#music')[0].currentTime = 0;
}

function stop_all_audio()
{
	stop_all_sounds();
	stop_the_music();
}

function show_menu()
{
	var s = "<div id='msg_menu'></div>";
	s += "<button class='dialog_btn' onclick='show_instructions()'>Instructions</button><br><br>";
	s += "<button class='dialog_btn' onclick='show_highscores()'>High Scores</button><br><br>";
	s += "<button class='dialog_btn' onclick='show_options()'>Options</button><br><br>";
	s += "<button class='dialog_btn' onclick='show_about()'>About</button>";

	msg(s);

	var w = $('#msg').find('.dialog_btn').first().outerWidth();

	$('#msg').find('.dialog_btn').each(function()
	{
		$(this).css('width', w);
	});
}

function toggle_menu()
{
	if($('#msg_menu').length === 0)
	{
		show_menu();
	}

	else
	{
		hide_overlay();
	}
}

function clear_highscores()
{
	var conf = confirm("This will delete all your high scores. Are you sure?");

	if(conf) 
	{
		localStorage.removeItem(ls_highscores);
		show_highscores();
	}
}

var resize_timer = (function() 
{
	var timer; 
	return function() 
	{
		clearTimeout(timer);
		timer = setTimeout(function() 
		{
			fit();
		}, 350);
	};
})();

function resize_events()
{
	$(window).resize(function()
	{
		if(options.fit)
		{
			resize_timer();
		}
	});
}

function play_with_hints()
{
	options.hints = true;
	localStorage.setItem(ls_options, JSON.stringify(options));
	start();
}

function disable_hints()
{
	options.hints = false;
	localStorage.setItem(ls_options, JSON.stringify(options));

	$('#hint_dis').remove();

	$('.element_container').each(function()
	{
		$(this).removeClass('pulsating');
	});
}

function title_click()
{
	if(playing && started)
	{
		toggle_pause();
	}

	else
	{
		if($('#title').html() === "E l e m e n t s")
		{
			show_about();
		}

		else if($('#title').html() === "Game Ended")
		{
			show_report();
		}

		else if($('#title').html() === "You Lost")
		{
			show_instructions();
		}

		else if($('#title').html() === "Starting Game")
		{
			if(isNaN(seed))
			{
				change_seed('-1');
			}

			else
			{
				change_seed('.1');
			}
		}
	}
}

function toggle_pause()
{
	if(tick_timer !== undefined && playing && started)
	{
		if(tick_timer.active)
		{
			tick_timer.pause();
			pause_music();
			paused = true;
			$('#title').html('Paused');
		}

		else
		{
			tick_timer.resume();
			unpause_music();
			update_counter();
			paused = false;
		}
	}
}