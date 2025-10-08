App.elements = [
	{name: `Adamant`},
	{name: `Adamantite`},
	{name: `Adamantium`},
	{name: `Administratium`},
	{name: `Administrontium`},
	{name: `Aether`},
	{name: `Australium`},
	{name: `Badassium`},
	{name: `Bavarium`},
	{name: `Bombastium`},
	{name: `Bureaucratium`},
	{name: `Byzanium`},
	{name: `Carbonadium`},
	{name: `Cavorite`},
	{name: `Chronoton`},
	{name: `Cobalt Thorium G`},
	{name: `Collapsium`},
	{name: `Dilithium`},
	{name: `Divinium (E115)`},
	{name: `Duranium`},
	{name: `Durium`},
	{name: `Dust`},
	{name: `Element 99`},
	{name: `Element Zero`},
	{name: `Feminum`},
	{name: `Frinkonium`},
	{name: `Harbenite`},
	{name: `Ice-Nine`},
	{name: `Katchin`},
	{name: `Kryptonite`},
	{name: `Merkoba 51`},
	{name: `Meteorillium`},
	{name: `Mithril`},
	{name: `Nth Metal`},
	{name: `Octiron`},
	{name: `Orichalcum`},
	{name: `Polydenum`},
	{name: `Quadium`},
	{name: `Radium X`},
	{name: `Rearden Metal`},
	{name: `Redstone`},
	{name: `Scrith`},
	{name: `Timonium`},
	{name: `Transformium`},
	{name: `Tritanium`},
	{name: `Unobtanium`},
	{name: `Uridium`},
	{name: `Uru`},
	{name: `Verterium`},
	{name: `Vibranium`},
	{name: `Wishalloy`},
	{name: `Woodium`},
	{name: `Xirdalium`},
	{name: `Xithricit`},
]

App.main_title = `E l e m e n t s`
App.start_points = 0
App.start_count = 30
App.profits = [-1000000, -800000, -600000, -400000, -200000, 0, 200000, 400000, 600000, 800000, 1000000]
App.directions = [`up`, `down`]
App.msg_open = false
App.fmsg_open = false
App.ls_highscores = `highscores_v4`
App.ls_highscores_advanced = `highscores_advanced_v4`
App.ls_options = `options_v6`
App.msg_closeable = false
App.speed_slow = 12000
App.speed_normal = 8000
App.speed_fast = 5000
App.linear_diff = (App.speed_slow - App.speed_fast) / (App.start_count - 1)
App.count = 0
App.points = 0
App.music_fadeout_interval
App.playing = false
App.started = false
App.paused = false
App.last_highscore = ``
App.sold_on_tick = []
App.report = []
App.hs_setting = null
App.fmsg_mode = null

App.init = () => {
	App.get_options()
	App.overlay_clicked()
	App.key_detection()
	App.resize_events()
	App.music_control()
	App.check_firstime()
	Math.seedrandom()
	App.disable_context_menus()
	App.start_context_menus()
	App.update_title()
	App.left_side_clicks()
	App.title_clicks()
	App.right_side_clicks()
	App.succ()
}

App.check_start = () => {
	if ($(`#start`).html() === `Stop`) {
		stop()
	}

	else {
		App.start()
	}
}

App.check_escape = () => {
	if (App.msg_open || App.fmsg_open) {
		hide_overlay(true)
		hide_foverlay()
	}

	else {
		if ($(`#title`).html() !== App.main_title) {
			stop()
		}
	}

}

App.hide_and_stop = () => {
	if (App.msg_open || App.fmsg_open) {
		hide_overlay(true)
		hide_foverlay()
	}

	if ($(`#title`).html() !== App.main_title) {
		stop()
	}

	App.update_title()
}

App.start = () => {
	App.playing = true
	App.started = false
	App.paused = false
	stop_loop()
	set_speed()
	hide_overlays()
	generate()
	fit()

	$(`#title`).html(`Starting Game`)
	$(`#points`).html(``)
	$(`#start`).html(`Stop`)
	$(`body`).css(`background-image`, `none`)
	$(`#main_container`).focus()

	to_top()
	play(`started`)

	if (App.music_fadeout_interval !== undefined) {
		clearInterval(App.music_fadeout_interval)
	}

	play(`music`)
	clear_started()

	App.last_highscore = ``
	App.sold_on_tick = []
	App.report = []
	App.num_lit = 0
	App.num_lit_trios = 0
	App.gained_from_lit = 0
	App.ticks_skipped = 0
	bonus = 0
	App.bonus_points = 0
	App.lit_trios_on_tick = 0

	App.started_timeout = setTimeout(() => {
		$(`.element_patent_btn`).each(() => {
			$(this).css(`display`, `inline-block`)
		})

		App.points = App.start_points
		App.count = App.start_count
		update_points()
		App.update_counter()
		App.set_cursors_pointer()
		loop()
		App.started = true
	}, 3700)
}

App.clear_started = () => {
	if (App.started_timeout !== undefined) {
		clearTimeout(App.started_timeout)
	}
}

App.generate = () => {
	$(`#main_container`).html(``)

	if (options.seed === -1) {
		Math.seedrandom()
	}

	else {
		Math.seedrandom(options.seed)
	}

	for (let i = 0; i < App.elements.length; i++) {
		let element = App.elements[i]
		element.owned = false
		element.id = i
		element.soldonce = false
		element.frozen = false
		element.freeze_chain = 0
		element.lit = false
		element.deactivated = false
		element.gone = false
		element.bonus = 0
		let index

		if (options.seed === 0.1) {
			index = 5
		}
		else {
			index = get_random_int(0, 10)
		}

		element.profit = App.profits[index]

		if (options.seed === 0.1) {
			if (i % 2 === 0) {
				index = 1
			}

			else {
				index = 0
			}
		}
		else {
			index = get_random_int(0, 1)
		}

		element.direction = App.directions[index]

		if (element.profit === 1000000 && element.direction === `up`) {
			element.direction = `down`
		}

		else if (element.profit === -1000000 && element.direction === `down`) {
			element.direction = `up`
		}

		let dir

		if (element.direction === `up`) {
			dir = `UP`
		}
		else {
			dir = `DOWN`
		}

		let s = `<div class='element_container cursor_default`

		if (element.profit > 0) {
			s +=  ` green`
		}
		else {
			s += ` red`
		}

		if (options.hints && (element.profit === 0 || element.profit === 200000) && element.direction === `up`) {
			s += ` pulsating`
		}

		s += `'>`

		s += `<div class='element_name'>` + App.elements[i].name + `</div>`
		s += `<div class='element_profit'>` + format(element.profit) +`</div>`
		s += `<div class='element_direction'>` + dir + `</div>`
		s += `<button class='element_patent_btn' style='display:none'>Buy Patent</button>`
		s += `</div>`

		$(`#main_container`).append(s)
	}

	let id = 0

	$(`.element_container`).each(() => {
		$(this).mousedown(() => {
			if (App.playing && App.started && !App.paused) {
				click_events(this)
			}
		})

		$(this).data(`id`, id)
		id += 1
	})
}

