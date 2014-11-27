chrome.storage.sync.get('hiddenNotifer', function(d) {
if(+d.hiddenNotifer) return false;

	document.querySelector(".widget-messages") && (function() {
		var s = document.createElement('style');
		s.innerHTML = ".widget-messages .badge{display:none!important}";
		document.body.appendChild(s);
	})()

});