define(function(require, exports, module) {
  $(document).ready(function() {
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

    $('.submenu-deploy').click(function() {
      $(this).parent().find('.nav-submenu').toggle(100);
      $(this).parent().find('.sidebar-decoration').toggle(100);
      $(this).find('em').toggleClass('dropdown-item');
      return false;
    });

    $('.wide-image a').click(function() {
      $(this).parent().parent().find('.wide-active').toggle(100);
    });

    //init tabs
    $('.home-cate-tab-wrap div').click(function(e) {
      var homecateid = $(this).data('homecateid');
      console.log('homecateid, ', homecateid);
      $('.home-categories-container [data-homecateid='+homecateid+']').addClass('active');
      $('.home-categories-container [data-homecateid!='+homecateid+']').removeClass('active');

    });
    
  });
});