App.fit = () => {
	if ($(`#main_container`).html() !== ``) {
		$(`.breaker`).each(() => {
			$(this).remove()
		})

		let size = 1

		$(`#main_container`).css(`font-size`, size + `em`)

		if (options.fit) {
			for (let i = 0; i < 20; i++) {
				if (document.body.scrollHeight > document.body.clientHeight) {
					size -= 0.025

					$(`#main_container`).css(`font-size`, size + `em`)
				}
			}

			if (document.body.scrollHeight <= document.body.clientHeight) {
				let last = $(`.element_container`).last()
				let qheight = last.outerHeight() / 4
				let top1 = last.offset().top
				let top2 = top1 - last.outerHeight()
				let row1 = []
				let row2 = []

				$(`.element_container`).each(() => {
					let top = $(this).offset().top
					let t1 = top - qheight
					let t2 = top + qheight

					if (top1 > t1 && top1 < t2) {
						row1.push($(this))
					}

					else if (top2 > t1 && top2 < t2) {
						row2.push($(this))
					}
				})

				let diff = row2.length - row1.length
				let n = Math.floor(diff / 2)

				if (n > 1) {
					$(`<div class='breaker'></div>`).insertAfter($(row2[row2.length - n]))
				}
			}
		}
	}
}

App.click_events = (parent) => {
	let element = App.elements[$(parent).data(`id`)]

	if (element.gone || element.frozen || element.deactivated) {
		return
	}

	let btn = $(parent).find(`.element_patent_btn`).get(0)

	if (btn.innerHTML === `Buy Patent`) {
		App.sold_on_tick = []
		let price

		if (element.profit <= 0) {
			price = Math.abs(element.profit)
		}

		else if (element.profit === 5000000) {
			let price = 50000000
			App.gained_from_lit -= price
		}
		else {
			price = element.profit * 5
		}

		App.points -= price
		App.report.push(-price)
		element.owned = true

		if (options.advanced) {
			if (element.soldonce && !element.lit) {
				element.frozen = true

				$($(`.element_container`).get(element.id)).removeClass(`green`)
				$($(`.element_container`).get(element.id)).removeClass(`red`)
				$($(`.element_container`).get(element.id)).addClass(`blue`)

				if (element.profit === 1000000) {
					element.freeze_chain += 1
				}
			}
		}

		$(btn).addClass(`btn_sell`)
		$(btn).html(`Sell Patent`)
	}

	else {
		let price

		if (element.profit <= 0) {
			price = 0
		}

		else if (element.profit === 5000000) {
			price = 25000000
			App.gained_from_lit += price
		}
		else {
			price = element.profit * (element.profit / 200000)
		}

		App.points += price
		App.report.push(price)
		element.owned = false

		$(btn).removeClass(`btn_sell`)
		$(btn).html(`Buy Patent`)

		if (options.advanced) {
			element.soldonce = true
			App.sold_on_tick.push(element)

			if (App.sold_on_tick.length > 3) {
				App.sold_on_tick.splice(0, 1)
			}

			if (App.sold_on_tick.length > 2) {
				if (App.sold_on_tick[0].profit === 5000000) {
					if (App.sold_on_tick[0].profit === App.sold_on_tick[1].profit && App.sold_on_tick[0].profit === App.sold_on_tick[2].profit) {
						let id1 = App.sold_on_tick[0].id
						let id2 = App.sold_on_tick[1].id
						let id3 = App.sold_on_tick[2].id

						if (id1 !== id2 && id1 !== id3 && id2 !== id3) {
							App.num_lit_trios += 1
							App.lit_trios_on_tick += 1

							App.sold_on_tick[0].bonus = App.lit_trios_on_tick
							App.sold_on_tick[1].bonus = App.lit_trios_on_tick
							App.sold_on_tick[2].bonus = App.lit_trios_on_tick

							App.sold_on_tick[0].deactivated = true
							App.sold_on_tick[1].deactivated = true
							App.sold_on_tick[2].deactivated = true

							$($($(`.element_container`).get(id1)).find(`.element_patent_btn`).get(0)).remove()
							$($($(`.element_container`).get(id2)).find(`.element_patent_btn`).get(0)).remove()
							$($($(`.element_container`).get(id3)).find(`.element_patent_btn`).get(0)).remove()

							$($(`.element_container`).get(id1)).addClass(`pulsetrio`)
							$($(`.element_container`).get(id2)).addClass(`pulsetrio`)
							$($(`.element_container`).get(id3)).addClass(`pulsetrio`)

							App.sold_on_tick = []
						}
					}
				}
			}
		}
	}

	update_points()

	if (options.hints) {
		check_all_hints()
	}
}

App.change_profit = (element) => {
	let change

	if (element.direction === `up`) {
		change = 200000
	}

	else {
		change = -200000
	}

	element.profit += change

	if (element.profit <= -1000000) {
		element.direction = `up`
		$($(`.element_container`).get(element.id)).find(`.element_direction`).get(0).innerHTML = `UP`
	}

	if (element.profit >= 1000000) {
		element.direction = `down`
		$($(`.element_container`).get(element.id)).find(`.element_direction`).get(0).innerHTML = `DOWN`
	}
}

App.format = (n) => {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`)
}

App.TickTimer = (callback, delay) => {
	let timer_id, start, remaining = delay

	this.pause = function() {
		clearTimeout(timer_id)
		remaining -= new Date() - start
		this.active = false
	}

	this.resume = function() {
		start = new Date()
		clearTimeout(timer_id)
		timer_id = setTimeout(callback, remaining)
		this.active = true
	}

	this.resume()
}

App.loop = () => {
	App.tick_timer = new TickTimer(() => {
		if (App.count > 0) {
			tick()
		}

		if (App.count > 0) {
			if (options.speed === `Linear`) {
				loop_speed = App.speed_slow - (App.linear_diff * (App.start_count - App.count))
			}

			loop()
		}
	}, loop_speed)
}

App.stop_loop = () => {
	App.count = 0

	if (App.tick_timer !== undefined) {
		App.tick_timer.pause()
	}
}

App.tick = () => {
	App.count -= 1

	if (App.points < 0) {
		subtract_count()
	}

	App.report.push(`;` + App.count + `;`)
	App.sold_on_tick = []
	App.lit_trios_on_tick = 0
	remove_pulsetrios()

	for (let i = 0; i < App.elements.length; i++) {
		let element = App.elements[i]

		if (element.gone) {
			continue
		}

		let cont = $(`.element_container`).get(i)

		if (element.lit) {
			gone(cont, element)
			continue
		}

		element.soldonce = false

		if (element.frozen) {
			element.frozen = false
			$(cont).removeClass(`blue`)

			if (element.freeze_chain === 3) {
				element.lit = true
				element.profit = 5000000
				App.num_lit += 1
				App.gained_from_lit += element.profit
			}
		}
		else {
			element.freeze_chain = 0
			change_profit(element)
		}

		$(cont).find(`.element_profit`).html(format(element.profit))

		if (element.lit) {
			$(cont).addClass(`yellow`)
			$(cont).find(`.element_direction`).get(0).innerHTML = `LIT`
		}
		else {
			if (element.profit > 0) {
				$(cont).removeClass(`red`)
				$(cont).addClass(`green`)
			}
			else {
				$(cont).removeClass(`green`)
				$(cont).addClass(`red`)
			}
		}

		if (element.owned) {
			App.points += element.profit
			App.report.push(element.profit)
		}
	}

	App.update_counter()
	update_points()

	if (options.hints) {
		check_all_hints()
	}

	check_state()
}

App.gone = (cont, element) => {
	$(cont).removeClass(`yellow`)
	$(cont).removeClass(`cursor_pointer`)
	$(cont).addClass(`cursor_default`)
	$(cont).addClass(`gone`)

	if (element.bonus > 0) {
		$(cont).html(`<div class='bonus'>` + element.bonus + `</div>`)
		App.bonus += element.bonus
	}

	else {
		$(cont).html(``)
	}

	element.lit = false

	if (element.deactivated) {
		element.deactivated = false
	}

	element.gone = true
}

App.make_all_gone = () => {
	for (let i = 0; i < App.elements.length; i++) {
		gone($(`.element_container`).get(i), App.elements[i])
	}
}

App.remove_pulsetrios = () => {
	$(`.pulsetrio`).each(() => {
		$(this).removeClass(`pulsetrio`)
	})
}

App.check_hint = (element) => {
	let cont = $(`.element_container`).get(element.id)
	$(cont).removeClass(`pulsating`)

	if (App.count > 1) {
		if (element.direction === `down` && element.owned) {
			$(cont).addClass(`pulsating`)
		}

		else if (element.profit === 0 && element.direction === `up` && !element.owned) {
			$(cont).addClass(`pulsating`)
		}

		else if (element.profit > 0 && element.profit < 1000000 && element.direction === `up` && !element.owned) {
			if (App.points >= element.profit * 5) {
				$(cont).addClass(`pulsating`)
			}
		}
	}

	else if (App.count === 1) {
		if (element.owned) {
			if (element.profit === -200000 && element.direction === `up`) {
				return
			}
			else if (element.profit === 0 && element.direction === `up`) {
				return
			}
			else if (element.profit === 200000 && element.direction === `up`) {
				return
			}

			$(cont).addClass(`pulsating`)
		}
		else {
			if (element.profit === 0 && element.direction === `up`) {
				$(cont).addClass(`pulsating`)
			}
		}
	}
}

App.check_all_hints = () => {
	for (let i = 0; i < App.elements.length; i++) {
		check_hint(App.elements[i])
	}
}

App.update_points = () => {
	let s = format(App.points)

	if ((App.bonus > 0) && (App.count > 0)) {
		s += ` (+` + App.bonus + `%)`
	}

	$(`#points`).html(s)
}

