chrome.storage.sync.get('cmtEnhanced', function(d) {
if(+d.cmtEnhanced) return false;
switch(location.pathname.split("/")[1] || "") {
	case "blog":
		var s = document.createElement("script")
		s.src = "//static.segmentfault.com/build/qa/js/question.js";
		document.body.appendChild(s);
	case "q":
		var cmt = document.createElement("script");
		cmt.innerHTML = 'var yan = '+JSON.stringify(yan)+';\r\n';
		cmt.innerHTML += '\
		window.onload = function() {\
		(function cmtEnhanced(widgets) {\
			var widgets = [].slice.call(widgets),\
				converter = require("pagedown_converter").Converter,\
				editor = new converter,\
				emojList = document.createElement("div");\
			\
		    emojList.className = "widget-comments-emoj-list display";\
		    yan.list.forEach(function(line) {\
		        line.yan.forEach(function(em,i) { emojList.innerHTML += "<span>"+em+"</span>" });\
		    });\
		    widgets.forEach(function(widget) {\
		        var preview = document.createElement("div"),\
		        	emoj = document.createElement("div"),\
		        	textarea = widget.querySelector("textarea"),\
		        	widgetEmojList = emojList.cloneNode(true);\
				\
		        preview.className = "col-md-12 widget-comments__preview";\
		        emoj.className = "col-md-2 widget-comments-emoj";\
		        emoj.innerHTML = ">ω<";\
				\
		        widget.appendChild(emoj);\
		        widget.appendChild(widgetEmojList);\
		        widget.appendChild(preview);\
		        widgetEmojList.addEventListener("click", function(e) {\
		        	if(e.target.tagName.toUpperCase() != "SPAN") return true;\
					textarea.value += e.target.innerHTML;\
					this.classList.toggle("display");\
					textarea.focus();\
		        });\
		        textarea.addEventListener("input", function(e) {\
		            preview.innerHTML = editor.makeHtml(this.value)\
		        });\
		        textarea.addEventListener("keydown", function(e) {\
		            if (e.ctrlKey && e.keyCode === 13) preview.innerHTML = ""\
		        });\
		        widget.querySelector("button").addEventListener("click", function() {\
		            preview.innerHTML = ""\
		        });\
				emoj.addEventListener("click", function() {\
					this.nextElementSibling.classList.toggle("display")\
				})\
		    })\
		})(document.querySelectorAll(".widget-comments__form"))\
		};';
		document.body.appendChild(cmt);	
	break;	
}
})