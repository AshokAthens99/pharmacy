define(['jquery', 'backbone', 'backbone.marionette', 'view/creditCard/creditCardLayout', 'view/creditCard/creditCardList',
    'model/creditCard/creditCard', 'rsvp','utl/Communicator','helper/errorMsges/mdl/BusinessError',
    'view/creditCard/ccStepIndicatorView', 'common/cartManager', 'view/creditCard/creditCardButtonView',
    'common/claimsManager', 'view/creditCard/creditCardEstimatedCostView'
  ],
  function($, Backbone, Marionette, CreditCardLayout, CreditCardListView,
    CreditCardMdl,RSVP, Communicator,BusinessError,
    CcStepIndicatorView, CartManager, ccButtonView,
    ClaimsManager, CreditCardEstimatedCostView) {
    'use strict';

    var creditCardCntrl = Marionette.Controller.extend({
      init: function() {
        var creditCardLayout, ccListView, _ccStepIndicator, _cartView, _ccButtonView, _ccEstimatedCostView;
        // Initialize Page Layout Template to organiza various region such as filter, search results, paginaton etc.
        creditCardLayout = new CreditCardLayout();
        var cardData = Communicator.cartCh.request('GET:CREDIT_CARD'),
          cardOnFile = Communicator.cartCh.request('GET:CARD_ON_FILE');
        CartManager.setCurrentLayout(creditCardLayout);
        CartManager.setCartPage('creditCardPage');
        var _cartPageCh = Communicator.cartCh;
        ccListView = new CreditCardListView({
          model: new Backbone.Model(cardData),
          isInterrupt: false
        });

        _ccStepIndicator = new CcStepIndicatorView({});
        _ccButtonView = new ccButtonView({});
        _ccEstimatedCostView = new CreditCardEstimatedCostView({});
        _cartView = CartManager.getCartView();

        // Bind event on render of page layout show views in mapped regions
        creditCardLayout.on('show', function() {
          creditCardLayout.ccListRegion.show(ccListView);
          creditCardLayout.ccSIRegion.show(_ccStepIndicator);
          creditCardLayout.ccUserListRegion.show(_cartView);
          if (ClaimsManager.getClaims() != undefined && ClaimsManager.ifTotalEstimate())
            creditCardLayout.ccEstimatedCost.show(_ccEstimatedCostView);
          creditCardLayout.ccButtonsRegion.show(_ccButtonView);
          _cartView.manageAddPrescriptionLink();

        });

        _cartPageCh.comply('removeRx:creditcartPage', function(rxKey) {
          var _currentLayout = CartManager.getCurrentLayout();
          var _cartViewPromise = CartManager.removeCartItems(rxKey);
          _ccEstimatedCostView = new CreditCardEstimatedCostView({});
          _cartViewPromise.then(function(_cartView) {
            if (_cartView.collection.length == 0) {
              var errorMsg = {
                description: "Your shopping cart is empty. Please use the \"Add another prescription\" link to return to the list.",
              };

              Communicator.globalCh.command("ERROR:SHOW",
                new BusinessError({
                  messages: errorMsg,
                  renderTo: "#placeOrder-page-err-msg"
                }));
            }

            _currentLayout.ccUserListRegion.show(_cartView);
            if (ClaimsManager.getClaims() != undefined && ClaimsManager.ifTotalEstimate())
              _currentLayout.ccEstimatedCost.show(_ccEstimatedCostView);
            _currentLayout.managePrescriptions();
            _cartView.manageAddPrescriptionLink();
            //  _currentLayout.viewAuthNoticeRegion.show(_authNoticeView);
            Communicator.cartCh.command('refresh:cartPage', true);
          });

        });

        Communicator.creditCardCh.comply('use:card', function() {
          Backbone.history.navigate('#showShippableOrder', {
            trigger: true,
            replace: false
          });
        });
        // Trigger's show event for loading layout on the page
        require('common/appManager').mainRegion.show(creditCardLayout);
        // Trigger's an async ajax call to load data to be displayed in the search result view

      }
    });
    //
    return creditCardCntrl;
  });