App.check_state = () => {
	if (App.count === 0) {
		ended()
	}

	else if ($(`.gone`).length === App.elements.length) {
		ended()
	}

	else {
		play(`pup`)
	}
}

App.show_instructions = () => {
	let s = `<b>Instructions</b><br><br>`
	s += `<img src='inst.gif?v=2' id='instgif'><br><br>`
	s += `The goal is to get as many points as you can.<br><br>`
	s += `Earn points by owning App.elements that have a positive profit.<br><br>`
	s += `You lose points when you own App.elements that have a negative profit.<br><br>`
	s += `You own an element by buying its patent.<br><br>`
	s += `Point earnings or losses of owned patents only occur after each tick.<br><br>`
	s += `The prices for each profit point are shown in the table below:<br><br>`
	s += `<table cellspacing=0><tr><th>Profit</th><th>Buy Price</th><th>Sell Price</th></tr><tr><td>1,000,000</td><td>5,000,000</td><td>5,000,000</td></tr><tr><td>800,000</td><td>4,000,000</td><td>3,200,000</td></tr><tr><td>600,000</td><td>3,000,000</td><td>1,800,000</td></tr><tr><td>400,000</td><td>2,000,000</td><td>800,000</td></tr><tr><td>200,000</td><td>1,000,000</td><td>200,000</td></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>-200,000</td><td>200,000</td><td>0</td></tr><tr><td>-400,000</td><td>400,000</td><td>0</td></tr><tr><td>-600,000</td><td>600,000</td><td>0</td></tr><tr><td>-800,000</td><td>800,000</td><td>0</td></tr><tr><td>-1,000,000</td><td>1,000,000</td><td>0</td></tr></table><br>`
	s += `Changes in profit are either +200,000 or -200,000 per tick.<br><br>`
	s += `The direction, UP or DOWN, shows if the profit is going to increase or decrease.<br><br>`
	s += `The direction changes when an element reaches 1,000,000 or -1,000,000 profit.<br><br>`
	s += `You can click any part of the tile to buy or sell, not just the button.<br><br>`
	s += `You can change the seed (#) to have predictable initial configurations.<br><br>`
	s += `You can change the speed of the game, which changes the interval between ticks.<br><br>`
	s += `Ticks happen every 5, 8 or 12 seconds depending on your speed setting.<br><br>`
	s += `Linear speed mode starts at 12 seconds and ends at 5 seconds.<br><br>`
	s += `If you end a tick with negative points, the tick counter is decreased by 2 instead of 1.<br><br>`
	s += `The game ends when the tick counter reaches 0.<br><br>`
	s += `<br><b>Core Mode</b><br><br>`
	s += `The point is to maximize your points by selling as much as you can while spending the least.<br><br>`
	s += `The ideal is to buy at 0 UP because it costs you 0 points and sell at 1 million DOWN. Earning you 8 million in total.<br><br>`
	s += `200,000 + 400,000 + 600,000 + 800,000 + 1,000,000 + 5,000,000.<br><br>`
	s += `You should sell anything going down because it will only lose value or get in the reds and start subtracting points.<br><br>`
	s += `As ticks are about to end, make sure you don't buy anything that won't earn you points, and sell what you need to sell at the last tick.<br><br>`
	s += `<br><b>Advanced Mode</b><br><br>`
	s += `Advanced mode adds new mechanics to the core game.<br><br>`
	s += `The point is to maximize your score, mainly by selling as many lit elements and lit trios as you can.<br><br>`
	s += `You achieve this by freezing elements.<br><br>`
	s += `Selling and buying an element in the same tick freezes it. Which makes it stay in the same state on the next tick.<br><br>`
	s += `Freezing a 1 million element 3 times in a row makes it lit.<br><br>`
	s += `When lit, its profit is 5 million, selling price is 25 million, and buying price is 50 million.<br><br>`
	s += `Elements that become lit are gone from the game after the next tick.<br><br>`
	s += `Lit elements sold in trios provide a bonus percentage on the overall score at the end.<br><br>`
	s += `The percentage given by each gone element is determined by its bonus stack.<br><br>`
	s += `For instance, the first trio sold gets 1%, the second trio sold in the same tick gets 2%.<br><br>`
	s += `Another way for the game to end is by making all elements gone.<br><br>`
	s += `A good strategy is using freeze to align 3 elements so they become lit at the same time, and sell them as a lit trio.<br><br>`
	s += `You can also try aligning multiple lit trios so you can increase the bonus stack.<br><br>`
	s += `<br><b>Shortcuts</b><br><br>`
	s += `You can start a game with Enter.<br><br>`
	s += `Escape closes windows or stops the current game if there are no windows.<br><br>`
	s += `Backspace opens or closes the menu.<br><br>`
	s += `Clicking on the tick counter, or pressing Space, pauses or resumes the game.<br><br>`
	s += `Clicking on \`Game Ended\` shows the game report.<br><br>`
	s += `Clicking on the game points shows the high scores.<br><br>`
	s += `Clicking on Core or Advanced at the top of High Scores toggles between Core High Scores and Advanced High Scores.<br><br>`
	s += `\`Right clicking\` on the title opens a context menu.<br><br>`
	s += `If there is overflow, you can use UpArrow or W to scroll to the top, and DownArrow or S to scroll to the bottom.<br><br>`

	msg(s)
}

