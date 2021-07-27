$(document).ready ( function(){
    $.getScript('script.js', function()
    {
        // script is now loaded and executed.
        // put your dependent JS here.
        console.log('Loaded');
    });
});