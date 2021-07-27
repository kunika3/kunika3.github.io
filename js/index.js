$(document).ready ( function(){
    $.getScript('js/script1.js', function()
    {
        // script is now loaded and executed.
        // put your dependent JS here.
        console.log('Loaded');
    });
});