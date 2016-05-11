define(['jquery', 'lodash', 'helper/content/contentHelper', 'helper/userProfile/userProfileHelper','utl/Communicator'],
function($, _, ContentHelper, UserProfileHelper,Communicator) {
  'use strict';
  var instance = {};
  var rxsCache, fullName;

  /**
   * @desc Called for fetching status description
   * @param rxs - key of the fetching status description
   * @return rxs - key of the fetching status description
   */

  instance.fetchStatusDescription = function(rxs) {

    if (rxs != null) {
      var statusCodes = [];
      if (rxs && !_.isArray(rxs)) {
        rxs = [rxs];
      }
      // collect list of status code
      _.each(rxs, function(rx) {
        if (!_.isNull(rx.statusCodes) && !_.isUndefined(rx.statusCodes)) {
          statusCodes.push(
            rx.statusCodes.rxDetailResponseCode
          );
        }
      });

      // find unique list of status codes
      var uniqStatusCodes = _.uniq(statusCodes);
      if (!_.isNull(uniqStatusCodes) && !_.isUndefined(uniqStatusCodes)) {
        // fetch from content now
        var results = ContentHelper.getContentByNodeNames(uniqStatusCodes);
        // update each prescription with the status description
        _.each(rxs, function(rx) {
          if (!_.isNull(rx.statusCodes) && !_.isUndefined(rx.statusCodes)) {
            var statusDescription = results[rx.statusCodes.rxDetailResponseCode];
            // extend the object with the status description
            _.extend(rx.statusCodes, {
              statusDescription: statusDescription
            });
          }
        });
      }
    }
    return rxs;
  };

  /**
   * @desc Called for getting name for user
   * @param relId - key for getting the name of the user
   * @return proxyName
   */

  instance.getNameForUser = function(relId) {
    var proxyName;
    if (relId && !_.isEmpty(relId)) {
      var proxyUsers = UserProfileHelper.getProxies();
      if (proxyUsers) {
        _.each(proxyUsers, function(proxy) {
          if (relId === proxy.relationshipID) {
            proxyName = proxy.name;
            return proxyName;
          }
        });
        return _getName(proxyName);
      }
    } else {
      var subjUser = UserProfileHelper.getBasicUser();
      var name = {
        firstName: subjUser.firstName,
        lastName: subjUser.lastName
      };
      return name;
    }
  };

  instance.getSelectedFullName = function(relId) {
  var proxyName;
  if (relId && !_.isEmpty(relId)) {
    var proxyUsers = UserProfileHelper.getProxies();
    if (proxyUsers) {
      _.each(proxyUsers, function(proxy) {
        if (relId === proxy.relationshipID) {
          proxyName = proxy.name;
          return proxyName;
        }
      });
      return proxyName;
    }
  } else {
    var subjUser = UserProfileHelper.getBasicUser();
    return subjUser.firstName+" "+subjUser.lastName;
  }
};


  /**
   * @desc Gets the cache rxs
   * @param No input params required
   * @return returns the rxs Cache
   */

  instance.getCacheRxs = function() {
    return rxsCache;

  };
  /**
   * @desc Sets the cache rxs
   * @param No input params required
   * @return returns rxs
   */

  instance.setCacheRxs = function(rxs) {
    rxsCache = rxs;
  };

  /**
   * @desc Gets the full name
   * @param No input params required
   * @return returns the full name
   */

  instance.getFullName = function() {
    return fullName;
  };

  /**
   * @desc Sets the full name
   * @param name:full name
   * @return returns the full name
   */

  instance.setFullName = function(name) {
    fullName = name;
  };

  /**
   * @desc Sets the full name
   * @param name:full name
   * @return returns the full name
   */

  instance.checkAccess = function(relId) {
    var isRxBtnPrivileged = false;
    if (relId && !_.isEmpty(relId)) {
        isRxBtnPrivileged = UserProfileHelper.hasEntitlement({
            code: 214,
            relId: relId
        });
    } else {
        isRxBtnPrivileged = UserProfileHelper.hasEntitlement({
            code: 214
        });
    }
    return isRxBtnPrivileged;
  };

  instance.buildRxData = function(rxKey,relId,_rxObj,firstNameCaseConversion,lastNameCaseConversion){
    var rxData = {
        prescriptionNumber  : rxKey,
        usrId               : relId,
        firstName           : firstNameCaseConversion,
        lastName            : lastNameCaseConversion,
        prescriptionName    : _rxObj.prescriptionName,
        lastRefillDate      : _rxObj.lastRefillDate,
        quantity            : _rxObj.pharmacyInfo.quantity,
        nhinId              : _rxObj.pharmacyInfo.nhinId,
        amount              : parseFloat(_rxObj.pharmacyInfo.coPayAmount),
        mailable            : _rxObj.pharmacyInfo.mailable,
        statusCodes         : _rxObj.statusCodes, //statusCode,
        pharmacyInfo        : _rxObj.pharmacyInfo,
        pickUpInstruction   : _rxObj.pickUpInstruction,
        source              : 'EPIC',
        isMember            : UserProfileHelper.isMember(),
        consumerResponseCode: _rxObj.consumerResponseCode,
        dispenseLocationCode: _rxObj.pharmacyInfo.dispenseLocationCode,
        firstFill           : _rxObj.firstFill,
    };


    return rxData;
  };

  instance.updateRxObjects = function(rxs){

    _.each(rxs.detail, function(rx) {
        if (rx && rx.pharmacyInfo) {
          if (rx.pharmacyInfo.mailable === true) {
            rx.pickUpInstruction = false;
          } else {
            rx.pickUpInstruction = true;
          }
        }
        // @Prabhakar is going to take care below line of code.

        if (rx.statusCodes.refillable) {
            Communicator.cartCh.command('CHECK:RX-IN-CART', {
                rxKey: rx.prescriptionNumber,
                onSuccess: function(isExist) {
                    if (isExist) {
                        rx.rxBtnClass = 'removeFromCart';
                        rx.rxBtnLbl = ContentHelper.getContentById('landingPage.removeFromCart');//'Remove from cart';
                      rx.addedToCart = ContentHelper.getContentById('landingPage.addedToCart');//"Added to cart";
                    } else {
                        rx.rxBtnClass = 'addtoCart';
                        rx.rxBtnLbl = ContentHelper.getContentById('landingPage.fillPrescription');//'Fill prescription';
                        rx.addedToCart = "";
                    }
                }
            });
        } else {
            rx.rxBtnClass = 'button-unavailable';
            rx.rxBtnLbl = 'Unavailable';
        }
    });


  };


  function _getName(memname) {
    var name = {
      firstName: "",
      lastName: ""
    };
    if (memname && memname.indexOf(" ") > -1) {
      var index = memname.indexOf(" ");
      name.firstName = memname.substring(0, index);
      name.lastName = memname.substring(index + 1);
    } else {
      name.firstName = memname;
      name.lastName = memname;
    }
    return name;
  }
  return instance;
});
