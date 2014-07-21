setBadgeText('...');

var option = getOption(),
	cookie = getCookie(),
	url = 'http://x.segmentfault.com/event/check?sfsess=' + cookie + '&_=' + +new Date(),
	pull = function() {
		simpleRequest(url, function(data) {
			var data = JSON.parse(data.slice(6, -1));
			setBadgeText(data.data + '')
		}, function() {
			setBadgeText('x');
		});
	}

setInterval(pull, 10 * 1000);