App.get_options = () => {
	options = JSON.parse(localStorage.getItem(App.ls_options))

	if (options === null) {
		options = {fit: true, sounds: true, music: true, hints: false, advanced: true, seed: 1, speed: `Normal`}
		App.update_options()
	}

	App.change_seed(options.seed, false)
	change_speed(options.speed, false)
	change_mode(options.advanced, false)
}

App.App.update_options = () => {
	localStorage.setItem(App.ls_options, JSON.stringify(options))
}

App.show_options = () => {
	let s = `<b>Options</b><br><br>`
	s += `Automatically Fit Grid<br><br>`

	if (options.fit) {
		s += `<input id='chk_fit' type='checkbox' checked>`
	}

	else {
		s += `<input id='chk_fit' type='checkbox'>`
	}

	s += `<br><br><br>Enable Sounds<br><br>`

	if (options.sounds) {
		s += `<input id='chk_sounds' type='checkbox' checked>`
	}

	else {
		s += `<input id='chk_sounds' type='checkbox'>`
	}

	s += `<br><br><br>Enable Music<br><br>`

	if (options.music) {
		s += `<input id='chk_music' type='checkbox' checked>`
	}

	else {
		s += `<input id='chk_music' type='checkbox'>`
	}

	s += `<br><br><br>Enable Hints<br><br>`

	if (options.hints) {
		s += `<input id='chk_hints' type='checkbox' checked>`
	}

	else {
		s += `<input id='chk_hints' type='checkbox'>`
	}

	msg(s)

	$(`#chk_fit`).change(() => {
		options.fit = $(this).prop(`checked`)
		App.update_options()
		fit()
	})

	$(`#chk_sounds`).change(() => {
		options.sounds = $(this).prop(`checked`)
		App.update_options()

		if (!options.sounds) {
			stop_all_sounds()
		}
	})

	$(`#chk_music`).change(() => {
		options.music = $(this).prop(`checked`)
		App.update_options()

		if (!options.music) {
			mute_music()
		}
		else {
			unmute_music()
		}
	})

	$(`#chk_hints`).change(() => {
		options.hints = $(this).prop(`checked`)
		App.update_options()

		if (App.playing) {
			App.start()
		}
	})
}

App.App.show_about = () => {
	let s = `<b>About</b><br><br>`
	s += `Idea and development by madprops<br><br>`
	s += `Version ` + app_version + `<br><br>`
	s += `<a target='_blank' href='https://merkoba.com'>https://merkoba.com</a>`
	msg(s)
}

App.get_highscores = (advanced) => {
	if (advanced) {
		App.highscores = JSON.parse(localStorage.getItem(App.ls_highscores_advanced))
	}

	else {
		App.highscores = JSON.parse(localStorage.getItem(App.ls_highscores))
	}

	if (App.highscores === null) {
		App.highscores = {
			`Overall`:[[0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``]],
			`Overall - Slow`:[[0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``]],
			`Overall - Normal`:[[0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``]],
			`Overall - Fast`:[[0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``]],
			`Overall - Linear`:[[0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``], [0, ``]]
		}

		if (advanced) {
			localStorage.setItem(App.ls_highscores_advanced, JSON.stringify(App.highscores))
		}
		else {
			localStorage.setItem(App.ls_highscores, JSON.stringify(App.highscores))
		}
	}

	else {
		let keys = Object.keys(App.highscores)

		for (let i = 0; i < keys.length; i++) {
			if (keys[i].indexOf(`Overall`) !== -1) {
				continue
			}

			let sum = App.highscores[keys[i]].reduce((a, b) => a + b, 0)

			if (sum === 0) {
				delete App.highscores[keys[i]]
			}
		}
	}
}

App.get_setting_highscores = (setting, advanced) => {
	get_highscores(advanced)
	let scores = App.highscores[setting]

	if (scores === undefined) {
		App.highscores[setting] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		return App.highscores[setting]
	}

	else {
		return scores
	}
}

App.get_setting = () => {
	let s

	if (options.seed === -1) {
		s = `#`
	}

	else if (options.seed === 0.1) {
		s = `#NaN`
	}

	else {
		s = `#` + parseInt(options.seed)
	}

	s += ` - ` + options.speed
	return s
}

App.get_mode_text = () => {
	let m

	if (options.advanced) {
		m = `Adv`
	}

	else {
		m = `Core`
	}

	return m
}

App.get_full_setting = () => {
	return get_setting() + ` : ` + get_mode_text()
}

App.start_setting = (setting, advanced) => {
	let sd = setting.split(` - `)[0].replace(`#`, ``).trim()

	if (sd === ``) {
		App.change_seed(`-1`, false)
	}

	else if (sd === `NaN`) {
		App.change_seed(`0.1`, false)
	}

	else {
		App.change_seed(sd, false)
	}

	change_speed(setting.split(` - `)[1].trim(), false)
	change_mode(advanced, false)
	App.update_options()
	App.start()
}

App.show_highscores = (advanced) => {
	get_highscores(advanced)
	let s

	if (advanced) {
		s = `<div id='hs_type_toggle' class='hs_type unselectable'>Advanced</div>`
	}

	else {
		s = `<div id='hs_type_toggle' class='hs_type unselectable'>Core</div>`
	}

	s += `<b class='unselectable'>High Scores</b>`

	s += `<div class='hs_select unselectable'><select id='hs_setting_select'>`

	s += `<option value='Overall'>Overall</option>`
	s += `<option value='Overall - Slow'>Overall - Slow</option>`
	s += `<option value='Overall - Normal'>Overall - Normal</option>`
	s += `<option value='Overall - Fast'>Overall - Fast</option>`
	s += `<option value='Overall - Linear'>Overall - Linear</option>`

	let keys = Object.keys(App.highscores)
	let setting

	if (App.hs_setting === null) {
		setting = get_setting()
	}

	else {
		setting = App.hs_setting
	}

	if (keys.indexOf(setting) === -1) {
		keys.push(setting)
	}

	keys.sort()

	for (let i = 0; i < keys.length; i++) {
		let key = keys[i]

		if (key.indexOf(`Overall`) !== -1) {
			continue
		}

		s += `<option value='` + key + `'>` + key + `</option>`
	}

	s += `</select></div><div id='scores'></div>`
	msg(s)

	$(`#hs_type_toggle`).click(() => {
		if (advanced) {
			show_highscores(false)
		}
		else {
			show_highscores(true)
		}
	})

	$(`#msg`).find(`option`).each(() => {
		if ($(this).val() === setting) {
			$(this).prop(`selected`, true)
		}
	})

	show_scores($(`#hs_setting_select option:selected`).val(), advanced)

	if (advanced) {
		$(`#hs_setting_select`).change(() => {
			show_scores($(`#hs_setting_select option:selected`).val(), true)
		})
	}
	else {
		$(`#hs_setting_select`).change(() => {
			show_scores($(`#hs_setting_select option:selected`).val(), false)
		})
	}

}

