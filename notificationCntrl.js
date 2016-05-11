define([
        'backbone',
        'backbone.marionette',
        'view/notification/notificationView',
        'view/notification/notificationOrderView',
        'model/notification/notificationMdl',
        'utl/Communicator'
   ],
	function (backbone,
		marionette,
		notificationView,
		notificationOrderView,
		notificationMdl,
		Communicator
	) {
		'use strict';
		var notificationCntrl = Marionette.Controller.extend({

			showNotificationPage: function (mode) {

				var mdl = new notificationMdl();
				this.model = mdl;
				var _notificationView = new notificationView({
					model: new notificationMdl()
				});
				_notificationView.on('SAVE:NOTIFY', function (checkedValue) {
					Communicator.cartCh.command('SAVE:NOTIFY', checkedValue);
					if (mode === 'pickup') {
						Backbone.history.navigate('#showPickupOrder', {
							trigger: true,
							replace: false
						});
					} else {
						Backbone.history.navigate('#showShippableOrder', {
							trigger: true,
							replace: false
						});
					}
				});
				_notificationView.on('CANCEL:NOTIFY', function () {
					if (mode === 'pickup') {
						Backbone.history.navigate('#showPickupOrder', {
							trigger: true,
							replace: false
						});
					} else {
						Backbone.history.navigate('#showShippableOrder', {
							trigger: true,
							replace: false
						});
					}
				});

				var defaultValue = Communicator.cartCh.request('GET:NOTIFY');

				if (defaultValue) {
					_notificationView.model.set(defaultValue);
				}

				require('common/appManager').mainRegion.show(_notificationView);
			},
			showNotificationInOrderPage: function () {

				var _notificationOrderView = new notificationOrderView({
					model: new notificationMdl()
				});
				var defaultValue = _notificationOrderView.model.default;
				Communicator.cartCh.command('GET:NOTIFY', defaultValue);
				if (defaultValue) {
					_notificationOrderView.model.
					default = defaultValue;
				}
				return _notificationOrderView;
			},

		});
		//
		return notificationCntrl;
	});
