define([
    'backbone', 'backbone.marionette', 'lodash',
    'view/orderConfirmation/confirmPickupOrderLayout', 'view/orderConfirmation/orderLocationView', 'model/locations/location',
    'view/orderConfirmation/buttonContainerView', 'utl/Communicator',
    'view/orderConfirmation/contactInfo', 'model/contactDetails/contactDetails',
    'serviceDelegate/OrderConfirmationService',
    'helper/errorMsges/mdl/BusinessError', 'parser/orderParser',
    'helper/userProfile/userProfileHelper', 'common/cartManager', 'view/orderConfirmation/orderConfirmStepIndicatorView',
    'view/orderConfirmation/orderPrintView', 'view/orderConfirmation/specialInstructionView'
  ],
  function(Backbone, Marionette, _,
    ReviewPickupOrderLayout, LocationView, LocationMdl,
    ButtonContainerView, Communicator,
    ContactDetailsView, ContactDetailsMdl,
    OrderConfirmationService,
    BusinessError, OrderParser,
    UserProfileHelper, CartManager, StepIndicatorView,
    OrderPrintView, SpecialInstructionView) {
    'use strict';
    var reviewOrderCntrl = Marionette.Controller.extend({
      loadOrderConfirmation: function() {

        var _this = this;
        var isRxRejected = false;
        var reviewOrderLayout, buttonContView, orderPrintView;
        var data = Communicator.cartCh.request('GET:ORDER'); //commmnd issued
        var orderConfirmationJSONData = OrderParser.parseJson(data);
        var _stepIndicatorView = new StepIndicatorView({});

        var orderConfirmationPromise = OrderConfirmationService.orderConfirmation({
          orderConfirmationJSON: orderConfirmationJSONData
        });

        orderConfirmationPromise.then(function(result) {
          if (result.error) {
            Communicator.globalCh.command("ERROR:SHOW",
              new BusinessError({
                messages: data.error,
                renderTo: "#placeOrder-page-err-msg"
              }));
          }
          var basicUser = UserProfileHelper.getBasicUser();
          var contactInfo = Communicator.cartCh.request('GET:CONTACT');
          var reviewOrderLayout = new ReviewPickupOrderLayout();

          CartManager.setCurrentLayout(reviewOrderLayout);
          CartManager.setCartPage('orderConfirmationPage');

          if (contactInfo) {
            contactInfo['email'] = basicUser.email;
          }
          var orderContent = Communicator.reviewOrderCh.request('GET:THANKYOU_CONTENT');
          if (data.pharmacyLocation) {
            reviewOrderLayout.deliveryMode = 'PICKUP';
          } else {
            reviewOrderLayout.deliveryMode = 'SHIP';
          }

          orderPrintView = new OrderPrintView();
          var specialInstrns = Communicator.reviewOrderCh.request('GET:SPECIAL_INSTRUCTIONS');
          buttonContView = new ButtonContainerView();

          // Bind event on render of page layout show views in mapped regions
          orderPrintView.on('show', function() {
            CartManager.setCurrentLayout(orderPrintView);
            CartManager.setCartPage('orderConfirmationPrintPage');
            (data.pharmacyLocation) ? orderPrintView.p_rxLocationRegion.show(getLocationView(data)): '';
            orderPrintView.p_contactInformationRegion.show(getContactDetailsView(contactInfo));
            var _cartView = CartManager.getCartView();
            orderPrintView.userListRegion.show(_cartView);
            orderPrintView.p_specialInstructionRegion.show(new SpecialInstructionView());
          });

          reviewOrderLayout.on('show', function() {
            if (isRxRejected) {
              reviewOrderLayout.isRejectedRx = true;
              Communicator.globalCh.command("ERROR:SHOW",
                new BusinessError({
                  messages: {
                    code: 'partialPlaceOrderMsg'
                  },
                  renderTo: "#shippablePlaceOrder-page-err-msg"
                }));

            }
            var _cartView = CartManager.getCartView();
            reviewOrderLayout.userListRegion.show(_cartView);
            _cartView.manageAddPrescriptionLink();
            (data.pharmacyLocation) ? reviewOrderLayout.rxLocationRegion.show(getLocationView(data)): '';
            reviewOrderLayout.step3Region.show(_stepIndicatorView);
            reviewOrderLayout.specialInstructionRegion.show(new SpecialInstructionView());
            reviewOrderLayout.buttonContainerRegion.show(buttonContView);
            reviewOrderLayout.contactInformationRegion.show(getContactDetailsView(contactInfo));
            reviewOrderLayout.printerRegion.show(orderPrintView);
            //
          });
          // Trigger's show event for loading layout on the page
          require('common/appManager').mainRegion.show(reviewOrderLayout);
          // Trigger's an async ajax call to load data to be displayed in the search result view
        }, function(error) {
          Communicator.globalCh.command('ERROR:SHOW', error);
        });
      },


    });

    var getContactDetailsView = function(contactInfo) {
      var contactDetailsView = new ContactDetailsView({
        model: new ContactDetailsMdl()
      });
      contactDetailsView.model.set(contactInfo);
      return contactDetailsView;
    }

    var getLocationView = function(data) {
      return new LocationView({
        model: new LocationMdl(data.pharmacyLocation)
      });
    }

    //
    return reviewOrderCntrl;
  });