App.show_scores = (setting, advanced) => {
	App.hs_setting = setting
	let scores = get_setting_highscores(setting, advanced)
	let s = ``

	if (setting.indexOf(`Overall`) !== -1) {
		for (let i = 0; i < scores.length; i++) {
			let hs = scores[i][0]
			let ss = scores[i][1]
			let t, p, m

			if (hs === 0) {
				s += `----`
			}

			else {
				s += `<span class='clickable_score' data-ss='` + ss + `'>`
				s += `<div class='setting_small'>` + ss + `</div>`

				if (App.last_highscore !== ``) {
					t = App.last_highscore.split(`=`)[0]
					p = App.last_highscore.split(`=`)[1]
					m = App.last_highscore.split(`=`)[2]
				}

				if (App.last_highscore !== `` && ((m === `Advanced` && advanced) || (m === `Core` && !advanced)) && ss == t && hs == p) {
					s += `<span class='grey_highlight'>` + format(hs) + `</span>`
				}

				else {
					s += `<span>` + format(hs) + `</span>`
				}

				s += `</span>`
			}

			if (i < scores.length - 1) {
				s += `<br><br>`
			}
		}

		s += `<br>`

		if (setting === `Overall`) {
			s += `<br><div id='hs_clear' class='linkydiv unselectable'>Clear High Scores</div>`
		}
	}

	else {
		for (let i = 0; i < scores.length; i++) {
			let hs = scores[i]
			let t, p, m

			if (hs === 0) {
				s += `----<br><br>`
			}
			else {
				if (App.last_highscore !== ``) {
					t = App.last_highscore.split(`=`)[0]
					p = App.last_highscore.split(`=`)[1]
					m = App.last_highscore.split(`=`)[2]
				}

				if (App.last_highscore !== `` && ((m === `Advanced` && advanced) || (m === `Core` && !advanced)) && setting == t && hs == p) {
					s += `<span class='grey_highlight'>` + format(hs) + `</span>`
				}
				else {
					s += `<span>` + format(hs) + `</span>`
				}

				s += `<br><br>`
			}
		}

		s += `<div id='hs_play_again' class='linkydiv unselectable'>Play Again</div>`
	}

	s += `<br><div id='hs_copy_hs' class='linkydiv'>Copy To Clipboard</div>`

	$(`#scores`).html(s)
	$(`#hs_setting_select`).val(setting)
	$(`#msg`).scrollTop(0)

	$(`.clickable_score`).click(() => {
		show_scores($(this).data(`ss`), advanced)
	})

	$(`#hs_clear`).click(() => {
		clear_highscores(advanced)
	})

	$(`#hs_play_again`).click(() => {
		start_setting(setting, advanced)
	})

	$(`#hs_copy_hs`).click(() => {
		copy_highscores(setting, advanced)
	})
}

App.copy_highscores = (setting, advanced) => {
	let scores = get_setting_highscores(setting, advanced)
	let s = setting

	if (advanced) {
		s += ` : Adv\n`
	}

	else {
		s += ` : Core\n`
	}

	if (setting.indexOf(`Overall`) !== -1) {
		for (let i = 0; i<scores.length; i++) {
			let hs = scores[i][0]
			let ss = scores[i][1]

			if (hs === 0) {
				s += `----`
			}

			else {
				s += format(hs) + ` (` + ss + `)`
			}

			s += `\n`
		}
	}

	else {
		for (let i = 0; i<scores.length; i++) {
			let hs = scores[i]

			if (hs === 0) {
				s += `----`
			}
			else {
				s += format(hs)
			}

			s += `\n`
		}
	}

	copy_to_clipboard(s)
}

App.App.show_report = () => {
	let s = `<b>Game Report</b><br>`
	s += `<div id='report_setting'>` + get_full_setting() + `</div>`
	let pts = App.start_points
	s += `<div class='grey_highlight'>` + App.start_count + ` (` + format(pts) + `)</div><br>`

	let cnt = App.start_count
	let total_tpts_positive = 0
	let total_tpts_negative = 0
	let tpts_positive = 0
	let tpts_negative = 0

	for (let i = 0; i < App.report.length; i++) {
		let item = App.report[i]

		if (typeof item === `string` && item.startsWith(`;`)) {
			cnt = item.replace(/;/g, ``)

			s += `<div>Positive: ` + format(tpts_positive) + `</div><br>`
			s += `<div>Negative: ` + format(tpts_negative) + `</div><br>`
			s += `<div>Balance: ` + format(tpts_positive + tpts_negative) + `</div><br>`
			s += `<div class='grey_highlight'>` + cnt + ` (` + format(pts) + `)</div><br>`

			tpts_positive = 0
			tpts_negative = 0
		}
		else {
			if (item !== 0) {
				pts += item

				if (item > 0) {
					s += `<div class='green_color'>` + format(item) + `</div><br>`
					tpts_positive += item
					total_tpts_positive += item
				}

				else {
					s += `<div class='red_color'>` + format(item) + `</div><br>`
					tpts_negative += item
					total_tpts_negative += item
				}
			}
		}
	}

	s += `<div>Positive: ` + format(tpts_positive) + `</div><br>`
	s += `<div>Negative: ` + format(tpts_negative) + `</div><br>`
	s += `<div>Balance: ` + format(tpts_positive + tpts_negative) + `</div><br>`

	s += `<div id='rep_copy' class='linkydiv'>Copy To Clipboard</div>`

	msg(s)

	s = `<br><div class='grey_highlight'>Overview</div><br>`

	if (options.advanced) {
		s += `<div>Elements Lit: ` + App.num_lit + `</div><br>`
		s += `<div>Lit Trios Sold: ` + App.num_lit_trios + `</div><br>`
		s += `<div>Lit Points: ` + format(App.gained_from_lit) + `</div><br>`
		s += `<div>Elements Gone: ` + $('.gone').length + `</div><br>`
	}

	s += `<div>Total Positive: ` + format(total_tpts_positive) + `</div><br>`
	s += `<div>Total Negative: ` + format(total_tpts_negative) + `</div><br>`

	if (options.advanced) {
		s += `<div>Balance: ` + format(total_tpts_positive + total_tpts_negative) + `</div><br>`
		s += `<div>Bonus: ` + App.bonus + `% (` + format(App.bonus_points) + `)</div><br>`
	}

	s += `<div>Final Balance: ` + format(points) + `</div><br>`
	s += `<div>Ticks Skipped: ` + App.ticks_skipped + `</div><br>`

	$(s).insertAfter($(`#report_setting`))

	$(`#rep_copy`).click(() => {
		copy_report()
	})
}

App.copy_report = () => {
	copy_to_clipboard(document.getElementById(`msg`).innerText.replace(`Game Report`, ``).replace(`Copy To Clipboard`, ``).replace(/\n\s*\n/g, `\n`).trim())
}

App.set_speed = () => {
	if (options.speed === `Slow` || options.speed === `Linear`) {
		loop_speed = App.speed_slow
	}

	else if (options.speed === `Normal`) {
		loop_speed = App.speed_normal
	}

	else if (options.speed === `Fast`) {
		loop_speed = App.speed_fast
	}
}

App.on_finish = () => {
	if (App.count > 0) {
		stop_loop()
	}

	App.playing = false
	start_music_fadeout()
	App.set_cursors_default()

	$(`#start`).html(`Play Again`)
}

