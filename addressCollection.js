define(['backbone', 'model/address/address'], function (BackBone, Address) {
  "use strict";
  // definition for rx domain, with default example of data structure
  var AddressCollection = BackBone.Collection.extend({
    model: Address,
  	_MAILING : 'MAILING',
    hasAddress : function(params) {
			var address = this.where({type:this._MAILING});
			if(address && address.length>0) {
				return true;
			}
			return false;
		},
		getMailingAddress : function() {
			var address = this.findWhere({type:this._MAILING});

			return address;
		}
  });
  return AddressCollection;
});
