define(['backbone.marionette', 'jquery', 'cntrl/addressCntrl', 'cntrl/landingPageCntrl', 'cntrl/locationsPckrCntrl', 'cntrl/cartPageCntrl',
       'cntrl/reviewOrderCntrl', 'cntrl/notificationCntrl',
       'cntrl/creditCardCntrl', 'utl/Communicator', 'helper/errorMsges/mdl/BusinessError', 'cntrl/placeOrderCntrl','cntrl/searchByRxPageCntrl' ,
       'serviceDelegate/contentApi'],
  function (Marionette, $, AddressCntrl, LandingPageCntrl, LocationsPckrCntrl, CartPageCntrl,
     ReviewOrderCntrl, notificationCntrl,
    CreditCardCntrl, Communicator, BusinessError, PlaceOrderController,SearchByRxPageCntrl, ContentApi) {
    'use strict';
    var routeCntrl, cntrlMap = [];

    cntrlMap['AddressCntrl'] = new AddressCntrl();
    cntrlMap['LandingPageCntrl'] = new LandingPageCntrl();
    cntrlMap['LocationsPckrCntrl'] = new LocationsPckrCntrl();
    cntrlMap['CartPageCntrl'] = new CartPageCntrl();
    cntrlMap['ReviewOrderCntrl'] = new ReviewOrderCntrl();
    cntrlMap['notificationCntrl'] = new notificationCntrl();
    cntrlMap['CreditCardCntrl'] = new CreditCardCntrl();
    cntrlMap['PlaceOrderController'] = new PlaceOrderController();
    cntrlMap['SearchByRxPageCntrl'] = new SearchByRxPageCntrl();
    //
    routeCntrl = Marionette.Controller.extend({
      beforeLoad: function(pageId) {
        var $container = $(".kp-feature");
        $container.removeClass($container.attr('data-page-id'));
        $container.addClass(pageId);
        $container.attr('data-page-id', pageId);
      },
      showAddressPage: function () {
        this.beforeLoad("address-page");
        cntrlMap['AddressCntrl'].showMain();

      },
      showmap: function(){
          this.beforeLoad("location");
          cntrlMap['LocationsPckrCntrl'].showMap();
      },

      showLandingPage: function () {
         this.beforeLoad("landing-page");
         cntrlMap['LandingPageCntrl'].init();
      },
      showPrescriptions: function (viewName, previousPage) {
        this.beforeLoad("prescriptions");
        cntrlMap['LandingPageCntrl'].init();

      },
      showLocationsPckr: function () {
          this.beforeLoad("locations-picker");
          cntrlMap['LocationsPckrCntrl'].showCitiesScreen();
      },
      gotoCart: function (previousPage) {
        this.beforeLoad("cartPage");
        cntrlMap['CartPageCntrl'].init();
      },
      loadShippableOrder: function () {
        this.beforeLoad("shippable-order");
        cntrlMap['ReviewOrderCntrl'].showPickupOrder();
      },
      loadPickupOrder: function () {
        this.beforeLoad("pickup-order");
        cntrlMap['ReviewOrderCntrl'].showPickupOrder();
      },
      showNotification: function (mode) {
        this.beforeLoad("notification");
        cntrlMap['notificationCntrl'].showNotificationPage(mode);
      },
      showCreditCardInterrupt: function (previousPage) {
        this.beforeLoad("credit-card-interrupt");
        cntrlMap['CreditCardCntrl'].showCreditCardInterrupt(previousPage);
      },
      showAddressInterrupt: function () {
        this.beforeLoad("address-interrupt");
        cntrlMap['AddressCntrl'].showAddressInterrupt();
      },
      editCreditCardDetails: function (previousPage) {
        this.beforeLoad("credit-card-details");
        cntrlMap['CreditCardCntrl'].callMosForGettingCCInfo(previousPage);
      },
      searchByRxPage: function () {
        this.beforeLoad("searchByRx");
        cntrlMap['SearchByRxPageCntrl'].findRx();
      },
      showCreditCardPage: function () {
        this.beforeLoad("credit-card-details");
        cntrlMap['CreditCardCntrl'].init();
      },
      showErrorPage: function(type) {
        this.beforeLoad("error");
        var params = {};
        switch(parseInt(type)) {
            case 1:
                params = {code: 'mockTestMsg3' };
                break;
            case 2:
                params = {messages: [{code:"mockTestMsg1", message:"New Valdiation 1"},
                          {code:"mockTestMsg2", message:"New Valdiation 2", isContent:true}
                         ] };
                break;
            default:
                params = {code: 'mockTestMsg3' };
        }
        Communicator.globalCh.command("ERROR:SHOW", new BusinessError(params));
      },
      loadConfirmationPage: function () {
        this.beforeLoad("place-order-details");
        var params = {
          "contentType": "intro",
          "nodeType": "site_context",
          "assetType": "embedded_fragment",
          "region": "NCA",
          "nodeName": "WPP::KZ38APFTB"
        }
          cntrlMap['PlaceOrderController'].loadOrderConfirmation();
      }
    });
    //
    return routeCntrl;
  });
