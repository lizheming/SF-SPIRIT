var option = getOption(),
	cookie = getCookie(),
	url = 'http://segmentfault.com',
	pull = function() {
		simpleRequest(url, function(data) {
			var h = document.createElement("html");
			h.outerHTML = data;
			setBageText(h.querySelector("title").match(/S/)[0]);
		}, function() {
			setBadgeText('x');
		});
	}

setInterval(pull, 10 * 1000);