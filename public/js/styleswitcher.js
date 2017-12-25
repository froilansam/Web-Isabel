$(document).ready(function(){
    
  $('#panelHandle').click(function() {
    rightMargin = parseInt($(".sidePanel").css('left'));
    if(rightMargin < -1)
    {
       $(".sidePanel").animate({'left': '0px'});
       $(".pointer").remove();
    }
    else
    {
      $(".sidePanel").animate({'left': '-160px'});
    }
  });

 $('.color-changer a').on("click", function() {
    var color = $(this).attr('data-color');
    $('#theme').attr('href', 'css/themes/' + color + '.css');
  });
});



$(document).ready(function(){
    
  $('#panelHandle-right').click(function() {
    leftMargin = parseInt($(".sidePanel-right").css('right'));
    if(leftMargin < -1)
    {
       $(".sidePanel-right").animate({'right': '0px'});
       $(".pointer").remove();
    }
    else
    {
      $(".sidePanel-right").animate({'right': '-160px'});
    }
  });

 $('.color-changer a').on("click", function() {
    var color = $(this).attr('data-color');
    $('#theme').attr('href', 'css/themes/' + color + '.css');
  });
});