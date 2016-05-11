define(['backbone'], function (BackBone) {
	"use strict";
	var Phones = BackBone.Collection.extend({
		_DAYPHONE: 'DAY PHONE',
		_EVENINGPHONE: 'EVENING PHONE',
		_MOBILE: 'MOBILE',
		getDayTimePhone: function () {
			return this.getPhone(this._DAYPHONE);
		},
		getEveningPhone: function () {
			return this.getPhone(this._EVENINGPHONE);
		},
		getMobile: function () {
			return this.getPhone(this._MOBILE);
		},
        getPhone: function(type) {
            var phone = this.findWhere({
				type: type
			});

			if (phone) {
                if(_.isArray(phone)){
                  phone = phone[0];
                }
                phone.getPhoneForDisplay = function() {
		            return  '' + this.attributes.areaCode + this.attributes.exchange + this.attributes.subscriber + this.attributes.extension;

                };
				return phone;
			}
			return undefined;
        }
	});
	return Phones;
});
