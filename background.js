// chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
//     if (details.type === 'xmlhttprequest') {
//         var exists = false;
//         for (var i = 0; i < details.requestHeaders.length; ++i) {
//             if (details.requestHeaders[i].name === 'Referer') {
//                 exists = true;
//                 details.requestHeaders[i].value = 'http://segmentfault.com/';
//                 break;
//             }
//         }

//         if (!exists) {
//          details.requestHeaders.push({ name: 'Referer', value: 'http://segmentfault.com/'});
//         }

//         return { requestHeaders: details.requestHeaders };
//     }
// }, {urls: ["http://segmentfault.com/api/user*"]}, ["blocking", "requestHeaders"])
// var getOption = function() {
//         return {
//             url: 'http://segmentfault.com',
//             name: 'sfsess'
//         }
//     },
//     simpleRequest = function(url, onsuccess, onnotsignin, onerror) {
//         var xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function() {
//             if(xhr.readyState == 4) {
//                 if(xhr.status == 200) {
//                     var data = xhr.responseText;
//                     //the server redirect to signin page when haven't signin
//                     if(data.indexOf('jsonp') !== 0) {
//                         (onnotsignin && typeof onnotsignin === 'function') && onnotsignin.call(null);
//                         return;
//                     }
//                     onsuccess.call(null, data);
//                 } else {
//                     if(onerror && (typeof onerror === 'function')) {
//                         onerror.call();
//                     }
//                 }
//             }
//         }
//         xhr.open('GET', url, true);
//         xhr.send(null);
//     },
//     setBadgeText = function(text) {
//         chrome.browserAction.setBadgeText({
//             text: text === '0' ? '' : text
//         });
//     },
//     getCookie = function(option) {
//         var sfsess = localStorage.getItem('sfsess');
//         if(sfsess) {
//             return sfsess;
//         } else {
//             chrome.cookies.get(option, function(cookie) {
//                 if(cookie) {
//                     sfsess = cookie.value;
//                     localStorage.setItem('sfsess', sfsess);
//                 } else {
//                     setBadgeText('x');
//                 }

//             })
//         }
//         return sfsess;
//     }

// var url = "http://segmentfault.com/api/user?do=stat";
// setInterval(function() {
// 	simpleRequest(url, function(data) {
// 		var data = JSON.parse(data).data;
// 		setBadgeText(data.events+'');
// 	}, function() {
// 		setBadgeText('x');
// 	})
// }, 10*1000);