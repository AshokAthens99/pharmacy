define(['utl/Communicator', 'lodash','common/rules/dataValidation','helper/userProfile/userProfileHelper'],
       function(Communicator, _,DataValidation, UserProfileHelper){
    'use strict';
    var instance = {};
    var SOURCE_APPLICATION = 'RWD_PHC';
    function _getRxs(cartItems, relId, pharmacyLocation, deliveryMethod){
        var rxsList = [];
        var cartItemKeys = _.keys(cartItems);
        _.each(cartItemKeys, function (key) {
            var value = cartItems[key];
            var findRxByMode = undefined;

            if(value.mailable && deliveryMethod === 'MAIL') {
              findRxByMode = 'mail';
            }else if(deliveryMethod === 'PICKUP'){
              findRxByMode = 'pickup';
            }

            if (findRxByMode && value) {
                if(value.isMember && value.usrId === relId && relId !== 'byRxNo_soe'){
                     var rxObj = {
                            "rxNumber": value.prescriptionNumber,
                            "nhinId": value.nhinId,
                            "responseCode": value.statusCodes.rxDetailResponseCode,
                            "rxName": value.prescriptionName,
                            "dispenseLocationCode": value.dispenseLocationCode,
                            "consumerResponseCode": value.statusCodes.consumerResponseCode,
                            "firstFill": value.firstFill
                        };
                    if(deliveryMethod === 'PICKUP') {
                        rxObj.dispenseLocationCode = (rxObj.dispenseLocationCode) ? rxObj.dispenseLocationCode : pharmacyLocation.pharmacyId;
                        rxObj.pharmacyId = pharmacyLocation.pharmacyId;// TODO set pharmacyId dynamically
                        rxObj.source = value.source;
                        rxObj.mailable=false;

                    }

                    rxsList.push(rxObj);

                } else if(!value.isMember && relId === 'NMA'){ // NMA user
                         var rxObj = {
                            "rxNumber": value.prescriptionNumber,
                            "nhinId": value.nhinId,
                            "responseCode": value.statusCodes.rxDetailResponseCode,
                            "rxName": value.prescriptionName,
                            "dispenseLocationCode": value.dispenseLocationCode,
                            "consumerResponseCode": value.statusCodes.consumerResponseCode,
                            "firstFill": value.firstFill
                        };
                    if(deliveryMethod === 'PICKUP') {
                        rxObj.pharmacyId = pharmacyLocation.pharmacyId;// TODO set pharmacyId dynamically
                        rxObj.mailable=false;

                    }

                    rxsList.push(rxObj);

                } else if(value.isMember && relId === 'byRxNo_soe' && value.usrId === relId){
                         var rxArr = [];
                         var rxObj = {
                            "rxNumber": value.prescriptionNumber,
                            "nhinId": value.nhinId,
                            "responseCode": value.statusCodes.rxDetailResponseCode,
                            "rxName": value.prescriptionName,
                            "dispenseLocationCode": value.dispenseLocationCode,
                            "consumerResponseCode": value.statusCodes.consumerResponseCode,
                            "firstFill": value.firstFill
                        };

                    if(deliveryMethod === 'PICKUP') {
                        rxObj.pharmacyId = pharmacyLocation.pharmacyId; // TODO set pharmacyId dynamically
                        rxObj.mailable=false;
               //         rxObj.pickUpLocation= pharmacyLocation.address;
                    }
                  rxArr.push(rxObj);

                  var subOrdData = {
                                "memberName": {
                                    "firstName": value.memberFirstName,
                                    "lastName": value.memberLastName, // TODO Last Name Needs to
                                    "middleName": "",
                                    "nameSuffix": ""
                                },
                                "mrn": value.mrnInput,
                                "rxNumbers": rxArr
                    };

                  rxsList.push(subOrdData);

                }
            }
        });
        return rxsList;
    }
    // Get the MRN number for NMA user to set it in the Master order
    function _getMRNForProxy(proxyUsers,rxItems,region){
        var proxyMRN;
       var cartItemKeys = _.keys(rxItems);
        if(proxyUsers) {
            _.each(proxyUsers, function (proxy) {
                _.each(cartItemKeys, function (key) {
                        var value = rxItems[key];
                        if(value.usrId === proxy.RelID){
                          proxyMRN = (proxy.ID) ? proxy.ID.toString() : "";
                          return proxyMRN;
                        }
                 });
            });

          return proxyMRN;
        }
    }

  function _getCreditCardType(cardType){
    var cardTypeValue;
    if(cardType === 'AM' || cardType === 'AMEX') { cardTypeValue = "AMEX" };//AMERICAN EXPRESS
    if(cardType === 'DS' || cardType === 'DISCOVER') { cardTypeValue = "DISCOVER"};
    if(cardType === 'MS' || cardType === 'MASTER') { cardTypeValue = "MASTER"};//MASTER CARD
    if(cardType === 'VS' || cardType === 'VISA') { cardTypeValue = "VISA"};
     return cardTypeValue;
  }

  function _getCardUsage(cardUsage){
    var cardUsage;
    if(cardUsage === 'P') {
      cardUsage = 'PERMANENT';
    }else {
      cardUsage = 'SINGLEUSE';
    }

    return cardUsage;

  }
  function _getNameForProxy(proxyUsers,rxItems,region){
        var proxyName;
       var cartItemKeys = _.keys(rxItems);
        if(proxyUsers) {
            _.each(proxyUsers, function (proxy) {
                _.each(cartItemKeys, function (key) {
                        var value = rxItems[key];
                        if(value.usrId === proxy.RelID){
                          proxyName = proxy.Name;
                          return proxyName;
                        }
                 });
            });

          return getName(proxyName);
        }
    }

    function getName(memname) {
        var name = {firstName:"", lastName:""};
        if(memname && memname.indexOf(" ") > -1) {
            var index = memname.indexOf(" ");
            name.firstName = memname.substring(0, index);
            name.lastName = memname.substring(index+1);

        } else {
            name.firstName = memname;
            name.lastName = memname;

        }
        return name;
    }
    function _getSubOrdersData(rxItems, subjectUser, proxyUsers, pharmacyLocation, deliveryMethod) {
        var subOrdersDataList = [];
        if(proxyUsers) {
            _.each(proxyUsers, function (proxy) {
                var subOrdRxItems =  _getRxs(rxItems, proxy.RelID, pharmacyLocation, deliveryMethod);
                var regionCode = (DataValidation.getCodeByRegion(subjectUser.region)) ? DataValidation.getCodeByRegion(subjectUser.region).toString() : "";
                var mrnWithoutProxy = (proxy.ID) ? proxy.ID.toString() : "";


                if(subOrdRxItems && !_.isEmpty(subOrdRxItems)){
                    var subOrdData = {
                                "memberName": {
                                    "firstName": getName(proxy.Name).firstName,
                                    "lastName": getName(proxy.Name).lastName,
                                    "middleName": "",
                                    "nameSuffix": ""
                                },
                                "mrn": mrnWithoutProxy,
                                "rxNumbers": subOrdRxItems
                    };
                    subOrdersDataList.push(subOrdData);
                }
            });
        }
        var subOrdRxItemsForSOE =  _getRxs(rxItems, 'byRxNo_soe', pharmacyLocation, deliveryMethod);
        if(subOrdRxItemsForSOE && !_.isEmpty(subOrdRxItemsForSOE)){
           _.each(subOrdRxItemsForSOE, function (soe) {
              subOrdersDataList.push(soe);
          });
        }
       //  console.log(subOrdersDataList);
        return subOrdersDataList;
    }


    instance.parseJson = function(data) {
        var userProfileHelperObj  = UserProfileHelper;
        var subjectUser           = userProfileHelperObj.getBasicUser();
        var proxyUsers            = userProfileHelperObj.getProxies();
        var deliveryMethod        = (data.pharmacyLocation) ? "PICKUP": "MAIL";
        var contactInfo           = data.contactInfo;
        var notifications         = data.notification;
        var notifications_SMS     = (notifications && notifications.smsNotification) ? 'text' : undefined;
        var notifications_EMAIL   = (notifications && notifications.emailNotification) ? 'email' : undefined;
        var notification_Value    = (notifications_SMS && notifications_EMAIL) ? notifications_SMS+","+notifications_EMAIL
                                    : ((notifications_SMS) ? notifications_SMS : (notifications_EMAIL))
        var orderData = {
                "PlaceOrder": {
                    "deliveryMethod": deliveryMethod,
                    "emailAddress": subjectUser.email,
                    "region": subjectUser.region,
                    "specialInstructions": data.specialInstuctions,
                    "sourceApplication": SOURCE_APPLICATION,
                    "masterOrder": {
                        "memberName": {
                            "firstName": (subjectUser.isMember) ? subjectUser.firstname :
                                    _getNameForProxy(proxyUsers,data.rxItems,subjectUser.region).firstName,
                            "lastName": (subjectUser.isMember) ? subjectUser.lastname : _getNameForProxy(proxyUsers,data.rxItems,subjectUser.region).lastName,
                            "middleName": ""
                        },
                        "cellPhone": {
                            "areaCode"  : (contactInfo && contactInfo.mobile) ? contactInfo.mobile.areaCode: "000",
                            "number"    : (contactInfo && contactInfo.mobile) ? contactInfo.mobile.subscriber :"0000",
                            "extension" : (contactInfo && contactInfo.mobile) ? contactInfo.mobile.exchange: "000"
                        },
                        "businessPhone": {
                            "areaCode": (contactInfo && contactInfo.daytime)  ? contactInfo.daytime.areaCode: "000",
                            "number": (contactInfo && contactInfo.daytime)    ? contactInfo.daytime.subscriber :"0000",
                            "extension": (contactInfo && contactInfo.daytime) ? contactInfo.daytime.exchange: "000"
                        },
                        "homePhone": {//TODO Need to split the Phone in areacode-number-extension as per portal logic
                            "areaCode": (contactInfo && contactInfo.evening ) ? contactInfo.evening.areaCode: "000",
                            "number": (contactInfo && contactInfo.evening)    ? contactInfo.evening.subscriber :"0000",
                            "extension": (contactInfo && contactInfo.evening) ? contactInfo.evening.exchange: "000"
                        },
                        "mrn": (subjectUser.isMember) ? "" : _getMRNForProxy(proxyUsers,data.rxItems,subjectUser.region),//TODO need to check withh sukumar if this will be added automatically in axway , can we remove it
                        "rxNumbers": _getRxs(data.rxItems, (subjectUser.isMember) ? '' : 'NMA', data.pharmacyLocation, deliveryMethod)
                    },
                    "notificationPreference": [{ // TODO, sameer has to explain us how ot get the type and value
                        "type": (notifications && notifications.prefAttrName) ? notifications.prefAttrName : "",
                        "value": (notification_Value) ? notification_Value : ""
                    }],
                    "subOrders": _getSubOrdersData(data.rxItems, subjectUser, proxyUsers, data.pharmacyLocation, deliveryMethod),
                    "regionalHost": "I"
                }
            };
              if(deliveryMethod === 'MAIL') {
                var cardExpDate = data.creditCard.expirationDate;
                var cardExpDateLength = cardExpDate.substr(cardExpDate.indexOf('/')+1).length;

                orderData.PlaceOrder.creditCard = {
                        "CreditCard": {
                            "pciToken": (data.creditCard && data.creditCard.token) ? data.creditCard.token : null,
                            "lastFourDigits": (data.creditCard && data.creditCard.cardNumber &&
                                               data.creditCard.cardNumber.length > 4) ? data.creditCard.cardNumber.substr(data.creditCard.cardNumber.length - 4, data.creditCard.cardNumber.length) : data.creditCard.cardNumber,
                            "expirationDate": (data.creditCard && cardExpDateLength < 4) ? data.creditCard.expirationDate : cardExpDate.substr(0,cardExpDate.indexOf('/')) +'/'+ cardExpDate.substr(cardExpDate.indexOf('/')+3), //TODO need to validate the format
                            "verificationValue": "",
                            "type": (data.creditCard) ? _getCreditCardType(data.creditCard.cardType) : "",
                            "cardHolderName": {
                                "firstName": (data.creditCard) ? data.creditCard.firstname : "",
                                "lastName": (data.creditCard) ? data.creditCard.lastname : "",
                                "middleName": (data.creditCard) ? data.creditCard.initial : "",
                                "nameSuffix": ""
                            },
                            "usage": (data.creditCard && data.creditCard.persistenceIndicator) ?  _getCardUsage(data.creditCard.persistenceIndicator) : "SINGLEUSE", //TODO Need to check if the  usage flag is what is mapped as save on file permanent in portal
                            "sequence": ""//TODO
                        }
                };
                orderData.PlaceOrder.masterOrder.address = {
                            "addressId": data.shipToAddress.addressId,
                            "careOfFirstName": "",
                            "careOfMiddleName": "",
                            "careOfLastName": "",
                            "label": data.shipToAddress.label,
                            "prefferedIn": data.shipToAddress.preffered,
                            "sourceSystem": data.shipToAddress.sourceSystem,
                            "addressType": data.shipToAddress.type,
                            "streetAddress1": data.shipToAddress.addressLine1,
                            "city": data.shipToAddress.city,
                            "state": data.shipToAddress.state,
                            "zipCode": data.shipToAddress.zip5,
                            "singleUse": "0"
                };
            }
        return orderData;
    }

    return instance;
});
