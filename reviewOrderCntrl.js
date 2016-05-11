define([
    'backbone', 'backbone.marionette', 'lodash','utl/Communicator','common/cartManager','common/addressManager',
    'view/reviewOrder/reviewPickupOrderLayout',
    'view/locationsPckr/orderLocationView', 'model/locations/location',
    'view/reviewOrder/buttonContainerView',
    'view/contactDetails/orderContactDetails','model/contactDetails/contactDetails',
    'view/address/orderAddressView','model/address/address', 'view/address/addressInput','view/address/addressLayout',
    'view/notification/notificationOrderView', 'model/notification/notificationMdl',
    'view/reviewOrder/reviewStepIndicatorView', 'view/reviewOrder/reviewDeliveryIndicatorView',
    'view/cartPage/authNoticeView',
    'view/reviewOrder/reviewDeliveryIndicatorView','view/creditCard/orderCreditCard',
    'common/claimsManager', 'view/creditCard/creditCardEstimatedCostView'],
  function(Backbone, Marionette, _, Communicator, CartManager, AddressManager,
           ReviewPickupOrderLayout,
           LocationView, LocationMdl,
           ButtonContainerView,
           ContactDetailsView, ContactDetailsMdl,
           AddressView, AddressMdl, AddressInputVw,AddressLayout,
           NotificationOrderView, NotificationMdl,
           PickupStepIndicatorView, ReviewDeliveryIndicatorView,
           AuthNoticeView,
           DeliveryStepIndicatorView,CreditcartView,
           ClaimsManager, CreditCardEstimatedCostView) {
  'use strict';
    var reviewOrderCntrl = Marionette.Controller.extend({
        showPickupOrder: function() {
        var _this = this;
        var reviewOrderLayout, locationView, buttonContainerView, contactDetailsView, _pickupStepIndicatorView, _shipStepIndicatorView,
        _addressView, addrInputView, _paymentView, ccListView, notificationsView;
        var data = Communicator.cartCh.request('GET:ORDER');
        var contactInfo = Communicator.cartCh.request('GET:CONTACT');
        var notifications = Communicator.cartCh.request('GET:NOTIFY');
        var _reviewOrderCh = Communicator.reviewOrderCh;
        var flowType = CartManager.getFlowType();
        var _ccEstimatedCostView = new CreditCardEstimatedCostView({});
        var  appLayout = new AddressLayout();
             addrInputView = new AddressInputVw({});
             notificationsView = new NotificationOrderView({
                model : new NotificationMdl(notifications)
             });

        reviewOrderLayout = new ReviewPickupOrderLayout();
        _pickupStepIndicatorView = new PickupStepIndicatorView({});
        locationView = new LocationView({
            model: new LocationMdl(data.pharmacyLocation)
        });

        _shipStepIndicatorView = new ReviewDeliveryIndicatorView({});
        CartManager.setCurrentLayout(reviewOrderLayout);
        CartManager.setCartPage('reviewOrderPage');
        _addressView = new AddressView({});
		    buttonContainerView = new ButtonContainerView();
        contactDetailsView = new ContactDetailsView({
           model: new ContactDetailsMdl(data.contactInfo)
        });
        if(flowType === 'byMail') {
              var cardData = Communicator.cartCh.request('GET:CREDIT_CARD');
              ccListView = new CreditcartView({
                  model: new Backbone.Model(cardData),
                  isInterrupt: false
              });
              CartManager.setCurrentLayout(reviewOrderLayout);
              CartManager.setCartPage('shipReviewOrderPage');
        }
         if(flowType === 'pickup') {
             CartManager.setCurrentLayout(reviewOrderLayout);
              CartManager.setCartPage('pickupReviewOrderPage');
         }


        var _authNoticeView = new AuthNoticeView({
          model: new Backbone.Collection(CartManager.getRxsRequireAuthorization())
        });
        var _cartView = CartManager.getCartView();
        reviewOrderLayout.on('show', function() {
              if ( flowType === 'pickup' ) {
                  reviewOrderLayout.PindicatorRegion.show(_pickupStepIndicatorView);
                  reviewOrderLayout.rxLocationRegion.show(locationView);
              }
              if ( flowType === 'byMail' ) {
                  AddressManager.setPage('#showShippableOrder');
                  reviewOrderLayout.DindicatorRegion.show(_shipStepIndicatorView);
                  reviewOrderLayout.addressRegion.show(_addressView);
                  reviewOrderLayout.paymentRegion.show(ccListView);
                  reviewOrderLayout.notificationRegion.show(notificationsView);
                  if (ClaimsManager.getClaims() != undefined && ClaimsManager.ifTotalEstimate()){
                      reviewOrderLayout.ccEstimatedCost.show(_ccEstimatedCostView);
                  }
              }

              reviewOrderLayout.buttonContainerRegion.show(buttonContainerView);
              reviewOrderLayout.userListRegion.show(_cartView);
              reviewOrderLayout.viewAuthNoticeRegion.show(_authNoticeView);
              reviewOrderLayout.manageAddPrescriptionLink();
              reviewOrderLayout.contactInformationRegion.show(contactDetailsView);
              _cartView.manageAddPrescriptionLink();


        });

        _reviewOrderCh.comply('saveContactDetails:contactDetails', function(contactdetails) {
            contactDetailsView.model.set(contactdetails.toJSON());
            Communicator.cartCh.command('SAVE:CONTACT', contactdetails.toJSON());
        });
        Communicator.reviewOrderCh.comply('NAVIGATE_TO:EDIT:ADDRESS', function (model) {
          addrInputView = new AddressInputVw({
            model: model
          });
          reviewOrderLayout.orderaddrInputRegion.show(addrInputView);
        });
        Communicator.reviewOrderCh.comply('NAVIGATE_TO:CHOOSE:ADDRESS', function () {
            Backbone.history.navigate('#addressPage', {trigger: true,replace: false });
        });
        require('common/appManager').mainRegion.show(reviewOrderLayout);
      },

    });
    return reviewOrderCntrl;
  });