App.ended = () => {
	on_finish()

	if (App.points > 0 && App.bonus > 0) {
		App.bonus_points = Math.round(App.points * (App.bonus / 100))
		App.points = App.points + App.bonus_points
		update_points()
	}

	$(`#title`).html(`Game Ended`)

	if (options.hints) {
		let s = `Time's up!<br><br>Score: ` + format(App.points) + `<br><br><br>`
		s += `<button id='end_play_again' class='dialog_btn'>Play Again</button>`
		s += `<span id='hint_dis'><br><br><button id='end_hint_dis' class='dialog_btn'>Disable Hints</button></span>`
		s += `<br><br><button id='end_rep' class='dialog_btn'>Game Report</button>`

		msg(s, true)
		msg_align_btns()
		play(`ended`)

		$(`#end_play_again`).click(() => {
			App.start()
		})

		$(`#end_hint_dis`).click(() => {
			disable_hints()
		})

		$(`#end_rep`).click(() => {
			App.show_report()
		})

		return
	}

	let shs = `<br><br><button id='end_show_hs' class='dialog_btn'>High Scores</button><br><br><button id='end_rep' class='dialog_btn'>Game Report</button>`
	let setting = get_setting()
	let hs = get_setting_highscores(setting, options.advanced)
	let overall = App.highscores.Overall
	let overall_speed = App.highscores[`Overall - ` + options.speed]

	if (!options.hints && App.points > hs[hs.length -1]) {
		if (App.points > hs[0]) {
			msg(`Time's up!<br><br>Score: ` + format(App.points) + `<br><br>New high score!<br><br><br><button id='end_play_again' class='dialog_btn'>Play Again</button>` + shs, true)
			msg_align_btns()
			play('highscore')

			hs.push(App.points)
			hs.sort(function(a, b){return b-a})
			hs.splice(10, hs.length)

			if (options.advanced) {
				localStorage.setItem(App.ls_highscores_advanced, JSON.stringify(App.highscores))
			}

			else {
				localStorage.setItem(App.ls_highscores, JSON.stringify(App.highscores))
			}
		}
		else {
			msg(`Time's up!<br><br>Score: ` + format(App.points) + `<br><br><br><button id='end_play_again' class='dialog_btn'>Play Again</button>` + shs, true)
			msg_align_btns()
			play(`ended`)

			if (hs.indexOf(App.points) === -1) {
				hs.push(App.points)
				hs.sort(function(a, b){return b-a})
				hs.splice(10, hs.length)

				if (options.advanced) {
					localStorage.setItem(App.ls_highscores_advanced, JSON.stringify(App.highscores))
				}

				else {
					localStorage.setItem(App.ls_highscores, JSON.stringify(App.highscores))
				}
			}
		}
	}

	else {
		msg(`Time's up!<br><br>Score: ` + format(App.points) + `<br><br><br><button id='end_play_again' class='dialog_btn'>Play Again</button>` + shs, true)
		msg_align_btns()
		play(`ended`)
	}

	$(`#end_play_again`).click(() => {
		App.start()
	})

	$(`#end_show_hs`).click(() => {
		show_highscores(options.advanced)
	})

	$(`#end_rep`).click(() => {
		App.show_report()
	})

	overall.sort(function(a, b) {
		let x=a[0]
		let y=b[0]
		return y-x
	})

	if (App.points > overall_speed[overall_speed.length -1][0]) {
		overall_speed.push([App.points, setting])

		overall_speed.sort(function(a, b) {
			let x = a[0]
			let y = b[0]

			return y - x
		})

		let counted = []
		let ncounted = []

		for (let i = 0; i<overall_speed.length; i++) {
			if (overall_speed[i][1] === `` || ncounted.indexOf(overall_speed[i][1]) === -1) {
				counted.push(overall_speed[i])
				ncounted.push(overall_speed[i][1])

				if (counted.length === 10) {
					break
				}
			}
		}

		App.highscores[`Overall - ` + options.speed] = counted

		if (options.advanced) {
			localStorage.setItem(App.ls_highscores_advanced, JSON.stringify(App.highscores))
		}
		else {
			localStorage.setItem(App.ls_highscores, JSON.stringify(App.highscores))
		}
	}

	if (App.points > overall[overall.length -1][0]) {
		overall.push([App.points, setting])

		overall.sort(function(a, b) {
			let x = a[0]
			let y = b[0]

			return y - x
		})

		let counted = []
		let ncounted = []

		for (let i = 0; i<overall.length; i++) {
			if (overall[i][1] === `` || ncounted.indexOf(overall[i][1]) === -1) {
				counted.push(overall[i])
				ncounted.push(overall[i][1])

				if (counted.length === 10) {
					break
				}
			}
		}

		App.highscores.Overall = counted

		if (options.advanced) {
			localStorage.setItem(App.ls_highscores_advanced, JSON.stringify(App.highscores))
		}
		else {
			localStorage.setItem(App.ls_highscores, JSON.stringify(App.highscores))
		}
	}

	App.last_highscore = setting + `=` + App.points

	if (options.advanced) {
		App.last_highscore += `=Advanced`
	}

	else {
		App.last_highscore += `=Core`
	}
}

App.overlay_clicked = () => {
	$(`#overlay`).click(() => {
		hide_overlay()
	})

	$(`#foverlay`).click(() => {
		hide_foverlay()
	})
}

App.hide_overlays = () => {
	hide_overlay(true)
	hide_foverlay()
}

App.hide_overlay = (force=false) => {
	if (App.msg_open && (App.msg_closeable || force)) {
		$(`#overlay`).css(`display`, `none`)
		$(`#msg`).css(`display`, `none`)
		$(`#msg`).html(``)
		App.msg_open = false
		App.msg_closeable = false
	}
}

App.msg = (txt, temp_disable=false) => {
	hide_foverlay()

	$(`#overlay`).css(`display`, `block`)
	$(`#msg`).html(txt)
	$(`#msg`).css(`display`, `block`)
	$(`#msg`).scrollTop(0)
	$(`#msg`).focus()

	if (temp_disable) {
		$(`.dialog_btn`).prop(`disabled`, true)
		App.msg_closeable = false

		setTimeout(() => {
			$(`.dialog_btn`).prop(`disabled`, false)
			App.msg_closeable = true

		}, 1000)
	}

	else {
		App.msg_closeable = true
	}

	App.hs_setting = null
	App.msg_open = true
}

App.msg_align_btns = (alt=false) => {
	if (alt) {
		$(`#msg`).find(`.dialog_btn`).each(() => {
			$(this).width($(this).outerWidth())
		})
	}

	else {
		let w = 0

		$(`#msg`).find(`.dialog_btn`).each(() => {
			w = Math.max(w, $(this).outerWidth())
		})

		$(`#msg`).find(`.dialog_btn`).each(() => {
			$(this).width(w)
		})
	}
}

App.hide_foverlay = () => {
	if (App.fmsg_open) {
		$(`#foverlay`).css(`display`, `none`)
		$(`#fmsg`).css(`display`, `none`)
		$(`#fmsg`).html(``)
		App.fmsg_open = false
		App.msg_closeable = false
		App.fmsg_mode = null
	}
}

App.fmsg = (txt, el) => {
	hide_overlay()

	if (el === App.fmsg_mode) {
		hide_foverlay()
		return false
	}

	$(`#fmsg`).css(`display`, `block`)
	$(`#fmsg`).css(`left`, `auto`)
	$(`#fmsg`).css(`right`, `auto`)
	$(`#fmsg`).html(txt)
	$(`#foverlay`).css(`display`, `block`)
	$(`#fmsg`).scrollTop(0)
	$(`#fmsg`).focus()

	App.fmsg_open = true
	App.fmsg_mode = el
	return true
}

App.fmsg_align_btns = (alt=false) => {
	if (alt) {
		$(`#fmsg`).find(`.dialog_btn`).each(() => {
			$(this).width($(this).outerWidth())
		})
	}

	else {
		let w = 0

		$(`#fmsg`).find(`.dialog_btn`).each(() => {
			w = Math.max(w, $(this).outerWidth())
		})

		$(`#fmsg`).find(`.dialog_btn`).each(() => {
			$(this).width(w)
		})
	}
}

