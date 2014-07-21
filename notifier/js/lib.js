var getOption = function() {
        return {
            url: 'http://segmentfault.com',
            name: 'sfsess'
        }
    },
    simpleRequest = function(url, onsuccess, onnotsignin, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    var data = xhr.responseText;
                    //the server redirect to signin page when haven't signin
                    if(data.indexOf('jsonp') !== 0) {
                        (onnotsignin && typeof onnotsignin === 'function') && onnotsignin.call(null);
                        return;
                    }
                    onsuccess.call(null, data);
                } else {
                    if(onerror && (typeof onerror === 'function')) {
                        onerror.call();
                    }
                }
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    },
    setBadgeText = function(text) {
        chrome.browserAction.setBadgeText({
            text: text === '0' ? '' : text
        });
    },
    getCookie = function(option) {
        var sfsess = localStorage.getItem('sfsess');
        if(sfsess) {
            return sfsess;
        } else {
            chrome.cookies.get(option, function(cookie) {
                if(cookie) {
                    sfsess = cookie.value;
                    localStorage.setItem('sfsess', sfsess);
                } else {
                    setBadgeText('x');
                }

            })
        }
        return sfsess;
    }