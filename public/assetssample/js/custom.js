(function($) {
    'use strict';


    // VARS
    
    var $window = $(window);
    var windowSize = $window.width();
    var windowHeight = getViewPortHeight();
    var menuStyle = $('nav').attr('id');    
    var portfolioGrid = $('#portfolio-grid-container');    

    /*----------------------------------------------------*/
    /* MOBILE DETECT FUNCTIONS
    /*----------------------------------------------------*/
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);

        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $('.fullScreenBg').css({'width': windowSize + 'px'});
    $('.fullScreenBg').css({'height': windowHeight + 'px'});
        
    /* --------------------------------*/
    /* - Doc Ready
     /* -------------------------------*/

    $(document).ready(function() {

        $("section, div, figure").each(function(indx) {
            if ($(this).attr("data-background")) {
                $(this).css("background-image", "url(" + $(this).data("background") + ")");
            }
        });

        if(isMobile.any()){
            $('.ip-header').css({'width': windowSize + 'px'});
        }

        /*----------------------------------------------------*/
        /* MAGNIFIC POPUP LOAD CONTENT VIA AJAX
        /*----------------------------------------------------*/
          $('.html-popup').magnificPopup({type: 'inline'});
          
          

        /*----------------------------------------------------*/
        /* Initialize Animation
        /*----------------------------------------------------*/
        if ($("body").hasClass("appear-animate") && !isMobile.any()) {  
            
           initializeAnimation();            
        }        

        /*----------------------------------------------------*/
        /*  Progress Bar
         /*----------------------------------------------------*/
        $('.progress-bar').each(function() {

            var $this = $(this);
            $this.append($('<span class="skill-name">').html($this.data('name')));
            $this.append($('<span class="percentage">').html($this.data('width') + "%"));

        });

        $('.skill-bar li').each(function() {

            $(this).appear(function() {
                $(this).css({opacity: 1, left: "0px"});
                var b = $(this).find(".progress-bar").attr("data-width");
                $(this).find(".progress-bar").css({
                    width: b + "%"
                });
            });
        });

        /*----------------------------------------------------*/
        /*  Morphext
         /*----------------------------------------------------*/
        var animation = $("#js-rotating").data("animation");
        if (animation != null) {
            $("#js-rotating").Morphext({
                // The [in] animation type.                
                animation: animation,
                separator: ",",
                // The delay 
                speed: 2000
            });
        }


        /*----------------------------------------------------*/
        /*  PieChart
         /*----------------------------------------------------*/
        
        $(".chart").appear(function() {           
            $(".chart").easyPieChart({
                scaleColor: 'transparent',
                lineWidth: '5',
                trackColor: '#eeeeee',
                barColor: '#303030',
                animate: 2000,
                lineCap: 'square',
                size: 150            
            });
        });    


        /*----------------------------------------------------*/
        /*  Counter
         /*----------------------------------------------------*/
       
        $(".fact-number").appear(function() {
            $('.fact-number').each(function() {
                var data_from = $(this).data('from');
                var data_to = $(this).data('to');
                var data_speed = $(this).data('speed');
                var data_refresh_interval = $(this).data('refresh-interval');
                $(this).find('.factor').delay(3000).countTo({
                    from: (data_from == null) ? 0 : data_from,
                    to: (data_to == null) ? 200 : data_to,
                    speed: (data_speed == null) ? 3000 : data_speed,
                    refreshInterval: (data_refresh_interval == null) ? 10 : data_refresh_interval
                });
            });
        });
        


        /*----------------------------------------------------*/
        /*  Toggle Map
         /*----------------------------------------------------*/
        $('.radio').on ('click', function() {
            $(this).toggleClass('active');
            if ($('.radio').hasClass('active')) {

                $('.radio span').removeClass('fa-map-marker');
                $('.radio span').addClass('fa-times');
                $('.map-overlay').animate({
                    opacity: 0
                }, 300);
                $('#googleMap').css({
                    "z-index": 90
                }, 300);

            } else {

                $('.radio span').addClass('fa-map-marker');
                $('.radio span').removeClass('fa-times');
                $('.map-overlay').animate({
                    opacity: 1
                }, 300);
                $('#googleMap').css({
                    "z-index": -100
                }, 300);
            }
        });
       

        /*----------------------------------------------------*/
        /*  Slider
         /*----------------------------------------------------*/
        // Carousels
        if(isMobile.any() || windowSize < 767 ){
            $('#team-slider').removeClass('golo-carousel');
            $('.bgFixedSlider').removeClass('golo-carousel');
        }
        
        // Carousels
        $('.golo-carousel').each(function() {
            var carousel = $(this);
            carousel.owlCarousel({
                autoplay            : (carousel.data("autoplay") == null) ? false : carousel.data("autoplay"),
                autoplaySpeed       : (carousel.data("autoplayspeed") == null) ? false : carousel.data("autoplayspeed"),
                loop                : (carousel.data("loop") == null) ? true : carousel.data("loop"),
                items               : (carousel.data("items") == null) ? 1 : carousel.data("items"),             
                autoplayHoverPause  : (carousel.data("stoponhover") == null) ? false : carousel.data("stoponhover"),
                slideBy             : (carousel.data("slideby") == null) ? 1 : carousel.data("slideby"),
                nav                 : (carousel.data("nav") == null) ? false : carousel.data("nav"),
                navText             : [ '<span class="icon ion-chevron-left"></span>', '<span class="icon ion-chevron-right"></span>' ],
                navSpeed            : (carousel.data("navspeed") == null) ? false : carousel.data("navspeed"),
                dots                : (carousel.data("dots") == null) ? false : carousel.data("dots"),
                dotsSpeed           : (carousel.data("dotsspeed") == null) ? false : carousel.data("dotsspeed"),
                animateOut          : (carousel.data("animateout") == null) ? false : carousel.data("animateout"),
                animateIn           : (carousel.data("animatein") == null) ? false : carousel.data("animatein"),
                responsive: {
                    0: {
                        items: (carousel.data("items-mobile-portrait") == null) ? 1 : carousel.data("items-mobile-portrait")
                    },
                    480: {
                        items: (carousel.data("items-mobile-landscape") == null) ? 1 : carousel.data("items-mobile-landscape")
                    },
                    768: {
                        items: (carousel.data("items-tablet") == null) ? 1 : carousel.data("items-tablet")
                    },
                    960: {
                        items: (carousel.data("items") == null) ? 1 : carousel.data("items")
                    }
                }              
            });         
        });

        //Testimonial slider  
        var testimonialsWrap = $("#testimonialsWrap");
        var testimonialsClients = $("#testimonialsClients");

        testimonialsWrap.owlCarousel({
            autoplay :true,
            autoplaySpeed: 1000,
            items: 1,
            //loop:true,          
            nav: true,
            navText : [ '<span class="icon ion-chevron-left"></span>', '<span class="icon ion-chevron-right"></span>' ],
            dots: false,                       
        });

        testimonialsClients.owlCarousel({         
            items: 3,      
          //  loop:true,
            dots: false,
            responsiveRefreshRate: 100,
            responsive      : {
                    479: {
                        items   : 1
                    },
                    768: {
                         items  : 3
                    },
                    979: {
                        items   : 3
                    },
                    1199: {
                        items   : 3
                    }
            }          
        });
       
        testimonialsClients.on('initialized.owl.carousel', function (event) {
            testimonialsClients.find(".owl-item").eq(0).addClass("synced");
        });
      

        testimonialsWrap.on('changed.owl.carousel', function syncposition(event) {          
            var current = event.item.index;          
               
            $("#testimonialsClients")
                    .find(".owl-item")
                    .removeClass("synced")
                    .eq((current))
                    .addClass("synced");          
        })
       

        $("#testimonialsClients").on("click", ".item", function(e) {                     
          e.preventDefault();    
          testimonialsWrap.trigger('to.owl.carousel', [($(this).parents('.owl-item').index()), 300, true]);
        });
        //testimonial slider     


        /* ==============================================
         DIFF TYPES NAVIGATION 
         =============================================== */
        $('.navbar-toggle').on('click', function() {
            $(this).toggleClass('active');
        });

        if (menuStyle == 'nav-top') {
            
            var menuheight = (isMobile.any() || windowSize < 1299) ? 58 : 75;
            $('.nav li a, .navbar-brand, .move').on('click', function(event) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top - menuheight
                }, 1500, 'easeInOutExpo');
                event.preventDefault();
            });

            /* ==============================================
             CLOSE COLLAPSE NAV ON MOBILE DEVICES
             =============================================== */
            if (isMobile.any() || windowSize < 1299) {
                
                $('.nav li a, .navbar-brand').on('click', function() {
                    $(".navbar-collapse").collapse('hide');
                    $('.navbar-toggle').removeClass('active');
                });
            }
        }
        else if (menuStyle == 'nav-side') {
            
            //Sidebar open
            $('#menu-toggle').on('click', function(event) {
                $(this).toggleClass('active');
                $('#menu').toggleClass('open');
                $('#pageWrapper').toggleClass('menu-open');
            });

            //Sidebar Navigation
            $('#main-menu li a').on('click', function(event) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top + 1
                }, 1500, 'easeOutExpo');
                event.preventDefault();
                setTimeout(function(e) {
                    $('#menu-toggle').trigger('click');
                }, 1500);
                return false;
            });

            $('.move').on('click', function(event) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top + 1
                }, 2000, 'easeInOutExpo');
                event.preventDefault();
            });
        }
        else if (menuStyle == 'nav-icon') {
            
            $('#snav li a, .move').on('click', function(event) {
                
                    $('#snav li a.active').removeClass('active');
                    $(this).addClass('active');
            

                var $anchor = $(this);
                var menuheight = (isMobile.any() || windowSize < 1024) ? -65 : 1;
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top + menuheight
                }, 1500, 'easeInOutExpo');
                event.preventDefault();
            });

            if (windowSize < 1024) {
                $('#snav li a, .navbar-brand').on('click', function() {
                    $(".navbar-collapse").collapse('hide');
                    $('.navbar-toggle').removeClass('active');
                });
            }
        }

        /*----------------------------------------------------*/
        /*  Center Content for home
         /*----------------------------------------------------*/
        var contentHeight = $('.mainBanner-content').height();
        var topContentMargin = (windowHeight - contentHeight) / 2;
        $('.mainBanner-content').css({
            "margin-top": topContentMargin + "px"
        });
        
        /*----------------------------------------------------*/
        /*  Contact Form Ajax Submission
        /*----------------------------------------------------*/
        
        $('#contactform').on('submit', function(event) {

            $('.visible input-group').removeClass('has-error'); // remove the error class
            $('.help-block').remove(); // remove the error text
            //
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var formData = {
                'name': $('input[name=name]').val(),
                'email': $('input[name=email]').val(),
                'phone': $('input[name=phone]').val(),
                'comments': $('textarea[name=comments]').val()
            };

            // process the form
            $.ajax({
                type: 'POST',
                url: 'php/contact.php',
                data: formData,
                dataType: 'json',
                encode: true
            })
              
            // using the done promise callback
            .done(function(data) {

                // here we will handle errors and validation messages
                if (!data.success) {
                   // handle errors for name ---------------
                    if (data.errors.name) {
                        $('#name').parent().parent().addClass('has-error'); // add the error class to show red input
                        $('#name').parent().parent().append('<div class="help-block alert-danger">' + data.errors.name + '</div>'); // add the actual error message under our input
                    }
                    // handle errors for email ---------------
                    if (data.errors.email) {
                        $('#email').parent().parent().addClass('has-error'); // add the error class to show red input
                        $('#email').parent().parent().append('<div class="help-block alert-danger">' + data.errors.email + '</div>');
                    }
                    // handle errors for phone ---------------
                    if (data.errors.phone) {
                        $('#phone').parent().parent().addClass('has-error'); // add the error class to show red input
                        $('#phone').parent().parent().append('<div class="help-block alert-danger">' + data.errors.phone + '</div>');
                    }
                    // handle errors for comments ---------------
                    if (data.errors.comments) {
                        $('#comments').parent().parent().addClass('has-error'); // add the error class to show red input
                        $('#comments').parent().parent().append('<div class="help-block alert-danger">' + data.errors.comments + '</div>');
                    }
                    
                    if (data.errors.error) {
                        $('#contact-form').append('<div class="help-block alert-danger">' + data.errors.error + '</div>'); // add the actual error message                    
                    } 
                    
                }
                else {
                    // ALL GOOD! just show the success message!
                    $('#contact-form').append('<div class="alert alert-success pull-left">' + data.message + '</div>');                                  
                }
            })
            // using the fail promise callback
            .fail(function(data) {
                // show any errors
                // best to remove for production
            });
            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
        
        $('#home').css({'height': '100%'});           

      
      /*----------------------------------------------------*/
      /*  Background youtub video
      /*----------------------------------------------------*/ 

        if (!isMobile.any()) {
            $(".player").mb_YTPlayer();
        }
        
        /*----------------------------------------------------*/
      /*  for Service Hover effect on Windows mobile
      /*----------------------------------------------------*/ 
       if(isMobile.Windows()) {       
           
           $(".service-box-style").on('click', function() {                                                      
               
               if ($(this).find('.content-service').is(':visible')) {  
                    $(this).find('.content-service').css({display:'none'});
                    $(this).find('.content-hover').css({display:'block',bottom:'0',opacity:'1'});
               }
               else {
                    $(this).find('.content-service').css({display:'table-cell'});
                    $(this).find('.content-hover').css({display:'none',bottom:'0',opacity:'0'});
               }
                    
           });           
       }       

        
    }); // End doc ready
	
        

    /*----------------------------------------------------*/
    /*  One Page Portfolio Section
     /*----------------------------------------------------*/

    /*********************************
     init cubeportfolio
     *********************************/

    portfolioGrid.cubeportfolio({
        filters: '#filters-container',
        loadMore: '#loadMore-container',
        loadMoreAction: 'click',
        layoutMode: 'grid',
        rewindNav: true,
        scrollByPage: false,
        defaultFilter: '*',
        animationType: portfolioGrid.data('animationtype'),
        gapHorizontal: portfolioGrid.data('gaphorizontal'),
        gapVertical: portfolioGrid.data('gapvertical'),
        gridAdjustment: 'responsive',
        mediaQueries: [{
                width: 1100,
                cols: 3
            }, {
                width: 800,
                cols: 2
            }, {
                width: 500,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
        caption: portfolioGrid.data('caption'),
        displayType: 'lazyLoading',
        displayTypeSpeed: 100,
        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        // singlePage popup
        singlePageDelegate: '.cbp-singlePage',
        singlePageDeeplinking: true,
        singlePageStickyNavigation: true,
        singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
        singlePageCallback: function(url, element) {
            // to update singlePage content use the following method: this.updateSinglePage(yourContent)
            var t = this;

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                timeout: 10000
            })
                    .done(function(result) {
                        t.updateSinglePage(result);
                        if($('.cbp-popup-navigation-wrap').find('.cube-header-logo').length==0) {                        
                            $('.cbp-popup-navigation-wrap').prepend('<div class="cube-header-logo hidden-xs"> <img alt="logo" src='+portfolioGrid.data('logo')+' class="img-responsive"></div>');
                        }
                    })
                    .fail(function() {
                        t.updateSinglePage('AJAX Error! Please refresh the page!');
                    });
        },
    });

    /*********************************
     add listener for load more
     *********************************/
    $('.cbp-l-loadMore-button-link').on('click.cbp', function(e) {
        e.preventDefault();
        var clicks, me = $(this),
                oMsg;

        if (me.hasClass('cbp-l-loadMore-button-stop')) {
            return;
        }

        // get the number of times the loadMore link has been clicked
        clicks = $.data(this, 'numberOfClicks');
        clicks = (clicks) ? ++clicks : 1;
        $.data(this, 'numberOfClicks', clicks);

        // set loading status
        oMsg = me.text();
        me.text('LOADING...');

        // perform ajax request
        $.ajax({
            url: me.attr('href'),
            type: 'GET',
            dataType: 'HTML'
        }).done(function(result) {
            var items, itemsNext;

            // find current container
            items = $(result).filter(function() {
                return $(this).is('div' + '.cbp-loadMore-block' + clicks);
            });

            portfolioGrid.cubeportfolio('appendItems', items.html(),
                    function() {
                        // put the original message back
                        me.text(oMsg);

                        // check if we have more works
                        itemsNext = $(result).filter(function() {
                            return $(this).is('div' + '.cbp-loadMore-block' + (clicks + 1));
                        });

                        if (itemsNext.length === 0) {
                            me.text('NO MORE WORKS');
                            me.addClass('cbp-l-loadMore-button-stop');
                        }

                    });  
          
           
        }).fail(function() {
            // error
        });

    });



    /* --------------------------------*/
    /* - Window Load
     /* -------------------------------*/
    $window.load(function() {

        //CUSTOM TOOLBAR
       $(".content").mCustomScrollbar({
            theme: "dark-3",
            live: "on",
          });


        //Apply Margin
        backDivMargin();

        //Arrange Split Section
        arrangeSplitSection();

        //Box Item Auto height
        boxItemAutoHeight();

        arrangeResponsive();

        if (menuStyle == 'nav-top') {
            if ($(".navbar").offset().top > 200) {
                $(".navbar-fixed-top").addClass("top-nav-collapse");
            } else {
                $(".navbar-fixed-top").removeClass("top-nav-collapse");
            }
        }      
       

        /* --------------------------------*/
        /* - Initialize Map
         /* -------------------------------*/
        if (typeof (google) !== 'undefined')
            initializeMap();

        /* --------------------------------*/
        /* - Parallax Effect on other than mobile
         /* -------------------------------*/
        if (!isMobile.any() || windowSize < 500) {
            $('.parallax').each(function() {
                $(this).parallax("50%", 0.2);
            });
        }

		
		
    }); // End on window load

    /* --------------------------------*/
    /* - Window Resize
     /* -------------------------------*/
    $(window).resize(function() {
        windowSize = $window.width();
        windowHeight = getViewPortHeight();

        //Apply Margin
        backDivMargin();

        //Arrange Split Section
        arrangeSplitSection();

        //Box Item Auto height
        boxItemAutoHeight();

        arrangeResponsive();
        

        /* ==============================================
         DIFF TYPES NAVIGATION 
         =============================================== */
        if (menuStyle == 'nav-top') {
            
            var menuheight = (isMobile.any() || windowSize < 1299) ? 58 : 97;
            $('.nav li a, .navbar-brand, .move').on('click', function(event) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top - menuheight
                }, 1500, 'easeInOutExpo');
                event.preventDefault();
            });

            /* ==============================================
             CLOSE COLLAPSE NAV ON MOBILE DEVICES
             =============================================== */
            if (isMobile.any() || windowSize < 1299) {
                
                $('.nav li a, .navbar-brand').on('click', function() {
                    $(".navbar-collapse").collapse('hide');
                    $('.navbar-toggle').removeClass('active');
                });
            }
        }       
        else if (menuStyle == 'nav-icon') {          

            if (windowSize < 900) {
                $('#snav li a, .navbar-brand').on('click', function() {
                    $(".navbar-collapse").collapse('hide');
                    $('.navbar-toggle').removeClass('active');
                });
            }
        }
        
      $('#home').css({'height': windowHeight + 'px'});     

        
        

    }); // End on window resize


    /* --------------------------------*/
    /* - Window Scroll
     /* -------------------------------*/
    $window.scroll(function() {     

        if (menuStyle == 'nav-top') {
            if ($(".navbar").offset().top > 200) {
                $(".navbar-fixed-top").addClass("top-nav-collapse");
                $(".navbar-fixed-top").removeClass("default-nav");
            } else {
                $(".navbar-fixed-top").removeClass("top-nav-collapse");
            }
        }
        else if (menuStyle == 'nav-side') {

            if ($(document).scrollTop() >= $('#home').height()) {
                $('#menu-toggle').addClass('dark');
            } else {
                $('#menu-toggle').removeClass('dark');
            }
        }

        if (menuStyle != 'nav-top' && !isMobile.any()) {
            onepageScroller();
        }

    }); // End on window scroll

    /* --------------------------------*/
    /* - Define Functions
     /* -------------------------------*/

    function backDivMargin() {

        var backDivLeftWidth = $('.backDivLeft').outerWidth();
        var backDivRightWidth = $('.backDivRight').outerWidth();

        $('.backDivLeft').css({'margin-left': '-' + backDivLeftWidth / 2 + 'px'});
        $('.backDivRight').css({'margin-right': '-' + backDivRightWidth / 2 + 'px'});
    }

    function arrangeSplitSection() {

        if (windowSize <= 991) {
            $('.split').each(function() {
                var ssh_height = $(this).find('.split-section-headings').outerHeight();
                $(this).find('.split-section-content').css({'margin-top': ssh_height + 'px'});
                $(this).find('.space-cover').css({'height': ssh_height + 'px'});
            });
        }
        else {
            $('.split').each(function() {          
               $(this).find('.split-section-content').css({'margin-top': 0 + 'px'});              
               $(this).find('.space-cover').css({'height': 'auto'});
            });
        }
    }

    function boxItemAutoHeight() {

        var boxList_item = $(".boxItem");
        var boxList_max_height = 0;

        boxList_item.each(function(index) {
           // $(this).css("height", "auto");
            if ($(this).height() > boxList_max_height) {
                boxList_max_height = $(this).height();
            }
        });

        if (boxList_max_height > boxList_item.width() * 2) {
            boxList_item.height(boxList_max_height);
        }
        else {
            boxList_item.height(boxList_item.width() * 1);
        }

    }

    function arrangeResponsive() {

        var leftColHeight = $('.left-col').outerHeight();
        $('.right-col').css({'height': leftColHeight / 2 + 'px'});

        if ((windowSize > 991)) {
            $('.right-col').css({'margin-top': leftColHeight / 4 + 'px'});

        }

        if ((windowSize <= 991)) {
            $('.title-right').removeClass('trans-bdr-right').addClass('trans-bdr-center');
            $('.title-left').removeClass('trans-bdr-left').addClass('trans-bdr-center');
            $('.filters-2, .filters-3').addClass('cbp-l-filters-alignCenter');
            $('.filters-2, .filters-3').removeClass('cbp-l-filters-alignRight');
            $('.right-col').css({'margin-top': leftColHeight / 0 + 'px'});
           
        } else {
            $('.title-right').removeClass('trans-bdr-center').addClass('trans-bdr-right');
            $('.title-left').removeClass('trans-bdr-center').addClass('trans-bdr-left');
            $('.filters-2, .filters-3').removeClass('cbp-l-filters-alignCenter');
            $('.filters-2, .filters-3').addClass('cbp-l-filters-alignRight');


        }
    }
    
    function initializeAnimation() {    
    
        var animation = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset:50,
            mobile: false, 
            live: true 
        });
        
        animation.init();
    }    

    function onepageScroller() {       
        
        $('nav').find('li a').removeClass('active');
        $('nav').find('a[href="#' + onePageCurrentSection() + '"]').addClass('active');
    }

    function onePageCurrentSection() {
        
        var currentOnePageSection = 'home';

        $('section').each(function(index) {
            var h = $(this).offset().top;
            var y = $window.scrollTop();

            var offsetScroll = 100;

            if (y + offsetScroll >= h && y < h + $(this).height() && $(this).attr('id') != currentOnePageSection) {
                currentOnePageSection = $(this).attr('id');
            }
        });

        return currentOnePageSection;
    }
    
     function getViewPortHeight() {     
        
        //detech ios chrome
        if(navigator.userAgent.match('CriOS')) {
            return window.innerHeight;
        }
        
        return $window.height();
        
    }
    
    $.fn.parallax = function(xpos, speedFactor, outerHeight) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;
        //get the starting position of each element to have parallax applied to it	
        function update() {

            $this.each(function() {

                firstTop = $this.offset().top;
            });
            if (outerHeight) {
                getHeight = function(jqo) {
                    return jqo.outerHeight(true);
                };
            } else {
                getHeight = function(jqo) {
                    return jqo.height();
                };
            }

            // setup defaults if arguments aren't specified
            if (arguments.length < 1 || xpos === null)
                xpos = "50%";
            if (arguments.length < 2 || speedFactor === null)
                speedFactor = 0.5;
            if (arguments.length < 3 || outerHeight === null)
                outerHeight = true;
            // function to be called whenever the window is scrolled or resized

            var pos = $window.scrollTop();
            $this.each(function() {
                var $element = $(this);
                var top = $element.offset().top;
                var height = getHeight($element);
                // Check if totally above or totally below viewport
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }

                $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
            });
        }

        $window.on('scroll', update).resize(update);
        update();
    };

    function initializeMap() {
        var map_canvas = document.getElementById('googleMap');

        var map_options = {
            center: new google.maps.LatLng(38.8977332, -77.0365305),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            mapTypeControl: false,
            panControl: false,
            scaleControl: false,
            streetViewControl: false,
            zoomControl: false
        };

        var map = new google.maps.Map(map_canvas, map_options);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(38.8977332, -77.0365305),
            map: map,
            title: 'Hello World!'
        });
        var styles = [
            {
                "featureType": "landscape",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#282828"}
                ]
            }, {
                "featureType": "poi",
                "stylers": [
                    {"visibility": "off"}
                ]
            }, {
                "featureType": "road",
                "stylers": [
                    {"color": "#383838"}
                ]
            }, {
                "elementType": "geometry.stroke",
                "stylers": [
                    {"visibility": "off"}
                ]
            }, {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"weight": 8},
                    {"hue": "#ff0000"},
                    {"color": "#ffffff"}
                ]
            }, {
                "featureType": "landscape",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {"color": "#ffffff"},
                    {"visibility": "on"}
                ]
            }, {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {"visibility": "on"}
                ]
            }, {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "off"},
                    {"color": "#ffffff"}
                ]
            }, {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#ffffff"}
                ]
            }, {
                "featureType": "water",
                "stylers": [
                    {"color": "#004044"}
                ]
            }, {
            }
        ]
        map.setOptions({styles: styles});
    }
    
   



})(jQuery);