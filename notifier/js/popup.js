/**
 * SF notifier
 * @author airyland <i@mao.li>
 */
!function() {
	var option = getOption(),
		cookie = getCookie(option),
		ul = document.querySelector('#msg-box'),
		noMessageBottom = '<li class="no-msg">暂无未读消息</li><li class="all"><a href="http://segmentfault.com/user/events" style="width: 100%; border-right: none">查看全部</a></li>',
		messageBottom = '<li class="all"><a class="view" href="http://segmentfault.com/user/events">查看全部</a><a class="ignore" href="http://segmentfault.com/user/events">忽略全部</a></li>',
		notsigninTip = '<li class="no-msg">还未登录哦</li><li class="all"><a href="http://segmentfault.com/user/login" style="width: 100%; border-right: none">果断去 登录~</a></li>';

	if(!cookie) {
		ul.innerHTML = notsigninTip;
		return;
	}

	var prefix = 'http://x.segmentfault.com/event/',
		end = '?sfsess=' + cookie + '&_=' + +new Date(),
		api = {
			dump: prefix + 'dump' + end,
			view: prefix + 'view' + end + '&id=',
			check: prefix + 'check' + end,
			viewAll: prefix + 'viewAll' + end
		},
		viewAllMessage = function() {
			simpleRequest(api.viewAll, function() {
				ul.innerHTML = noMessageBottom;
				setBadgeText('');
			});
		},
		dumpMessage = function() {
			simpleRequest(api.dump, function(data) {
				var html = '',
					data = JSON.parse(data.slice(6, -1)),
					count = data.data.count;
				if(count === 0) {
					ul.innerHTML = noMessageBottom;
					return;
				}
				for(var i = 0, len = count > 6 ? 6 : count; i < len; i++) {
					var notice = data['data']['event'][i];
					html += '<li class="msg" data-id="' + notice.id + '" data-url="' + notice.url + '">\
					<a href="#" title="忽略" class="i-cancel right">✕</a>\
					<span class="right">' + notice.createdDate + '</span>' + notice.sentence + '<cite>' + notice.title + '</cite>\
					</li>'
				}
				ul.innerHTML = html + messageBottom;
			}, function() {
				ul.innerHTML = notsigninTip;
			}, function() {
				ul.innerHTML = '抱歉，网络错误';
			});
		}

	dumpMessage();

	ul.addEventListener('click', function(e) {
		var target = e.target;
		if(target.tagName === 'LI') {
			simpleRequest(api.view + target.dataset.id, function(data) {
				target.parentNode.removeChild(target);
				//刷新计数数据
				var data = JSON.parse(data.slice(6, -1));
				var count = data.data;
				if(count === 0) {
					ul.innerHTML = noMessageBottom;
				} else {
					dumpMessage();
				}
				setBadgeText(data.data);
			});
			var url = target.dataset.url;
			chrome.tabs.create({
				url: url
			})
		} else if(target.tagName === 'A') {
			if(target.classList.contains('i-cancel')) {
				var parent = target.parentNode;
				id = parent.dataset.id;
				simpleRequest(api.view + id, function(data) {
					parent.parentNode.removeChild(parent);
					//刷新计数数据
					var data = JSON.parse(data.slice(6, -1));
					var count = data.data;
					if(count === 0) {
						ul.innerHTML = noMessageBottom;
					} else {
						dumpMessage();
					}
					setBadgeText(data.data);
				});
			} else if(target.classList.contains('ignore')) {
				viewAllMessage();
			} else {
				chrome.tabs.create({
					url: target.href
				});
			}
		} else {
			var parent = target.parentNode;
			var url = parent.dataset.url;
			chrome.tabs.create({
				url: url
			})
		}
	}, false);
}()