$(document).on('keydown', '.pop-window', function(e) {
    if(e.keyCode == 13) $('.pop-window .action').click() && e.preventDefault();
});