define(['lodash', 'model/address/addressEnum', 'serviceDelegate/addressService', 'view/address/addressList', 'model/address/addressCollection',
  'utl/Communicator', 'rsvp', 'helper/errorMsges/mdl/BusinessError', 'common/rules/dataValidation', 'model/address/address',
], function(_, addressEnum, AddressService, AddressListVw, Addresses, Communicator, RSVP, BusinessError, DataValidation, AddressMdl) {
  'use strict';
  var instance = {};
  var addressObj;
  var addressList, address;
  var navigationPage;

  instance.getDefaultZip = function() {
    var zipCode = _.find(addressObj.address, function(address) {
      return address.label == "MAILING";
    }).zip5;


    if ( zipCode && zipCode.toString().length > 5 ) {
        zipCode = zipCode.toString().substr(0,5);
     }

    return (zipCode) ? zipCode : DataValidation.REGION_ZIPCODE[params.queryParam.region]
  };

  instance.setPage = function(page) {
    navigationPage = page;
  };

  instance.getPage = function() {
    return navigationPage ;
  };



  instance.setAddress = function(addressPromise) {
    addressObj = addressPromise;
  };

  function isAddressExistInList(addrList, newAddrObj) {

    var isAddressExist = false;

    _.each(addrList, function(addrObj) {

      var oldAddress = (addrObj.addressLine1.trim() +  addrObj.city.trim() + addrObj.state.trim() + addrObj.zip5.trim()).toUpperCase().replace(/[^A-Z0-9]/ig, "");
      var newAddress = (newAddrObj.addressLine1.trim() + newAddrObj.city.trim() + newAddrObj.state.trim() + newAddrObj.zip5.trim()).toUpperCase().replace(/[^A-Z0-9]/ig, "");

       if ( oldAddress === newAddress ){
         isAddressExist = true;
         return isAddressExist;
       }


    });

    return isAddressExist;

  };


  instance.saveAddress = function(addressMdl) {

    var isAddressExist = false;
    if ( addressMdl && addressMdl.attributes && addressMdl.attributes.isNew ) {
      isAddressExist = isAddressExistInList(this.getAddressList(), addressMdl.attributes);
    } else {
      var _this = this;
      var addrListWithoutEditedOne = _.filter(_this.getAddressList(), function(addrObj){ return addrObj.label != addressMdl.attributes.label; });
        isAddressExist = isAddressExistInList(addrListWithoutEditedOne, addressMdl.attributes);
    }
    var promise;

    if (!isAddressExist) {
      promise = AddressService.saveAddress(addressMdl.toJSON());
    } else {
      promise = new RSVP.Promise(function(resolve, reject) {
          var data = {"error":{"severity":"ERROR","type":"BUSINESS","code":2013,"description":"Address already exist."}};
          resolve(data);
      });
    }
      var _this = this;
      promise.then(function(data) {
        if (data.error) {
          Communicator.globalCh.command("ERROR:SHOW",
            new BusinessError({
              messages: data.error,
              renderTo: "#addrInput-page-err-msg"
            }));
              $('#addrInput-page-err-msg').addClass('kp-validation').show().attr('tabindex', -1).focus().css('outline', 'none');
        } else {
          Communicator.cartCh.command('SELECTED:ADDR', addressMdl.toJSON());
          _this.setAddressToNextLevel( addressMdl);
          Communicator.cartCh.command('SAVE:ADDR', data);

          var addrListView = new AddressListVw({
            collection: new Addresses()
          });

          var addressData = Communicator.cartCh.request('GET:ADDR');
          addrListView.collection.reset(addressData);
          $("#addr-addEdit").removeClass("modal-showing");
        }
      }, function(error) {
        Communicator.globalCh.command('ERROR:SHOW', error);
      });

    return promise;


  };

  instance.deleteAddress = function(addressMdl) {
    var promise = AddressService.deleteAddress(addressMdl.toJSON()); //ajax to dba
    promise.then(function(data) { //response came back

      if (data.error) {
        Communicator.globalCh.command("ERROR:SHOW",
          new BusinessError({
            messages: data.error,
            renderTo: "#addrInput-page-err-msg"
          }));
          $('#addrInput-page-err-msg').addClass('kp-validation').show().attr('tabindex', -1).focus().css('outline', 'none');
      } else {
        Communicator.cartCh.command('DEL:ADDR', {
          key: addressMdl.get('label')
        }); //speaking to communicator to save a copy of address
        var addressData = Communicator.cartCh.request('GET:ADDR');
        addrListView.collection.reset(addressData);
      }


    }, function(error) {
      Communicator.globalCh.command('ERROR:SHOW', error);
    });
    return promise;

  };


  instance.setAddressList = function(addList) {
    addressList = addList;
  };

  instance.getAddressList = function() {
    return addressList;
  }

  instance.fetchAddress = function(id) {
    return _.filter(addressList, function(z) {
      return z.pharmacyId == id;
    });
  }

  instance.setAddressToNextLevel = function(model) {
    address = model;
  };

  instance.getAddress = function() {
    return address;
  };

  return instance;
});
