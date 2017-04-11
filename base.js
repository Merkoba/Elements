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

var num_owned = 0;

var loop_timeout;

var started_timeout;

var fab = 1000000;

var seed = -1;

var profits = [-1000000, -800000, -600000, -400000, -200000, 0, 200000, 400000, 600000, 800000, 1000000];

var directions = ["up", "down"];

var msg_open = false;

function init()
{
    get_highscores();
    get_speed();
    speed_changed();   
    overlay_clicked();
    key_detection();
}

function start()
{ 
    count = 0;
    stop_loop();
    hide_overlay();
    generate_tiles();
    $('#fab').html('Starting Game');
    $('#counter').html('---');
    $('#start').html('Restart');
    $('body').css('background-image', 'none');
    $('#main_container').focus();
    to_top();
    play('started');

    if(started_timeout !== undefined)
    {
        clearTimeout(started_timeout)
    }

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

        element.profit = profits[get_random_profit_index()];
        element.direction = directions[get_random_direction_index()];

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

    $('.element_patent_btn').each(function()
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

function patent_btn_events(btn)
{
    var parent = $(btn).parent();

    var name = $(parent).find('.element_name').get(0).innerHTML;

    var element = get_element(name);

    if(btn.innerHTML === 'Buy Patent')
    {
        var price = element.profit * 4;

        if(fab < price)
        {
            play('nope');
            return false;
        }

        $(btn).addClass('btn_sell');
        $(btn).html('Sell Patent');

        if(element.profit <= 0)
        {
            fab -= 1000;
        }
        else
        {
            fab -= price;
        }

        element.owned = true;

        num_owned += 1;
    }

    else
    {
        var price = element.profit * 4;

        $(btn).removeClass('btn_sell');
        $(btn).html('Buy Patent');

        if(element.profit <= 0)
        {
            fab += 1000;
        }
        else
        {
            fab += price;
        }

        element.owned = false;

        num_owned -= 1;
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
            loop();
        }
    }, speed);
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
    s += "Point earnings or loses of owned patents only occurs after each tick.<br><br>";
    s += "You can sell the patent of an element and get 4 times its current profit.<br><br>";
	s += "Selling high profit patents is a major source of points.<br><br>";
    s += "If you buy a patent and it has 0 or negative profit it will cost 1000.<br><br>";
    s += "When you sell a patent and it has 0 or negative profit you will get 1000.<br><br>";
    s += "Check the direction to see if the profit is going to increase or decrease.<br><br>";
	s += "Changes in profit are either +200,000 or -200,000.<br><br>";
    s += "Ticks happen every 5, 10 or 15 seconds depending on your speed setting.<br><br>";
    s += "You can change the seed (#) to have predictable initial configurations.<br><br>";
    s += "You can use upArrow or W to scroll to the top. And downArrow or S to scroll to the bottom.<br><br>";
    s += "The game ends after 50 ticks have passed.<br><br>";
    s += "If you get to 0 or less points you lose.<br><br>";

	msg(s);
}

function get_highscores()
{
    highscores = JSON.parse(localStorage.getItem("highscores"));

    if(highscores === null)
    {
        highscores = [-99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999, -99999];
        localStorage.setItem("highscores", JSON.stringify(highscores));
    }
    else
    {
        highscores.sort(function(a, b){return b-a});
    }
}

function show_highscores()
{
    var s = "<b>High Scores</b><br><br>";

    for(var i=0; i<highscores.length; i++)
    {
        var hs = highscores[i];

        if(hs === -99999)
        {
            hs = "----";
        }

        s += format(hs) + "<br><br>";
    }

    msg(s);
}

function get_speed()
{
    speed = localStorage.getItem("speed");

    if(speed === null)
    {
        speed = "10000";
        localStorage.setItem("speed", "10000");
    }

    $('#speed_select').val(speed);
}

function game_ended()
{
    if(fab > highscores[highscores.length -1])
    {
        if(fab > highscores[0])
        {
            msg("Time's up!<br><br>Score: " + format(fab) + "<br><br>New high score!<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button>");
            play('highscore');
        }
        else
        {
            msg("Time's up!<br><br>Score: " + format(fab) + "<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button>");
            play('ended');
        }

        highscores.push(fab);

        highscores.sort(function(a, b){return b-a});

        highscores = highscores.slice(0, 10);

        localStorage.setItem("highscores", JSON.stringify(highscores));
    }
    else
    {
        msg("Time's up!<br><br>Score: " + format(fab) + "<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button>");
        play('ended');
    }

    fab_ended();

}

function lost()
{
    count -= 1;

    update_counter();

    count = 0;

    msg("You got " + format(fab) + " points.<br><br>You lost.<br><br><br><button class='dialog_btn' onclick='start()'>Play Again</button>");

    fab_ended();

    play('lost');
}

function overlay_clicked()
{
    $('#overlay').click(function()
    {
        hide_overlay();
    })
}

function hide_overlay()
{
    $('#overlay').css('display', 'none');
    $('#msg').css('display', 'none');
    msg_open = false;
}

function msg(txt)
{
    to_top();
    $('#overlay').css('display', 'block');
    $('#msg').html(txt);
    $('#msg').css('display', 'block');
    $('#msg').scrollTop(0);
    $('#msg').focus();
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
        speed = parseInt($('#speed_select option:selected').val()); 

        if(count > 0)
        {
            restart_loop(); 
        }
        
        localStorage.setItem("speed", speed);
    });
}

function key_detection()
{
    $(document).keydown(function(e)
    { 
        var code = e.keyCode;

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