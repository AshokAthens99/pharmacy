define([
        'helper/errorMsges/ErrorHelper',
        'view/landingPage/subjsView', 'view/landingPage/rxsView','view/landingPage/printerView','view/landingPage/gotoCartButtonView',
        'view/landingPage/srchByRxView', 'view/landingPage/additionalResourcesView', 'view/landingPage/refillNowView',
        'view/landingPage/landingPageLayout', 'backbone.marionette', 'utl/Communicator','view/landingPage/showMoreView',
        'serviceDelegate/prescriptionService', 'model/prescription/rxCollection', 'helper/errorMsges/mdl/BusinessError',
        'common/appManager', 'rsvp', 'common/rxManager', 'helper/userProfile/userProfileHelper','common/cartManager',
        'common/rules/dataValidation','helper/content/contentHelper'
    ],
    function(
        ErrorHelper,
        SubjsView, RxsView,PrinterView, GotoCartButtonView, SrchByRxView, AdditionalResourcesView, RefillNowView,
        LandingPageLayout, Marionette, Communicator, ShowMoreView,PrescriptionService,
        RxCollection, BusinessError, AppManager, RSVP, RxManager, UserProfileHelper,CartManager,DataValidation,ContentHelper
    ) {
        'use strict';
        var _rxsCached;
        var _proxyPickerIdCached = {
            id: undefined,
            name: undefined
        };
        var prescriptionLength = DataValidation.SHOW_MORE_PAGE_SIZE;
        var _landingPageCh = Communicator.landingPageCh;
        var _subjsView, _rxsView,_printerView, _srchByRxView, _additionalResourcesView, _refillNowView, _gotoCartView,
        _landingPageLayout,_showMoreView;
        var landingPageCntrl = Marionette.Controller.extend({
            init: function() {
                _rxsCached = CartManager.getRxsCached();
                if ( _.isEmpty(_rxsCached) ) {
                    CartManager.setLandingPageRxRenderSize(DataValidation.SHOW_MORE_PAGE_SIZE);
                }
                var _this = this;
                _landingPageLayout = new LandingPageLayout();
                _subjsView = new SubjsView(_proxyPickerIdCached);
                _srchByRxView = new SrchByRxView();
                _gotoCartView = new GotoCartButtonView();
                _additionalResourcesView = new AdditionalResourcesView();
                _landingPageCh.comply('relId:landingPage', function(relId) {
                    _showMoreView = new ShowMoreView({relId:relId});
                    if (!UserProfileHelper.isMember() && _.isEmpty(UserProfileHelper.getProxies())) {
                       var errorMsg = {
                           code: 'setup.family',
                           description: "You need legal permission to use secure services to care for your family. How do you get this? </br> <a href='/health/mycare/consumer/myprofilehome/myprofile/act-for-family-members'> Set up your family list.</a> Once you're done, you'll see which services you can use, and we'll remind you as you move around our site."
                       };
                       Communicator.globalCh.command("ERROR:SHOW",
                           new BusinessError({
                                messages: errorMsg,
                                renderTo: "#err-msg"
                           })
                       );
                   } else {
                       _rxsView = new RxsView({
                          collection: new RxCollection()
                       });
                       var _promisePrescription;
                       if (_rxsCached[relId] == undefined) {
                           _promisePrescription = PrescriptionService.loadPrescriptionDetails(relId);
                       } else {
                           _promisePrescription = new RSVP.Promise(function(resolve, reject) {
                               resolve(_rxsCached[relId])
                           });
                      }
                    _proxyPickerIdCached.id = relId;
                    var fullName = RxManager.getSelectedFullName(relId);
                    _proxyPickerIdCached.name = fullName;
                    _promisePrescription.then(function(rxs) {
                        if (rxs.errors) {
                            Communicator.globalCh.command("ERROR:SHOW",
                                new BusinessError({
                                    messages: rxs.errors,
                                    renderTo: "#err-msg"
                                }));
                        }
                        if (rxs.detail && !_.isEmpty(rxs.detail)) {
                            if (_rxsCached[relId] == undefined) {
                                rxs.detail = _.sortBy(rxs.detail, function(rx) {
                                    return rx.statusCodes.refillable
                                }).reverse();
                            }
                            RxManager.updateRxObjects(rxs);
                            _refillNowView = new RefillNowView({
                                _cartSize: CartManager.getCartSize(),
                                relId: relId
                            });

                            _rxsCached[relId] = rxs;
                            CartManager.setRxsCached(_rxsCached);
                            _landingPageLayout.refillNowRegion.show(_refillNowView);
                            _landingPageLayout.showMoreRegion.show(_showMoreView);
                            var showMoreRxDetails = CartManager.showMoreData(rxs.detail,relId);
                            if (showMoreRxDetails && !_.isEmpty(showMoreRxDetails)) {
                                _rxsView.collection.reset(showMoreRxDetails);
                                 var remainingSize = rxs.detail.length - showMoreRxDetails.length;
                                _showMoreView.setPageSize(remainingSize);
                                _landingPageLayout.showMoreRegion.$el.show(_showMoreView);
                            }else {
                                _rxsView.collection.reset(rxs.detail);
                              _landingPageLayout.showMoreRegion.$el.hide(_showMoreView);
                            }
                            RxManager.setCacheRxs(rxs);
                            _landingPageLayout.rxsRegion.show(_rxsView);

                            var PAGE_SIZE = DataValidation.SHOW_MORE_PAGE_SIZE;
                            if(showMoreRxDetails.length > PAGE_SIZE)
                            {
                              _rxsView.setPrescriptionfocus(showMoreRxDetails[prescriptionLength].prescriptionNumber);
                              prescriptionLength  = showMoreRxDetails.length;
                            }
                            prescriptionLength = showMoreRxDetails.length;
                            _printerView = new PrinterView();
                            _landingPageLayout.printerRegion.show(_printerView);
                            _this.manageCartBtnView(relId);

                        } else {
                          _rxsView = new RxsView({
                              collection: new RxCollection()
                          });
                          _refillNowView = new RefillNowView({
                              _cartSize: CartManager.getCartSize(),
                              relId: relId
                          });
                         _printerView = new PrinterView();

                         _landingPageLayout.refillNowRegion.show(_refillNowView);
                         _landingPageLayout.rxsRegion.show(_rxsView);
                         _rxsView.collection.reset("No Data ..");
                         _landingPageLayout.showMoreRegion.$el.hide(_showMoreView);
                          _landingPageLayout.printerRegion.show(_printerView);
                          RxManager.setCacheRxs(rxs);
                        }
                    }, function(error) {
                        var errorMsg;
                        if (error.httpResponseCode === 403) {
                            errorMsg = {
                                code: 2001,
                                description: 'Access to the requested feature not allowed for this viewer'
                            }
                            Communicator.globalCh.command("ERROR:SHOW",
                                new BusinessError({
                                    messages: errorMsg,
                                    renderTo: "#err-msg"
                                }));
                        } else {
                            Communicator.globalCh.command('ERROR:SHOW', error);
                        }

                    });
                  }
                });
                _landingPageLayout.on('show', function() {
                  _landingPageLayout.subjsRegion.show(_subjsView);
                     if (!UserProfileHelper.isMember() && _.isEmpty(UserProfileHelper.getProxies())) {}
                     else {
                       _landingPageLayout.srchByRxRegion.show(_srchByRxView);
                     }
                    _landingPageLayout.additionalResourcesRegion.show(_additionalResourcesView);
                });
                require('common/appManager').mainRegion.show(_landingPageLayout);
            },
            manageCartBtnView: function(relId) {
                var _this = this;
                _landingPageCh.comply('mngCart:landingPage', function(operation, rxKey) {
                    var userObj = RxManager.getNameForUser(relId);
                    var userFirstName = userObj.firstName;
                    var userLastName = userObj.lastName;
                    var firstNameCaseConversion = userFirstName.charAt(0).toUpperCase() + userFirstName.slice(1).toLowerCase();
                    var lastNameCaseConversion  = userLastName.charAt(0).toUpperCase()  + userLastName.slice(1).toLowerCase();
                    var isRxBtnPrivileged = RxManager.checkAccess(relId);
                    if (isRxBtnPrivileged) {
                      if (operation === 'add') {
                          var _rxsOfSelectedUser = _rxsCached[relId];
                          var _rxObj = _.findWhere(_rxsOfSelectedUser.detail, {
                              'prescriptionNumber': eval(rxKey)
                          });
                          var rxData = RxManager.buildRxData(rxKey,relId,_rxObj,firstNameCaseConversion,lastNameCaseConversion);
                          _this._addToCart(rxKey, rxData);
                      } else if (operation === 'rem') {
                          _this._removeFromCart(rxKey);
                      }
                  } else {

                    var msg =  {
                          code:'1010',
                          description: 'You do not have privilege access. Please try again later.'
                        }

                        Communicator.globalCh.command("ERROR:SHOW",
                            new BusinessError({
                                messages: msg,
                                dialog: true
                            }));
                    }
                });

                Communicator.cartCh.command('GET:CART', {
                    onSuccess: function(cartItems) {
                        var cartList = _.keys(cartItems);
                        var cartSize = (cartList) ? cartList.length : 0;
                        _gotoCartView.showCartSizeOnBtn(cartSize);
                        if (cartSize > 0) {
                            _landingPageLayout.goToCartRegion.$el.show();
                        } else {
                            _landingPageLayout.goToCartRegion.$el.hide();
                        }
                    }
                });

            },
            _addToCart: function(rxKey, rxData) {
                var cartSizeOnAdding = CartManager.addToCart(rxKey,rxData);
                if (cartSizeOnAdding === 'error') {
                  return;
                }
                if (cartSizeOnAdding) {
                  _gotoCartView.showCartSizeOnBtn(cartSizeOnAdding);
                  _gotoCartView.chngLblToBtnWhenAdd(rxKey);
                }

            },
            _removeFromCart: function(rxKey) {
                var cartSizeOnDeleting = CartManager.removeFromCart(rxKey);
                if (cartSizeOnDeleting > 0) {
                    _gotoCartView.showCartSizeOnBtn(cartSizeOnDeleting);
                } else {
                   _gotoCartView.showCartSizeOnBtn(cartSizeOnDeleting);
                }
            }
        });
        return landingPageCntrl;
    });
