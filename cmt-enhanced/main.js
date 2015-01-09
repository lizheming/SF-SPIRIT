switch(location.pathname.split("/")[1] || "") {
	case "blog":
		var s = document.createElement("script")
		s.src = "//static.segmentfault.com/build/qa/js/question.js";
		document.body.appendChild(s);
	case "q":
		var cmt = document.createElement("script");
		cmt.innerHTML += 'window.onload=function(){(function cmtEnhanced(widgets){var widgets=[].slice.call(widgets),converter=require("pagedown_converter").Converter;var editor=new converter;widgets.forEach(function(widget){var preview=document.createElement("div"),textarea=widget.querySelector("textarea");preview.className="col-md-12 widget-comments__preview";widget.appendChild(preview);textarea.addEventListener("input",function(e){preview.innerHTML=editor.makeHtml(this.value)},false);textarea.addEventListener("keydown",function(e){if(e.ctrlKey&&e.keyCode===13)preview.innerHTML=""},false);widget.querySelector("button").addEventListener("click",function(){preview.innerHTML=""})})})(document.querySelectorAll(".widget-comments__form"))};';
		document.body.appendChild(cmt);	
	break;	
}