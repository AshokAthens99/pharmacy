define(['jquery', 'backbone', 'backbone.marionette', 'view/address/addressInput', 'view/address/addressLayout',
    'model/address/address', 'view/address/addressStepIndicatorView', 'view/address/addressList',
    'model/address/addressCollection', 'serviceDelegate/addressService', 'serviceDelegate/pharmacyDetailsService',
    'utl/Communicator', 'model/pharmacyDetails/pharmacyDetails', 'model/address/addressEnum', 'common/addressManager',
    'helper/errorMsges/mdl/BusinessError'
  ],
  function($, Backbone, Marionette, AddressInputVw, AddressLayout,
    AddressMdl, AddressStepIndicatorView, AddressListVw,
    Addresses, AddressService, PharmacyDetailsService,
    Communicator, PharmacyDetails, addressEnum, AddressManager, BusinessError) {
    'use strict';


    var addressCntrl = Marionette.Controller.extend({
      // Main function used to load the address page for add/edit/ list functionality
      showMain: function(viewName) {
        var addressData = Communicator.cartCh.request('GET:ADDR');
        var appLayout, addrInputView, addrListView, _addrStepIndicator, AddressCH = Communicator.addressCh;
        // Initialize Page Layout Template to organiza various region such as filter, search results, paginaton etc.
        appLayout = new AddressLayout();
        // Initialize Address input view for add/edit


        AddressManager.setPage('#addressPage');
        // Initialize Address List Grid
        addrListView = new AddressListVw({
          collection: new Addresses()
        });
        _addrStepIndicator = new AddressStepIndicatorView({});

        AddressCH.comply('add:address', function(model) {
          addrInputView = new AddressInputVw({
            model: new AddressMdl()
          });
          appLayout.addrInputRegion.show(addrInputView);
        });

        AddressCH.comply('edit:address', function(model) {
          addrInputView = new AddressInputVw({
            model: model
          });
          appLayout.addrInputRegion.show(addrInputView);

        });

        AddressCH.comply('save:address', function(model) {
          var page = AddressManager.getPage();
          var promise = AddressManager.saveAddress(model);

          promise.then(function(data) {
            if (data.error) {} else {
              Backbone.history.navigate(page, {
                trigger: true,
                replace: false
              });
            }
          });
        });

        AddressCH.comply('delete:address', function(model) {
          var promise = AddressManager.deleteAddress(model);
          promise.then(function(data) {
            if (data.error) {} else {
              Backbone.history.navigate('#addressPage', {
                trigger: true,
                replace: false
              });
            }
          });

        });

        AddressCH.comply('ship:address', function(ifPayment) {
          if (ifPayment) {
            Backbone.history.navigate('#paymentPage', {
              trigger: true,
              replace: true
            });
          } else {
            Backbone.history.navigate('#showShippableOrder', {
              trigger: true,
              replace: true
            });
          }
        });



        // Bind event on render of page layout show views in mapped regions
        appLayout.on('show', function() {
          appLayout.addrListRegion.show(addrListView);
          //appLayout.addrInputRegion.show(addrInputView);
          appLayout.addrSIRegion.show(_addrStepIndicator);
          //appLayout.addrInputRegion.$el.hide();
          if (addressData.length === 4) {
            appLayout.addrListRegion.$el.find(addAddress).hide();
          }
        });
        AddressManager.setAddressList(addressData);
        addrListView.collection.reset(addressData);
        // Trigger's show event for loading layout on the HTML page
        require('common/appManager').mainRegion.show(appLayout);
      }

    });
    return addressCntrl;
  });
