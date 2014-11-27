function sfISO() {
	var SIZE = 15, MARGIN = 2, MAX_HEIGHT = 77;
	var COLORS = {
		gray: {r:243, g:243, b:243},
		green: {r:0, g:154, b:97},
		red: {r:175, g:57, b:51},
		bg: {r:255, g:255, b:255}
	}
	this.rep = document.querySelector(".rep-rects");
	this.stats = getStats(this.rep);
	function colorTransfer(c, o) {
		o = Number(o).toFixed(2)/1 || 1;
		return parseInt(['r', 'g', 'b'].map(function(t){
			return parseInt((1-o)*COLORS.bg[t] + o*COLORS[c][t]).toString(16)
		}).join(''), 16);
	}
	function getStats(rep) {
		var columns = Math.floor((rep.clientWidth-SIZE)/(SIZE+MARGIN));
		return [].slice.call(rep.querySelectorAll("li")).map(function(r,i){
			var color, value, date;
			if(r.classList.contains('bg-gray')) {
				color = colorTransfer('gray');
				value = 0;
				date = (r.getAttribute('title')||r.getAttribute('data-original-title')).match(/没有获得声望<br>(\d{4}-\d{2}-\d{2})/)[1];
			} else {
				color = colorTransfer([].slice.call(r.classList).filter(function(c){return c.match(/bg\-([green|red|gray]+)/)})[0].substr(3), r.style.opacity);
				var info = (r.getAttribute('title')||r.getAttribute('data-original-title')).match(/[+-](\d+?) 声望<br>(\d{4}-\d{2}-\d{2})/);
				value = info[1]/1;
				date = info[2];
			}
			return {
				x: i%columns,
				y: Math.floor(i/columns),
				color: color,
				value: value, 
				date: date
			}
		})
	}

	var MAX_REP = this.stats.reduce(function(a,b) {return a.value>b.value?a:b});
	sfISO.prototype.initUI = function() {
		var html = '<div class="profile-reputation"><strong>{{title}}</strong><canvas id="reputation-chart-3d"width="280"height="250"></canvas><div class="profile-top"><table><tbody><tr><td class="profile-title">过去72天</td></tr><tr><td class="profile-count">{{last_72_days_reputation}}</td></tr></tbody></table><table><tbody><tr><td class="profile-title">历史最高</td></tr><tr><td class="profile-count">{{highest_day_reputation}}</td></tr></tbody></table></div><span class="profile-footer"><a href="#"class="normal-chart-toggle">显示普通图表▾</a></span><div class="profile-bottom"><table><tbody><tr><td class="profile-title">过去7天</td></tr><tr><td class="profile-count">{{last_7_days_reputation}}</td></tr></tbody></table><table><tbody><tr><td class="profile-title">今日成就</td></tr><tr><td class="profile-count">{{today_reputation}}</td></tr></tbody></table></div></div><style type="text/css">strong{display:block}.profile-reputation{margin:-1px 0 0 0;padding:6px 0 6px 6px;border:1px solid rgb(221,221,221);border-top:none}.profile-top{position:absolute;top:90px;left:240px}.profile-title{font-size:11px;}.profile-count{font-size:26px;color:rgb(0,154,97);}.profile-meta{font-size:12px}.profile-unit{width:200px;display:block}.profile-bottom{position:absolute;top:230px;left:30px}.chart-display{display:none}.rep-rects{border-top:none;transition:1s all;}.normal-chart-toggle, .normal-chart-toggle:hover, .normal-chart-toggle:visited{color:rgb(153,153,153);font-size:12px}</style>';
		var title = '声望3D直方图';
		var lastTotalReputation = this.stats.reduce(function(a, b){return a+b.value}, 0);
		var lastTotalDay = this.stats[0].date+this.stats[this.stats.length-1].date;
		var lastSevenDay = this.stats.slice(-7);
		var lastSevenDayReputation = lastSevenDay.reduce(function(a, b){return a+b.value}, 0);
		var lastSevenDayDate = lastSevenDay[0].date+lastSevenDay[lastSevenDay.length-1].date;
		var data = {
			title: title,
			last_72_days_reputation: lastTotalReputation,
			last_72_days_date: lastTotalDay,
			last_7_days_reputation: lastSevenDayReputation,
			last_7_days_date: lastSevenDayDate,
			highest_day_reputation: MAX_REP.value,
			highest_day_date: MAX_REP.date,
			today_reputation: this.stats[this.stats.length-1].value,
			today_date: this.stats[this.stats.length-1].date
		}
		html = html.replace(/{{(.+?)}}/g, function(){
			return data.hasOwnProperty(arguments[1]) ? data[arguments[1]] : arguments[1];
		})
		this.rep.classList.toggle('chart-display');
		this.rep.outerHTML = html+this.rep.outerHTML;
		document.querySelector(".normal-chart-toggle").addEventListener("click", function(e){
			e.preventDefault();
			document.querySelector(".rep-rects").classList.toggle("chart-display");
			var show = "显示普通图表 ▾", hidden = "隐藏普通图表 ▴";
			this.innerHTML = this.innerHTML==show?hidden:show;
			return false;
		})
		return document.querySelector("#reputation-chart-3d");
	}
	sfISO.prototype.render = function() {
		var canvas = document.querySelector("reputation-chart-3d") || this.initUI();
		var pixelView = new obelisk.PixelView(canvas, new obelisk.Point(70, 80));
		this.stats.forEach(function(item) {
			var color = color = new obelisk.CubeColor().getByHorizontalColor(item.color),
				height = parseInt(MAX_HEIGHT * item.value / MAX_REP.value)+3;
			var p3d = new obelisk.Point3D(12*item.x, 12*item.y, 0);
			var dimension = new obelisk.CubeDimension(10, 10, height);
			var cube = new obelisk.Cube(dimension, color, false);
			return pixelView.renderObject(cube, p3d);
		});
	}
}

