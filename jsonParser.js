define(['lodash', 'model/address/addressEnum'],function(_, AddressEnum){
'use strict';
return {
  saveAddress:{
    "personRequest": {
        "updatePartial": function(){return "true";},
        "person": {
            "contactInfo": {
                "addressInfos": {
                    "addressType": "type",
                    "sourceSystem": "sourceSystem",
                    "label": function(obj){
                      return obj.label.toString();
                    },
                    "street1": "addressLine1",
                    "street2": "",
                    "city": "city",
                    "state": "state",
                    "country": "",
                    "postalCode": "zip5",
                    "careOfFirstName": "firstName",
                    "careOfMiddleName": "middleInitial",
                    "careOfLastName": "lastName",
                    "preferredIn": "preffered"
                }
            }
        }
    }
 },
 loadProfileAddresses : {
    address: [
      {
        root: 'AddressListResponse.addresses',
        data: {
          city: 'city',
          label: 'label',
          zip5: 'postalCode',
          sourceSystem: 'sourceSystem',
          street1: 'street1',
          state: 'state',
          type: 'type'
         }
      }
    ]
  },
  loadTrialClaims : {
     claims: [
       {
         root: 'TrialClaimsResponse.out',
         data: {
           claimDetailsArray: 'claimDetailsArray',
          }
       }
     ]
   },
  phones: {
    as: [
      {
        root: 'ListPhoneNumbersResponse.phoneNumbers',
        data: {
          label: 'label',
          type: 'type',
          areaCode: 'phoneNumber.area',
          exchange: 'phoneNumber.exchange',
          subscriber: 'phoneNumber.subscriber',
          primaryIndicator: 'primaryIndicator',
          sourceSystem: 'sourceSystem',
          extension: 'phoneNumber.extension'
        }
      }
    ]
  },
  pharmacyDetailsMember: {
    error : {
			      severity: 'PharmacyDetails.executionContext.errors.severity',
			      type: 'PharmacyDetails.executionContext.errors.type',
			      code: 'PharmacyDetails.executionContext.errors.code',
			      description: 'PharmacyDetails.executionContext.errors.description',
			 },
    member : {
      firstName : 'PharmacyDetails.members.UserInfoResponse.member.memberName.firstName',
      lastName : 'PharmacyDetails.members.UserInfoResponse.member.memberName.lastName',
      mrn : 'PharmacyDetails.members.UserInfoResponse.member.mrn',
      region: 'PharmacyDetails.members.UserInfoResponse.member.region'
    },
    address: function(obj) {
        if(obj.PharmacyDetails && obj.PharmacyDetails.members
            && obj.PharmacyDetails.members.UserInfoResponse
            && obj.PharmacyDetails.members.UserInfoResponse.member
            ){
               var addressObj = obj.PharmacyDetails.members.UserInfoResponse.member.addresses;
               if(addressObj){
                   if (addressObj.address) {
                        return [obj.PharmacyDetails.members.UserInfoResponse.member.addresses.address];
                   }
                   else {
                        return obj.PharmacyDetails.members.UserInfoResponse.member.addresses;
                   }
             }
        }
    },

    creditCard : {
      lastFourDigits: 'PharmacyDetails.members.UserInfoResponse.member.creditCard.lastFourDigits' ,
      expirationDate: 'PharmacyDetails.members.UserInfoResponse.member.creditCard.expirationDate',
      type: 'PharmacyDetails.members.UserInfoResponse.member.creditCard.type',
      firstName: 'PharmacyDetails.members.UserInfoResponse.member.creditCard.cardHolderName.firstName',
      middleName: 'PharmacyDetails.members.UserInfoResponse.member.creditCard.cardHolderName.middleName',
      lastName: 'PharmacyDetails.members.UserInfoResponse.member.creditCard.cardHolderName.lastName'
    },

    phones : {
      businessPhone: function(data) {
        if (data.PharmacyDetails && data.PharmacyDetails.members
         && data.PharmacyDetails.members.UserInfoResponse.member
         && data.PharmacyDetails.members.UserInfoResponse.member.businessPhone) {
          return data.PharmacyDetails.members.UserInfoResponse.member.businessPhone.areaCode
          +  data.PharmacyDetails.members.UserInfoResponse.member.businessPhone.number;
        }
      },
      homePhone: function (data) {
        if (data.PharmacyDetails && data.PharmacyDetails.members
         && data.PharmacyDetails.members.UserInfoResponse.member
         && data.PharmacyDetails.members.UserInfoResponse.member.homePhone) {
          return data.PharmacyDetails.members.UserInfoResponse.member.homePhone.areaCode
          +  data.PharmacyDetails.members.UserInfoResponse.member.homePhone.number;
        }
      }
    }
},
      listAddresses:{
          as: [{root: "address",
                data:{
                    firstName : "careOfFirstName",
                    lastName  : "careOfLastName",
                    label     : "label",
                    addressLine1 : "streetAddress1",
                   // apt : "",
                    city  : "city",
                    state : "state",
                    zip5  : function(data){
                        var zipCodeStr = data.zipCode.toString();
                        var zip5 = zipCodeStr.substr(0, 5);
                                          return zip5;
                    },
                    type  : function(data){
                                    if(data.addressType === undefined || data.addressType ===""){
                                        return AddressEnum.TYPE.SHIPPING;
                                    }
                    },
                    preffered : "prefferedIn",
                    addressId: function(data) {
                      var id = data.label;
                      return id;
                  },
                  isNew: function(data) {
                       return false;
                  },
                  isDelete: function(data) {
                      if(data.sourceSystem === AddressEnum.SOURCE_SYSTEM.RWD_MBR &&
                         data.type === AddressEnum.TYPE.SHIPPING){
                          return true;
                      } else {
                          return false;
                      }
                  },
                  sourceSystem: function(data) {
                    return data.sourceSystem;
                  }
                }
              }]
      }
  }
});
