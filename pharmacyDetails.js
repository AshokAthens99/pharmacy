define(['backbone'], function (BackBone) {
  "use strict";
  var PharmacyDetails = BackBone.Model.extend({
		initialize: function () {

  	},

  	getTransformedCreditCard : function() {
  		var creditCard = this.get('creditCard'),
          cc = null;
  		if(_.isObject(creditCard)) {
        cc = {};
        cc['cardNumber'] = creditCard.lastFourDigits;
        cc['cardType'] = creditCard.type;
        cc['expirationDate']  = creditCard.expirationDate;
        cc['fullName'] = creditCard.firstName + ' ' + creditCard.lastName;
  		}
  		return cc;
  	},

  	hasCreditCard : function() {
  		var creditCard = this.get('creditCard'),
          found = false;
  		if(_.isObject(creditCard) && creditCard.lastFourDigits) {
  			found = true;
  		}
  		return found;
  	},

  	hasAddress : function() {
  		var address = this.get('address'),
          found = false;
  		if(_.isObject(address)) {
  			found = true;
  		}
  		return found;
  	},

  	getTransformedAddress : function() {
  		var address = this.get('address');
  		return address;
  	},
    getTransformedPhones : function() {
      var phone = this.get('phones'), phones = {};
      if(_.isObject(phone)) {
        phones['homephone'] = phone.homePhone;
        phones['businessPhone'] = phone.businessPhone;
      }
      return phones;
    }
  });
  return PharmacyDetails;
});
