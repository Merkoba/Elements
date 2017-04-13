var elements = [
    {
        "name": "Adamant",
    },
    {
        "name": "Adamantite",
    },
    {
        "name": "Adamantium",
    },
    {
        "name": "Nth Metal",
    },
    {
        "name": "Administratium",
    },
    {
        "name": "Administrontium",
    },
    {
        "name": "Aether",
    },
    {
        "name": "Australium",
    },
    {
        "name": "Badassium",
    },
    {
        "name": "Bavarium",
    },
    {
        "name": "Bombastium",
    },
    {
        "name": "Bureaucratium",
    },
    {
        "name": "Byzanium",
    },
    {
        "name": "Cobalt Thorium G",
    },
    {
        "name": "Carbonadium",
    },
    {
        "name": "Cavorite",
    },
    {
        "name": "Chronoton",
    },
    {
        "name": "Collapsium",
    },
    {
        "name": "Dilithium",
    },
    {
        "name": "Divinium (E115)",
    },
    {
        "name": "Duranium",
    },
    {
        "name": "Durium",
    },
    {
        "name": "Dust",
    },
    {
        "name": "Element Zero",
    },
    {
        "name": "Element 99",
    },
    {
        "name": "Feminum",
    },
    {
        "name": "Frinkonium",
    },
    {
        "name": "Harbenite",
    },
    {
        "name": "Ice-Nine",
    },
    {
        "name": "Katchin",
    },
    {
        "name": "Kryptonite",
    },
    {
        "name": "Meteorillium",
    },
    {
        "name": "Mithril",
    },
    {
        "name": "Octiron",
    },
    {
        "name": "Orichalcum",
    },
    {
        "name": "Polydenum",
    },
    {
        "name": "Quadium",
    },
    {
        "name": "Radium X",
    },
    {
        "name": "Rearden Metal",
    },
    {
        "name": "Redstone",
    },
    {
        "name": "Scrith",
    },
    {
        "name": "Timonium",
    },
    {
        "name": "Transformium",
    },
    {
        "name": "Tritanium",
    },
    {
        "name": "Unobtanium",
    },
    {
        "name": "Uridium",
    },
    {
        "name": "Uru",
    },
    {
        "name": "Verterium",
    },
    {
        "name": "Vibranium",
    },
    {
        "name": "Wishalloy",
    },
    {
        "name": "Xirdalium",
    },
    {
        "name": "Xithricite",
    }
];

var loop_timeout;

var started_timeout;

var fab = 1000000;

var seed = -1;

var profits = [-1000000, -800000, -600000, -400000, -200000, 0, 200000, 400000, 600000, 800000, 1000000];

var directions = ["up", "down"];

var msg_open = false;

var highscores;

var ls_highscores = "highscores_v1";

var msg_closeable = false;

function init()
{
    get_speed();
    speed_changed();
    get_seed();
    get_highscores();
    overlay_clicked();
    key_detection();
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
    count = 0;
    stop_loop();
    hide_overlay(true);
    generate_tiles();
    set_speed();
    $('#fab').html('Starting Game');
    $('#counter').html('---');
    $('#start').html('Stop');
    $('body').css('background-image', 'none');
    $('#main_container').focus();
    to_top();
    play('started');

    clear_started();

    started_timeout = setTimeout(function()
    {
        $('.element_patent_btn').each(function()
        {
            $(this).css('display', 'inline-block')
        });

        fab = 1000000;
        count = 50;
        update_fab();
        update_counter();
        loop();

    }, 3700);
}

function clear_started()
{
    if(started_timeout !== undefined)
    {
        clearTimeout(started_timeout)
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

        if(element.profit > 0)
        {
            var s = "<div class='element_container green'>";
        }
        else
        {
            var s = "<div class='element_container red'>";
        }

        s += "<div class='element_name'>" + elements[i].name + "</div>";
        s += "<div class='element_profit'>" + format(element.profit) +"</div>";
        s += "<div class='element_direction'>" + dir + "</div>";
        s += "<button class='element_patent_btn' style='display:none'>Buy Patent</button>";
        s += "</div>";

        $('#main_container').append(s);
    }

    $('.element_container').each(function()
    {
        $(this).click(function()
        {
            if(count > 0)
            {
                patent_btn_events(this);
            }
        })
    });    
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
            var price = 100000;
        }
        else
        {
            var price = element.profit * 4;
        }

        if(fab < price)
        {
            play('nope');
            return false;
        }

        fab -= price;

        element.owned = true;

        $(btn).addClass('btn_sell');
        $(btn).html('Sell Patent');
    }

    else
    {
        if(element.profit <= 0)
        {
            var price = 100000;
        }
        else
        {
            var price = element.profit * 4;
        }

        fab += price;

        element.owned = false;

        $(btn).removeClass('btn_sell');
        $(btn).html('Buy Patent');
    }

    update_fab();
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