App.position_fmsg = (el) => {
	$(`#fmsg`).css(`top`, $(`#title_container`).outerHeight() - 1)
	let left = $(`#` + el).offset().left - ($(`#fmsg`).outerWidth() / 2) + ($(`#` + el).width() / 2)

	if (left < 0) {
		left = 0
	}

	if ((left + $(`#fmsg`).outerWidth()) > document.documentElement.clientWidth) {
		$(`#fmsg`).css(`left`, `auto`)
		$(`#fmsg`).css(`right`, 0)
	}

	else {
		$(`#fmsg`).css(`left`, left)
	}
}

App.refresh = () => {
	document.location = document.location
}

App.play = (what) => {
	if (what === `music`) {
		if (options.music) {
			unmute_music()
		}
		else {
			mute_music()
		}

		$(`#music`)[0].pause()
		$(`#music`)[0].currentTime = 0
		$(`#music`)[0].play()

	}

	else if (options.sounds) {
		$(`#` + what)[0].pause()
		$(`#` + what)[0].currentTime = 0
		$(`#` + what)[0].play()
	}
}

App.music_control = () => {
	$(`#music`)[0].ontimeupdate = function() {
		if ((App.count > 0) && (this.currentTime > 73.2)) {
			this.currentTime = 4.5
		}
	}
}

App.App.pause_music = () => {
	$(`#music`)[0].pause()
}

App.unApp.pause_music = () => {
	$(`#music`)[0].play()
}

App.mute_music = () => {
	$(`#music`)[0].volume = 0
}

App.unmute_music = () => {
	$(`#music`)[0].volume = 1
}

App.start_music_fadeout = () => {
	if (App.music_fadeout_interval !== undefined) {
		clearInterval(App.music_fadeout_interval)
	}

	App.music_fadeout_interval = setInterval(music_fadeout, 100)
}

App.music_fadeout = () => {
	let new_volume = $(`#music`)[0].volume - 0.01

	if (new_volume >= 0) {
		$(`#music`)[0].volume = new_volume
	}

	else {
		if (App.music_fadeout_interval !== undefined) {
			clearInterval(App.music_fadeout_interval)
		}

		$(`#music`)[0].volume = 0
		$(`#music`)[0].pause()
		$(`#music`)[0].currentTIme = 0
	}

}

App.to_top = () => {
	$(`body`).scrollTop(0)
}

App.update_counter = () => {
	$(`#title`).html(App.count)
}

App.seed_picker = () => {
	let s = `0 to 999<br><br><input id='seed_input'><br><br>`
	s += `<button id='seed_check_seed' class='dialog_btn'>Ok</button>&nbsp&nbsp`
	s += `<button id='seed_random_seed' class='dialog_btn'>?</button><br><br>`
	s += `<button id='seed_daily' class='dialog_btn'>Daily</button><br><br>`
	s += `<button id='seed_random' class='dialog_btn'>Random</button>`

	if (fmsg(s, `seed`)) {
		fmsg_align_btns(true)
		let bw = ($(`#seed_random_seed`).offset().left + $(`#seed_random_seed`).outerWidth()) - $(`#seed_check_seed`).offset().left

		$(`#seed_input`).outerWidth(bw)
		$(`#seed_daily`).outerWidth(bw)
		$(`#seed_random`).outerWidth(bw)

		position_fmsg(`seed`)
	}

	$(`#seed_check_seed`).click(() => {
		check_seed()
	})

	$(`#seed_random_seed`).click(() => {
		get_random_seed()
	})

	$(`#seed_daily`).click(() => {
		daily()
	})

	$(`#seed_random`).click(() => {
		App.change_seed(-1)
	})

	$(`#seed_input`).attr(`type`, `number`)
	$(`#seed_input`).attr(`max`, 999)
	$(`#seed_input`).attr(`min`, 0)

	$(`#seed_input`).on(`input`, () => {
		if ($(this).val().length > 3) {
			$(this).val($(this).val().substring(0, 3))
		}
	})

	if (options.seed !== -1) {
		$(`#seed_input`).val(options.seed)
	}

	$(`#seed_input`).focus()
}

App.check_seed = () => {
	let input = $(`#seed_input`).val().trim()

	if (input == ``) {
		$(`#seed_input`).focus()
		return false
	}

	if (isNaN(input)) {
		$(`#seed_input`).focus()
		return false
	}

	else {
		if (input < 0 || input > 999) {
			$(`#seed_input`).focus()
			return false
		}
		else {
			App.change_seed(input)
		}
	}
}

App.App.change_seed = (s, save=true) => {
	let seed

	if (s == `0.1`) {
		seed = 0.1
	}

	else {
		seed = parseInt(s)

		if (isNaN(seed)) {
			$(`#seed_input`).focus()
			return false
		}
	}

	options.seed = seed

	if (options.seed === -1) {
		$(`#seed`).html(`#`)
	}

	else if (options.seed === 0.1) {
		$(`#seed`).html(`#NaN`)
	}

	else {
		$(`#seed`).html(`#` + options.seed)
	}

	if (save) {
		App.update_options()
	}

	hide_and_stop()
}

App.get_random_seed = () => {
	Math.seedrandom()
	let r = get_random_int(0, 999)

	if ($(`#seed_input`).val() == r) {
		r += 1

		if (r > 999) {
			r = 0
		}
	}

	$(`#seed_input`).val(r).focus()
}

App.get_daily = () => {
	let d = new Date()
	let s = d.getDate() + (d.getMonth() * 100) + d.getYear()
	Math.seedrandom(s)
	return get_random_int(0, 999)
}

App.daily = () => {
	App.change_seed(get_daily())
}

App.speed_picker = () => {
	let s = `<button id='speed_slow' class='dialog_btn'>Slow</button><br><br>`
	s += `<button id='speed_normal' class='dialog_btn'>Normal</button><br><br>`
	s += `<button id='speed_fast' class='dialog_btn'>Fast</button><br><br>`
	s += `<button id='speed_linear' class='dialog_btn'>Linear</button>`

	if (fmsg(s, `speed`)) {
		fmsg_align_btns()
		position_fmsg(`speed`)
	}

	$(`#speed_slow`).click(() => {
		change_speed(`Slow`)
	})

	$(`#speed_normal`).click(() => {
		change_speed(`Normal`)
	})

	$(`#speed_fast`).click(() => {
		change_speed(`Fast`)
	})

	$(`#speed_linear`).click(() => {
		change_speed(`Linear`)
	})
}

App.change_speed = (what, save=true) => {
	options.speed = what
	$(`#speed`).html(what)

	if (save) {
		App.update_options()
	}

	hide_and_stop()
}

App.mode_picker = () => {
	let s = `<button id='mode_core'class='dialog_btn'>Core</button><br><br>`
	s += `<button id='mode_advanced'class='dialog_btn'>Advanced</button>`

	if (fmsg(s, `mode`)) {
		fmsg_align_btns()
		position_fmsg(`mode`)
	}

	$(`#mode_core`).click(() => {
		change_mode(false)
	})

	$(`#mode_advanced`).click(() => {
		change_mode(true)
	})
}

App.change_mode = (advanced, save=true) => {
	options.advanced = advanced
	$(`#mode`).html(get_mode_text())

	if (save) {
		App.update_options()
	}

	hide_and_stop()
}

App.get_random_int = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

