window.onload = function() {
    var form = document.forms[0];
    chrome.storage.sync.get("answerSearch", function(d) {
        if(d.hasOwnProperty('answerSearch')) 
            d.answerSearch == form.answerSearch[0].value ? form.answerSearch[0].checked = true : form.answerSearch[1].checked = true;
    })
    chrome.storage.sync.get("reputationChart", function(d) {
        if(d.hasOwnProperty("reputationChart"))
            d.reputationChart == form.reputationChart[0].value ? form.reputationChart[0].checked = true : form.reputationChart[1].checked = true;
    })
    chrome.storage.sync.get("cmtEnhanced", function(d) {
        if(d.hasOwnProperty("cmtEnhanced"))
            d.cmtEnhanced == form.cmtEnhanced[0].value ? form.cmtEnhanced[0].checked = true : form.cmtEnhanced[1].checked = true;
    })
    chrome.storage.sync.get("chatOnline", function(d) {
        if(d.hasOwnProperty("chatOnline"))
            d.chatOnline == form.chatOnline[0].value ? form.chatOnline[0].checked = true : form.chatOnline[1].checked = true;
    })
    chrome.storage.sync.get("msgbg", function(d) {
        if(d.hasOwnProperty('msgbg')) form.msgbg.value = d.msgbg;
    })
    chrome.storage.sync.get("sendkey", function(d) {
        if(d.hasOwnProperty('sendkey')) form.sendkey.value = d.sendkey;
    })
    chrome.storage.sync.get("aero", function(d) {
        if(d.hasOwnProperty("aero")) 
            d.aero == form.aero[0].value ? form.aero[0].checked = true : form.aero[1].checked = true;
    })
    chrome.storage.sync.get("opacity", function(d) {
        if(d.hasOwnProperty("opacity")) {
            form.opacity.value = d.opacity * 100;
            form.opacity.nextElementSibling.innerText = d.opacity;
        }
    })
    chrome.storage.sync.get("customCSS", function(d) {
        if(d.hasOwnProperty("customCSS")) {
            form['custom-css'].value = d.customCSS;
        }
    })
    chrome.storage.sync.get("customJS", function(d) {
        if(d.hasOwnProperty("customJS")) {
            form['custom-js'].value = d.customJS;
        }
    })
    form.onsubmit = function() {return false;}
    var inputs = document.querySelectorAll('.op');
    for(var i=0,l=inputs.length; i<l; i++) {
        inputs[i].addEventListener('change', function() {
            document.querySelector('button#save').click();
        })
    }
}
document.querySelector('input[name="opacity"]').addEventListener('input', function() {
    this.nextElementSibling.innerText = this.value / 100;
})
document.querySelector('button#save').onclick = function() {
    var form = document.forms[0];
    chrome.storage.sync.set({
        answerSearch: form.answerSearch[0].checked ? 0 : 1,
        chatOnline: form.chatOnline[0].checked ? 0 : 1,
        msgbg: form.msgbg.value,
        sendkey: form.sendkey.value,
        aero: form.aero[0].checked ? 0 : 1,
        opacity: form.opacity.value / 100,
        reputationChart: form.reputationChart[0].checked ? 0 : 1,
        cmtEnhanced: form.cmtEnhanced[0].checked ? 0 : 1,
        customCSS: form['custom-css'].value,
        customJS: form['custom-js'].value
    }, function() {
        document.querySelector('#message').innerHTML = "保存成功!";
        setTimeout(function(){document.querySelector('#message').innerHTML = ''}, 500);
    });
}
document.querySelector('button#reset').onclick = function() {
    chrome.storage.sync.clear(function() {});
    location.href = location.href;
}