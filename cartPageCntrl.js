define([
    'view/cartPage/deliveryMethodView',
    'view/cartPage/cartLayout', 'backbone', 'backbone.marionette', 'utl/Communicator',
    'common/appManager', 'common/cartManager',
    'view/cartPage/authNoticeView', 'helper/errorMsges/mdl/BusinessError'
  ],
function(
    DeliveryMethodView,
    CartLayout, Backbone, Marionette, Communicator,
    AppManager, CartManager,
    AuthNoticeView, BusinessError
  ) {
'use strict';
      var _deliveryMethodView, _cartPageLayout;
      var _cartPageCh = Communicator.cartCh;
      var cartPageCntrl = Marionette.Controller.extend({
      init: function() {
          var _this = this;
          _cartPageLayout = new CartLayout();
          CartManager.setCurrentLayout(_cartPageLayout);
          CartManager.setCartPage('cartPage');
          _deliveryMethodView = new DeliveryMethodView();
          var _cartView = CartManager.getCartView();
          var _authNoticeView = new AuthNoticeView({
            model: new Backbone.Collection(CartManager.getRxsRequireAuthorization())
          });


      _cartPageLayout.on('show', function() {
      _cartPageLayout.viewAuthNoticeRegion.show(_authNoticeView);
      _cartPageLayout.userListRegion.show(_cartView);
      _cartPageLayout.deliveryMethodRegion.show(_deliveryMethodView);
      _cartPageLayout.manageAddPrescriptionLink(_cartView);
      });

      _cartPageCh.comply('removeRx:cartPage', function(rxKey) {
      var _currentLayout = CartManager.getCurrentLayout();
      var _cartViewPromise = CartManager.removeCartItems(rxKey);
      _authNoticeView = new AuthNoticeView({
      model: new Backbone.Collection(CartManager.getRxsRequireAuthorization())
      });
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

      _currentLayout.userListRegion.show(_cartView);
      _currentLayout.manageAddPrescriptionLink(_cartView);
      _currentLayout.viewAuthNoticeRegion.show(_authNoticeView);
      Communicator.cartCh.command('refresh:cartPage', true);
          });
        });

      _cartPageCh.comply('refresh:cartPage', function(rxKey) {
      _deliveryMethodView = new DeliveryMethodView();
          try {
            _cartPageLayout.deliveryMethodRegion.show(_deliveryMethodView);
          } catch (e) {}
        });
      require('common/appManager').mainRegion.show(_cartPageLayout);
        },
      });
      return cartPageCntrl;
      });