App.check_firstime = () => {
	if (localStorage.getItem(`firstime`) === null) {
		show_instructions()
		localStorage.setItem(`firstime`, `check`)
	}
}

App.key_detection = () => {
	$(document).keydown(function(e) {
		let code = e.keyCode

		if (!$(`input`).is(`:focus`)) {
			if (code === 8) {
				toggle_menu()
				e.preventDefault()
				return
			}
			else if (code === 13) {
				App.start()
				e.preventDefault()
				return
			}
			else if (code === 32) {
				App.toggle_pause()
				e.preventDefault()
				return
			}
		}
		else {
			if (code === 13) {
				if ($(`#seed_input`).is(`:focus`)) {
					check_seed()
					return
				}
			}
		}

		if (code === 27) {
			check_escape()
		}

		if (!msg_open && !App.fmsg_open) {
			if (code === 40 || code === 83) {
				$(`body`).scrollTop($(document).height() - $(window).height())
			}
			else if (code === 38 || code === 87) {
				$(`body`).scrollTop(0)
			}
		}
	})
}

App.stop = () => {
	App.playing = false
	clear_started()
	stop_loop()
	stop_all_audio()
	hide_overlays()
	$(`#main_container`).html(``)
	$(`#title`).html(App.main_title)
	$(`#points`).html(``)
	$(`#start`).html(`Start`)
	$(`body`).css(`background-image`, `url(splash.jpg)`)
}

App.stop_all_sounds = () => {
	$(`.sound`).each(() => {
		this.pause()
		this.currentTime = 0
	})
}

App.stop_the_music = () => {
	$(`#music`)[0].pause()
	$(`#music`)[0].currentTime = 0
}

App.stop_all_audio = () => {
	stop_all_sounds()
	stop_the_music()
}

App.show_menu = () => {
	let s = `<div id='msg_menu'></div>`
	s += `<button id='menu_instructions' class='dialog_btn'>Instructions</button><br><br>`
	s += `<button id='menu_highscores' class='dialog_btn'>High Scores</button><br><br>`
	s += `<button id='menu_options' class='dialog_btn'>Options</button><br><br>`
	s += `<button id='menu_about' class='dialog_btn'>About</button>`

	msg(s)
	msg_align_btns()

	$(`#menu_instructions`).click(() => {
		show_instructions()
	})

	$(`#menu_highscores`).click(() => {
		show_highscores(options.advanced)
	})

	$(`#menu_options`).click(() => {
		show_options()
	})

	$(`#menu_about`).click(() => {
		App.show_about()
	})
}

App.toggle_menu = () => {
	if ($(`#msg_menu`).length === 0) {
		show_menu()
	}

	else {
		hide_overlay()
	}
}

App.clear_highscores = (advanced) => {
	let conf

	if (advanced) {
		conf = confirm(`This will delete all your Advanced high scores. Are you sure?`)
	}

	else {
		conf = confirm(`This will delete all your Core high scores. Are you sure?`)
	}

	if (conf) {
		if (advanced) {
			localStorage.removeItem(App.ls_highscores_advanced)
		}
		else {
			localStorage.removeItem(App.ls_highscores)
		}

		show_highscores(advanced)
	}
}

var resize_timer = (() => {
	var timer

	return function() {
		clearTimeout(timer)
		timer = setTimeout(() => {
			fit()
		}, 350)
	}
})()

App.resize_events = () => {
	$(window).resize(() => {
		resize_timer()
	})
}

App.play_with_hints = () => {
	options.hints = true
	App.update_options()
	App.start()
}

App.disable_hints = () => {
	options.hints = false
	App.update_options()

	$(`#hint_dis`).remove()

	$(`.element_container`).each(() => {
		$(this).removeClass(`pulsating`)
	})
}

App.title_click = () => {
	if (App.playing && App.started) {
		App.toggle_pause()
	}

	else {
		if ($(`#title`).html() === App.main_title) {
			App.show_about()
		}

		else if ($(`#title`).html() === `Game Ended`) {
			App.show_report()
		}

		else if ($(`#title`).html() === (`Starting Game`)) {
			if (options.seed === 0.1) {
				App.change_seed(`-1`)
			}

			else {
				App.change_seed(`0.1`)
			}

			App.start()
		}
	}
}

App.App.toggle_pause = () => {
	if (App.tick_timer !== undefined && App.playing && App.started) {
		if (App.tick_timer.active) {
			App.tick_timer.pause()
			App.pause_music()
			App.paused = true
			$(`#title`).html(`Paused`)
			App.set_cursors_default()
		}
		else {
			App.tick_timer.resume()
			App.unApp.pause_music()
			App.update_counter()
			App.paused = false
			App.set_cursors_pointer()
		}
	}
}

App.set_cursors_pointer = () => {
	$(`.element_container`).each(() => {
		if (!$(this).hasClass(`gone`)) {
			$(this).removeClass(`cursor_default`).addClass(`cursor_pointer`)
		}
	})
}

App.App.set_cursors_default = () => {
	$(`.element_container`).each(() => {
		if (!$(this).hasClass(`gone`)) {
			$(this).removeClass(`cursor_pointer`).addClass(`cursor_default`)
		}
	})
}

App.succ = () => {
	console.log(`%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature, it is a scam and will give them access to your memes.`, `color: red; font-size: x-large`)
}

App.get_setting_title = () => {
	return `Elements (` + get_full_setting() + `)`
}

App.update_title = () => {
	document.title = get_setting_title()
}

App.disable_context_menus = () => {
	$(`#main_container`)[0].addEventListener(`contextmenu`, event => event.preventDefault())
	$(`#overlay`)[0].addEventListener(`contextmenu`, event => event.preventDefault())
	$(`#foverlay`)[0].addEventListener(`contextmenu`, event => event.preventDefault())
	$(`#left_side`)[0].addEventListener(`contextmenu`, event => event.preventDefault())
	$(`#title_container`)[0].addEventListener(`contextmenu`, event => event.preventDefault())
	$(`#right_side`)[0].addEventListener(`contextmenu`, event => event.preventDefault())
}

App.start_context_menus = () => {
	$.contextMenu(
	{
		selector: `#title`,
		items:
		{
			lsc1:
			{
				name: `Copy Setting To Clipboard`, callback: function(key, opt) {
					copy_setting()
				}
			}
		}
	})
}

App.copy_setting = () => {
	copy_to_clipboard(get_setting_title())
}

App.copy_to_clipboard = (s) => {
	let text_area_el = document.createElement(`textarea`)
	document.body.appendChild(text_area_el)
	text_area_el.value = s
	text_area_el.select()
	document.execCommand(`copy`)
	document.body.removeChild(text_area_el)
	play(`pup2`)
}

App.subtract_count = () => {
	App.count -= 1

	if (App.count < 0) {
		App.count = 0
	}

	else {
		App.ticks_skipped += 1
	}
}

App.left_side_clicks = () => {
	$(`#seed`).click(() => {
		App.seed_picker()
	})

	$(`#speed`).click(() => {
		App.speed_picker()
	})

	$(`#mode`).click(() => {
		App.mode_picker()
	})

	$(`#start`).click(() => {
		App.check_start()
	})
}

App.title_clicks = () => {
	$(`#title`).click(() => {
		App.title_click()
	})
}

App.right_side_clicks = () => {
	$(`#points`).click(() => {
		App.show_highscores(options.advanced)
	})

	$(`#menu`).click(() => {
		App.show_menu()
	})
}