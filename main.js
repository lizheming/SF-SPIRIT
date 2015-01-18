chrome.storage.sync.get(['customCSS', 'customJS'], function(d) {
	if(d.customCSS) {
		var css = document.createElement("style");
		css.innerHTML = d.customCSS;
		document.body.appendChild(css);
	}
	if(d.customJS) {
		var script = document.createElement("script");
		script.innerHTML = d.customJS;
		document.body.appendChild(script);
	}
});