function start_loop()
{
	setInterval(function()
	{
		tick();
	}, speed);
}

function loop() 
{
    loop_timeout = setTimeout(function() 
    {

        if(count > 0)
        {
            tick();
        }

        if(count > 0)
        {
            if(speed === "Linear")
            {
                loop_speed -= 204.0816326530612;
            }

            loop();
        }

    }, loop_speed);
};

function stop_loop()
{
    if(loop_timeout !== undefined)
    {
        clearTimeout(loop_timeout);
    }
}

function restart_loop()
{
    stop_loop();
    loop();
}

function tick()
{
	for(var i=0; i<elements.length; i++)
	{
		var element = elements[i];

		change_profit(element);

		var cont = $('.element_container').get(i);

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
            fab += element.profit;
        }
	}
    
    update_fab();

    if(fab <= 0)
    { 
        lost();
        return;
    }

    decrease_counter();
}

function update_fab()
{
    $('#fab').html(format(fab));
}

function fab_ended()
{
	$('#fab').html(format(fab) + " (Game Ended)");
}

function decrease_counter()
{
    count -= 1;

    update_counter();

    if(count <= 0)
    {   
        game_ended();
    }
    else
    {
        if(document.hasFocus())
        {
            play('pup');
        }
    }
}

function halp()
{
    s = "<b>Instructions</b><br><br>"
	s += "The goal is to get as much points as you can before the counter reaches 0.<br><br>";
	s += "Earn points by owning elements that have a positive profit.<br><br>";
    s += "You lose points when you own elements that have a negative profit.<br><br>";
    s += "You own an element by buying its patent. The price is 4 times its current profit.<br><br>";
    s += "You are only able to buy patents you can afford.<br><br>";
    s += "Point earnings or losses of owned patents only occurs after each tick.<br><br>";
    s += "You can sell the patent of an element and get 4 times its current profit.<br><br>";
	s += "Selling high profit patents is a major source of points.<br><br>";
    s += "If you buy a patent and it has 0 or negative profit it will cost 100,000.<br><br>";
    s += "When you sell a patent and it has 0 or negative profit you will get 100,000.<br><br>";
    s += "Check the direction to see if the profit is going to increase or decrease.<br><br>";
    s += "Changes in profit are either +200,000 or -200,000.<br><br>";
	s += "You can click any part of the tile to buy or sell not just the button.<br><br>";
    s += "You can change the seed (#) to have predictable initial configurations.<br><br>";
    s += "You can change the speed of the game which changes the interval between ticks."
    s += "Ticks happen every 5, 10 or 15 seconds depending on your speed setting.<br><br>";
    s += "Linear speed mode starts at 15 seconds and ends at 5 seconds.<br><br>";
    s += "You can use upArrow or W to scroll to the top. And downArrow or S to scroll to the bottom.<br><br>";
    s += "You can start/stop a game with backspace.<br><br>";
    s += "Escape closes dialogs or opens the seed picker.<br><br>";
    s += "The game ends after 50 ticks have passed.<br><br>";
    s += "If you get to 0 or less points you lose.<br><br>";

	msg(s);
}

