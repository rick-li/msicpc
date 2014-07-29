define(function(require, exports, module) {
  var menus = require('menus');
  $(document).ready(function() {

    menus.initialize();

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
    $(".homepage-slider").owlCarousel({
      slideSpeed: 500,
      paginationSpeed: 500,
      singleItem: true,
      pagination: false,
      // afterInit : progressBar,
      // afterMove : moved,
      startDragging: pauseOnDragging
    });

    // Custom Navigation Events
    $(".next-home").click(function() {
      $(".homepage-slider").trigger('owl.next');
      return false;
    });
    $(".prev-home").click(function() {
      $(".homepage-slider").trigger('owl.prev');
      return false;
    });

    $('.home-cate-tab').click(function() {
      var clickedTab = $(this);
      var tabContainer = clickedTab.closest('.home-cate-tab-wrap');
      var cntContainer = tabContainer.closest('.home-categories-container').find('.home-cate-content-wrap');
      tabContainer.find('.home-cate-tab').toggleClass('active');
      cntContainer.find('.home-cate-content').toggleClass('active');
    });

  });
});