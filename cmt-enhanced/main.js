chrome.storage.sync.get('cmtEnhanced', function(d) {
if(+d.cmtEnhanced) return false;
switch(location.pathname.split("/")[1] || "") {
	case "a":
		var s = document.createElement("script");
		s.src = "http://static.segmentfault.com/build/qa/js/question.js";
		s.async = true;
		document.body.appendChild(s);
	case "q":
		var cmt = document.createElement("script");
		cmt.innerHTML = 'var yan = '+JSON.stringify(yan)+';\r\n';
		cmt.innerHTML += '\
		window.onload = function() {\
		(function cmtEnhanced(widgets) {\
			var widgets = [].slice.call(widgets),\
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
		        emoj.className = "widget-comments-emoj";\
		        emoj.innerHTML = ">ω<";\
				\
		        widget.querySelector(".mt10").appendChild(emoj);\
		        widget.appendChild(widgetEmojList);\
		        widget.appendChild(preview);\
		        widgetEmojList.addEventListener("click", function(e) {\
		        	if(e.target.tagName.toUpperCase() != "SPAN") return true;\
					textarea.value += e.target.innerHTML;\
					this.classList.toggle("display");\
					textarea.focus();\
		        });\
		        textarea.addEventListener("input", function(e) {\
		        	var that = this;\
		        	require(["pagedown_converter"], function(Markdown) {\
						var editor = new Markdown.Converter;\
						preview.innerHTML = editor.makeHtml(that.value)\
		        	})\
		        });\
		        textarea.addEventListener("keydown", function(e) {\
		            if (e.ctrlKey && e.keyCode === 13) preview.innerHTML = ""\
		        });\
		        widget.querySelector("button").addEventListener("click", function() {\
		            preview.innerHTML = ""\
		        });\
				emoj.addEventListener("click", function() {\
					widgetEmojList.classList.toggle("display")\
				})\
		    })\
		})(document.querySelectorAll(".widget-comments__form"))\
		};';
		document.body.appendChild(cmt);	
	break;	
}
})