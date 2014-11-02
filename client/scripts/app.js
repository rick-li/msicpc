define(function(require, exports, module) {
  var item = require('item');
  var domReady = require('domReady');
  var enquire = require('enquire');
  module.exports = function() {
    domReady(function() {
       //select menu item
    $('.nav-item:contains('+currentPage+')').find('em').removeClass('unselected-item').addClass('selected-item')
    .parents('.navigation-item').find('.submenu-deploy em').removeClass('dropdown-item')
    .parent().next('.nav-submenu').show();


        $('.top-slider').owlCarousel({
          slideSpeed: 500,
          paginationSpeed: 500,
          singleItem: true,
          pagination: false,
          autoPlay: 5000,
          startDragging: function() {
            return false;
          }
        });
        // Custom Navigation Events
        $(".next-home").click(function() {
          console.log($(this));
          console.log($(this).closest(".homepage-slider"));
          $(this).closest(".slider-container").find(".homepage-slider").trigger('owl.next');
          return false;
        });
        $(".prev-home").click(function() {
          $(this).closest(".slider-container").find(".homepage-slider").trigger('owl.prev');
          return false;
        });
    enquire.register("screen and (max-width: 768px)", {
      match: function () {
          
        //mobile
         //carousel
        var owlQuoteControls = $(".quote-slider");
        owlQuoteControls.owlCarousel({
          //Basic Stuff
          items: 2,
          itemsDesktop: [1199, 4],
          itemsDesktopSmall: [980, 3],
          itemsTablet: [768, 3],
          itemsTabletSmall: [330, 1],
          itemsMobile: [320, 1],
          singleItem: false,
          itemsScaleUp: false,
          slideSpeed: 250,
          paginationSpeed: 250,
          rewindSpeed: 250,
          pagination: false,
          autoPlay: false,
          autoHeight: true,
        });


        // Custom Navigation Events
        $(".next-quote").click(function() {
          owlQuoteControls.trigger('owl.next');
          return false;
        });
        $(".prev-quote").click(function() {
          owlQuoteControls.trigger('owl.prev');
          return false;
        });



        var pauseOnDragging = function() {
          return false;
        };
        
        $('.homepage-slider:not(.top-slider)').owlCarousel({
          slideSpeed: 500,
          paginationSpeed: 500,
          singleItem: true,
          pagination: false,
          startDragging: pauseOnDragging
        });


            //init tabs
        $('.home-cate-tab-wrap div').click(function(e) {
          var homecateid = $(this).data('homecateid');
          console.log('homecateid, ', homecateid);
          var container = $('[data-homecateid='+homecateid+']').closest('.home-categories-container');
          container.find('[data-homecateid='+homecateid+']').addClass('active');
          container.find('[data-homecateid!='+homecateid+']').removeClass('active');
          e.stopPropagation();
          e.preventDefault();
          return false;
        });
      }

    });

    
    //drawer left
    var snapper = new Snap({
      element: document.getElementById('content'),
      touchToDrag: false
    });

    $('.deploy-sidebar').click(function() {
      //$(this).toggleClass('remove-sidebar');
      if (snapper.state().state == "left") {
        snapper.close();
      } else {
        snapper.open('left');
      }
      return false;
    });

    $('.shortcut-close').click(function() {
      snapper.close();
    });

    $('.submenu-deploy').click(function() {
      $(this).parent().find('.nav-submenu').toggle(100);
      $(this).parent().find('.sidebar-decoration').toggle(100);
      $(this).find('em').toggleClass('dropdown-item');
      return false;
    });

    $('.wide-image a').click(function() {
      $(this).parent().parent().find('.wide-active').toggle(100);
    });

    //init search
    $('.shortcut-search').click(function() {
      var q = $('.search-field').val();
      if(q){
        window.location = 'search?q='+q;
      }
    });


    });
   
  };
});