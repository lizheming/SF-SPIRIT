chrome.storage.sync.get('pasteUpload', function(d) {
if(+d.pasteUpload) return false;

document.querySelector("#answerEditor") && document.querySelector("#answerEditor").addEventListener('paste', function(e) {
    e.preventDefault();
    var clipboard = e.clipboardData;
    for(var i=0,len=clipboard.items.length; i<len; i++) {
        if(clipboard.items[i].kind == 'file' || clipboard.items[i].type.indexOf('image') > -1) {
            //打开上传窗口
            document.querySelector("#wmd-image-button").click();
            //增加正在上传动画
            var uploadInput = document.querySelector("#fileName");
            uploadInput.classList.add("loading");
            uploadInput.value = "粘贴板图片上传";
            
            var imageFile = clipboard.items[i].getAsFile();
            var form = new FormData();
            form.append('image', imageFile);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    //获取图片地址
                    var o = JSON.parse(xhr.responseText.match(/\[.+?\]/)[0]);
                    if(o[0]) $(uploadInput).error(o.data);
                    else {
                        //关闭上传窗口
                        $(".modal-header button.close").last().click();
                        editorInsert("http://segmentfault.com"+o[1]);
                    }
                }
            }
            xhr.open("POST", "http://segmentfault.com/img/upload/image", true);
            xhr.send(form);
        }
    }
    function editorInsert(url) {
        var editor = document.querySelector("#answerEditor");
        var text = {
            before: editor.value.substring(0, editor.selectionStart),
            select: editor.value.substring(editor.selectionStart,editor.selectionEnd) || '请输入图片描述',
            after:editor.value.substr(editor.selectionEnd)
        };
        text.select = "!["+text.select+"]("+url+")";
        editor.value = text.before+text.select+text.after;
    }
})
});