function get_highscores()
{
    highscores = JSON.parse(localStorage.getItem(ls_highscores));

    if(highscores === null)
    {
        highscores = {Overall:[[-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, ''], [-99999, '']]};
        localStorage.setItem(ls_highscores, JSON.stringify(highscores));
    }

    else
    {
        var keys = Object.keys(highscores);

        for(var i=0; i<keys.length; i++)
        {
            if(keys[i] === "Overall")
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

function get_setting_highscores()
{
    var s = get_setting();

    var hs = highscores[s];

    if(hs === undefined)
    {
        highscores[s] = [-99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999];
        return highscores[s];
    }
    else
    {
        return hs;
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
    var scores = get_setting_highscores();

    var s = "<b>High Scores</b>";

    s += "<div class='select-style2'><select id='hs_setting_select'>";

    s += "<option value='Overall'>Overall</option>";

    var keys = Object.keys(highscores);

    keys.sort();

    var setting = get_setting();

    for(var i=0; i<keys.length; i++)
    {
        var key = keys[i];

        if(key === "Overall")
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

    scores.sort(function(a, b){return b-a});

    msg(s);
    
    show_scores($('#hs_setting_select option:selected').val());

    $('#hs_setting_select').change(function()
    {
        show_scores($('#hs_setting_select option:selected').val());
    });
}

function show_scores(setting)
{
    var scores = highscores[setting];

    var s = "";

    if(setting === "Overall")
    {
        for(var i=0; i<scores.length; i++)
        {
            var hs = scores[i][0];
            var ss = scores[i][1];


            if(hs === -99999)
            {
                s += "----<br><br>";
            }

            else
            {
                s += "<span class='clickable_score' onclick='show_scores(\"" + ss + "\")'>";
                s += "<div class='setting_small'>" + ss + "</div>";
                s += format(hs) + "</span><br><br>";
            }

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
                s += format(hs) + "<br><br>";
            }
        }
        
        s += "<div id='play_again' onclick='start_setting(\"" + setting + "\")'>Play Again</div>";
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

function game_ended()
{
    var hs = get_setting_highscores();
    var overall = highscores.Overall;

    if(fab > hs[hs.length -1])
    {
        if(fab > hs[0])
        {
            msg("Time's up!<br><br>Score: " + format(fab) + "<br><br>New high score!<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button><br><br><button class='dialog_btn' onclick='show_highscores()'>High Scores</button>", true);
            play('highscore');
        }
        else
        {
            msg("Time's up!<br><br>Score: " + format(fab) + "<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button>", true);
            play('ended');
        }

        hs.push(fab);

        hs.sort(function(a, b){return b-a});

        hs.splice(10, hs.length);

        localStorage.setItem(ls_highscores, JSON.stringify(highscores));
    }

    else
    {
        msg("Time's up!<br><br>Score: " + format(fab) + "<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button>", true);
        play('ended');
    }

    $('#start').html('Play Again');

    overall.sort(function(a, b)
    {
        var x=a[0];
        var y=b[0];
        return y-x;
    });

    if(fab > overall[overall.length -1][0])
    {
        overall.push([fab, get_setting()]);

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
            if(ncounted.indexOf(overall[i][1]) === -1)
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

    fab_ended();

}

function lost()
{
    count -= 1;

    update_counter();

    count = 0;

    msg("You got " + format(fab) + " points.<br><br>You lost.<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button>", true);

    fab_ended();

    $('#start').html('Play Again');

    play('lost');
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

        }, 1000)
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
    if(document.hasFocus())
    {
        $('#' + what)[0].pause();
        $('#' + what)[0].currentTime = 0;
        $('#' + what)[0].play();
    }
}

function to_top()
{
    $('body').scrollTop(0);
}

function update_counter()
{
    $('#counter').html(count);
}

function seed_picker()
{
    var s = "0 to 999<br><br><input id='seed_input'><br><br><br>"
    s += "<button class='dialog_btn' onclick='check_seed()'>Ok</button><br><br>";
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
                check_start();
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
                $('body').animate({scrollTop:$(document).height() - $(window).height()}, 100, 'linear');
            }
            else if(code === 38 || code === 87)
            {
                $('body').animate({scrollTop:0}, 100, 'linear');
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
    clear_started();
    count = 0;
    stop_loop();
    stop_all_audio();
    hide_overlay(true);
    $('#main_container').html('');
    $('#fab').html('E l e m e n t s');
    $('#counter').html('');
    $('#start').html('Start');
    $('body').css('background-image', 'url(splash.jpg)');
}

function stop_all_audio()
{
    $('audio').each(function()
    {
        this.pause();
        this.currentTime = 0;
    })
}