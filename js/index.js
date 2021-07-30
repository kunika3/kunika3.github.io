

$(document).ready ( function(){

  $(".nav a").on("click", function() {
    $(".nav a").removeClass("active");
    $(this).addClass("active");

    $(".story").css({"display": "none"});

    i = $(this).attr("index");

    $(`#story${i}`).css({"display": "block"});

    $.getScript(`js/slide${i}.js`);
  });

  $("a:contains(US Covid Data)").click();

});