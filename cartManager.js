define(['lodash', 'view/common/cartViewHandler', 'model/prescription/userListCollection',
  'utl/Communicator', 'rsvp', 'helper/errorMsges/mdl/BusinessError', 'common/rules/dataValidation',
  'helper/content/contentHelper', 'common/claimsManager'
], function(_, CartViewHandler, UserListCollection,
  Communicator, RSVP, BusinessError, DataValidation, ContentHelper, ClaimsManager) {
  'use strict';
  var instance = {};
  var currentLayout;
  var isCartPage;
  var startIndex = DataValidation.SHOW_MORE_PAGE_SIZE;
  var relId = "";
  var claims = "";
  var flowType;
  var _rxsCached = {};

  /**
   * @desc Called for removing items from the Cart
   * @param rxKey - key of the cart item to be removed
   * @return cartItemView
   */
  instance.removeCartItems = function(rxKey) {
    var _this = this;
    var promise = new RSVP.Promise(function(resolve, reject) {
      Communicator.cartCh.command('DEL:CART', {
        key: rxKey,
        onSuccess: function(cartSize) {
          var _cartItemView = _this.getCartView();
          return resolve(_cartItemView);
        }
      });
    });
    return promise;
  };


  /**
   * @desc Used to determine if the cart items are shippable or not
   * @param No Input params required
   * @return boolean - if the items are shippable or not
   */
  instance.isRxShippable = function() {
    var rxsInCart = Communicator.cartCh.request('GET:CARTITEMS');
    var isRxShippable = false;
    //statusCodes which require authorization code
    _.each(rxsInCart, function(rx) {
      if (rx.pharmacyInfo.mailable === true) {
        isRxShippable = true;
        return isRxShippable;
      }
    });
    return isRxShippable;
  };

  /**
   * @desc Get the cart size
   * @param No Input params required
   * @return Cart Size
   */
  instance.getCartSize = function() {
    var cartItems = Communicator.cartCh.request('GET:CARTITEMS');
    var cartItemKeys = _.keys(cartItems);
    return cartItemKeys.length;
  };


  /**
   * @desc Sets the rxs cached
   * @param layoutObj - rxs object to be set
   * @return Null. Sets the current layout
   */
  instance.setRxsCached = function(rxsCached) {
    _rxsCached = rxsCached;
  };

  /**
   * @desc Gets the rxs cached
   * @param layoutObj - rxs object to be set
   * @return RxsCached. Gets the current layout
   */
  instance.getRxsCached = function() {
    return _rxsCached;
  };




  /**
   * @desc Sets the rxs cached
   * @param layoutObj - rxs object to be set
   * @return Null. Sets the current layout
   */
  instance.setLandingPageRxRenderSize = function(rxRenderSize) {
    startIndex = rxRenderSize;
  };

  /**
   * @desc Gets the rxs cached
   * @param layoutObj - rxs object to be set
   * @return RxsCached. Gets the current layout
   */
  instance.getLandingPageRxRenderSize = function() {
    return startIndex;
  };



  /**
   * @desc Sets the current view layout
   * @param layoutObj - Layout object to be set
   * @return Nothing. Sets the current layout
   */
  instance.setCurrentLayout = function(layoutObj) {
    currentLayout = layoutObj;
  };


  /**
   * @desc Gets the current layout
   * @param No input params required
   * @return returns the currentLayout
   */
  instance.getCurrentLayout = function() {
    return currentLayout;
  };

  instance.setCartPage = function(page) {
    isCartPage = page;
  };

  /**
   * @desc Adds an item to the Cart
   * @param rxKey - item Key, rxData - item Data
   * @return cartResponse - Cart size if success else 'error'
   */
  instance.addToCart = function(rxKey, rxData) {
    var cartResponse;
    Communicator.cartCh.command('ADD:CART', {
      key: rxKey,
      value: rxData,
      onSuccess: function(cartSize) {
        cartResponse = cartSize;
        return cartResponse;
      },
      onFailure: function(err) {
        Communicator.globalCh.command("ERROR:SHOW",
          new BusinessError({
            messages: err,
            dialog: true
          }));
        cartResponse = 'error';
        return cartResponse;
      }
    });
    return cartResponse;
  };


  /**
   * @desc removes item from the Cart
   * @param rxKey - Key of the item to be removed
   * @return cartItemsSize - cart size
   */
  instance.removeFromCart = function(rxKey) {
    var cartItemsSize;
    Communicator.cartCh.command('DEL:CART', {
      key: rxKey,
      onSuccess: function(cartSize) {
        cartItemsSize = cartSize;
        return cartItemsSize;
      }
    });
    return cartItemsSize;
  };


  /**
   * @desc Creates the Cart View
   * @param No input params required
   * @return cartItemView
   */
  instance.getCartView = function() {
    var _cartItemView = new CartViewHandler({
      collection: new UserListCollection()
    });
    // Get the shopping cart items from cartHelper object
    var cartItems = Communicator.cartCh.request('GET:CARTITEMS');
    var cartItemKeys = _.keys(cartItems);
    var itemsGroupByUser = getGroupedItems(cartItemKeys, cartItems);
    if (!_.isEmpty(itemsGroupByUser) && (itemsGroupByUser[0].page == 'creditCardPage'|| itemsGroupByUser[0].page == 'shipReviewOrderPage')&& ClaimsManager.getClaims() != undefined ){
      itemsGroupByUser = ClaimsManager.addClaimsByUser(itemsGroupByUser);
    }
    // set the grouped cartObj into a Backbone collection
    _cartItemView.collection.reset(itemsGroupByUser);
    return _cartItemView;
  };


  /**
   * @desc Creates the Search View
   * @param searchByRxResultView - search View to be created
   * @return searchByRxResultView
   */
  instance.getSearchView = function(_searchByRxResultView) {
    // Get the shopping cart items from cartHelper object
    var searchItems = Communicator.cartCh.request('GET:SEARCH-DATA');
    var searchItemKeys = _.keys(searchItems);
    var itemsGroupByUser = getGroupedItems(searchItemKeys, searchItems);
    // set the grouped cartObj into a Backbone collection
    _searchByRxResultView.collection.reset(itemsGroupByUser);
    return _searchByRxResultView;
  };


  /**
   * @desc Check to see if there are any search items available
   * @param No Params required
   * @return boolean - If search items are available or not
   */
  instance.isSearchListEmpty = function() {
    // Get the shopping cart items from cartHelper object
    var searchItems = Communicator.cartCh.request('GET:SEARCH-DATA');
    var searchItemKeys = _.keys(searchItems);
    if (searchItemKeys && searchItemKeys.length > 0) {
      return false;
    } else {
      return true;
    }
  };



  instance.setFlowType = function(_flowType) {
      flowType = _flowType;
  };

  instance.getFlowType = function() {
    return  flowType;
  }



  /**
   * @desc Get items that require Authorization Status Codes
   * @param No Input params required
   * @return needAuthorizationRxs - Array with items that require Authorization Codes
   */
  instance.getRxsRequireAuthorization = function() {
    var rxsInCart = Communicator.cartCh.request('GET:CARTITEMS');
    var needAuthorizationRxs = [];
    //statusCodes which require authorization code
    _.each(rxsInCart, function(rx) {
      if (_.contains(DataValidation.RXs_AUTHORIZATION_CODES, rx.statusCodes.rxDetailResponseCode)) {
        needAuthorizationRxs.push(rx);
      }
    });
    return needAuthorizationRxs;
  };


  /**
   * @desc Adds items to Search collection
   * @param rx - Item, query
   * @return cartItemSize
   */
  instance.addItemstoSearchCollection = function(rx, query) {
    var rxKey = rx.prescriptionNumber;
    if (rx && rx.pharmacyInfo) { // mailable status set to Yes or No
      if (rx.pharmacyInfo.mailable) {
        rx.pickUpInstruction = false;
        rx.pharmacyInfo.mailable = true;
      } else {
        rx.pickUpInstruction = true;
        rx.pharmacyInfo.mailable = false;
      }
    }
    rx.usrId = query.relId;
    rx.isMember = query.isMember;
    rx.firstFill = false;
    rx.source = 'MANUAL';
    rx.nhinId = rx.pharmacyInfo.nhinId;
    rx.dispenseLocationCode = rx.pharmacyInfo.dispenseLocationCode;

    var cartItemsSize;
    var rxData = rx;
    var firstName = rx.person.firstName;
    var lastName = rx.person.lastName;
    var firstNameCaseConversion = (firstName) ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() : '';
    var lastNameCaseConversion = (lastName) ? lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase() : '';
    var someoneElse;
    //if (ContentHelper.getContentNode().LABELS) {
    someoneElse = ContentHelper.getContentById('searchPage.someoneElse'); //ContentHelper.getContentNode().LABELS.searchPage.someoneElse;
    //}
    rx.firstName = firstNameCaseConversion;
    rx.lastName = lastNameCaseConversion;

    if (!_.isEmpty(query.firstName) && _.startsWith(someoneElse, query.firstName)) {
      firstNameCaseConversion = query.mrn;
      lastNameCaseConversion = '';
      rx.firstName = firstNameCaseConversion;
      rx.lastName = lastNameCaseConversion;
    }

    Communicator.cartCh.command('SAVE:SEARCH-DATA', {
      key: rxKey + firstNameCaseConversion + lastNameCaseConversion,
      value: rxData,
      onSuccess: function(cartSize) {
        cartItemsSize = cartSize;
        return cartItemsSize;
      }
    });
    return cartItemsSize;
  };


  /**
   * @desc Checks if the items exit in the search collection
   * @param query - firstName, LastName
   * @return boolean - if Rx exits for the user or no
   */
  instance.checkRxInSearchCollection = function(query) {
    var rxKey = eval(query.rx);
    var mrn = query.mrn;
    var queryFirstName = query.firstName;
    var queryLastName = query.lastName;
    var firstNameCaseConversion = (queryFirstName) ? queryFirstName.charAt(0).toUpperCase() + queryFirstName.slice(1).toLowerCase() : '';
    var lastNameCaseConversion = (queryLastName) ? queryLastName.charAt(0).toUpperCase() + queryLastName.slice(1).toLowerCase() : '';
    var searchItems = Communicator.cartCh.request('GET:SEARCH-DATA');


    var someoneElse;
    //  if (ContentHelper.getContentNode().LABELS) {
    someoneElse = ContentHelper.getContentById('searchPage.someoneElse'); //ContentHelper.getContentNode().LABELS.searchPage.someoneElse;
    //}

    if (_.startsWith(someoneElse, query.firstName)) {
      firstNameCaseConversion = query.mrn;
      lastNameCaseConversion = '';
    }



    var rxData;
    var isRxFoundToThisUser = false;
    if (searchItems) {
      rxData = searchItems[rxKey + firstNameCaseConversion + lastNameCaseConversion];
      if (rxData) {
        var firstName = rxData.firstName;
        var lastName = rxData.lastName;
        if (firstName === firstNameCaseConversion &&
          lastName === lastNameCaseConversion &&
          rxData.prescriptionNumber === rxKey
        ) {
          isRxFoundToThisUser = true;
        }
      }
    }
    return isRxFoundToThisUser;
  };


  /**
   * @desc Gets the item from the search Collection
   * @param rxKey - key of the item
   * @return rxData - returns the item from the search Collection
   */
  instance.getRxDataFromSearchCollection = function(rxKey) {
    var searchItems = Communicator.cartCh.request('GET:SEARCH-DATA');
    var rxData;
    if (searchItems) {
      rxData = searchItems[rxKey];
      if (rxData) {
        return rxData;
      }
    }
    return rxData;
  };


  /**
   * @desc Removes the item from the Search Collection
   * @param searchRxKey - key of the item to be removed from the search list
   * @return boolean - success or failure
   */
  instance.removeFromSearchList = function(searchRxKey) {
    var response;
    Communicator.cartCh.request('DEL:SEARCH-DATA', {
      key: searchRxKey,
      onSuccess: function(size) {
        response = true;
      }
    });
    return response;
  };


  instance.showMoreData = function(rxDetail, relativeId) {
    if (relId !== relativeId) {
      startIndex = DataValidation.SHOW_MORE_PAGE_SIZE;
      this.setLandingPageRxRenderSize(startIndex);
      relId = relativeId;
    }

    var newRxDetail = [];
    startIndex = this.getLandingPageRxRenderSize();
    for (var arrIndex = 0; arrIndex < startIndex; arrIndex++) {
      newRxDetail[arrIndex] = rxDetail[arrIndex];
    }
    if (startIndex < rxDetail.length) {
      startIndex += DataValidation.SHOW_MORE_PAGE_SIZE;
      this.setLandingPageRxRenderSize(startIndex);
    } else {
      newRxDetail = [];
    }

    return newRxDetail;
  };



  instance.isMixedDeliverableItems = function() {

    var rxsInCart = Communicator.cartCh.request('GET:CARTITEMS');
    var mailable = false,
      pickupOnly = false;
    _.each(rxsInCart, function(rx) {
      if (rx.pharmacyInfo.mailable) {
        mailable = true;
      } else {
        pickupOnly = true;
      }
    });

    if (mailable && pickupOnly) {
      return true;
    } else {
      return false;
    }

  };


  /**
   * @desc Internal function to group the items
   * @param cartItemKeys, cartItems
   * @return itemsGroupByUser - Returns grouped by array of cartItems
   */
  function getGroupedItems(cartItemKeys, cartItems) {
    var itemsGroupByUser = [];
    var rxsArray = [];
    var rxSet = {};
    var userSet = {};
    var cartObj;
    var firstName, lastName;
    var valueInCartChannel;

    // iterate cart object with the rx key
    if (cartItemKeys.length > 0) {
      _.each(cartItemKeys, function(key) {
        rxsArray = [];
        valueInCartChannel = cartItems[key];
        if (valueInCartChannel) {
          rxsArray.push(valueInCartChannel);
          firstName = valueInCartChannel.firstName;
          lastName = valueInCartChannel.lastName;
          //group the prescriptions for each member
          if (rxSet[firstName] === undefined) {
            rxSet[firstName] = rxsArray.slice();
            userSet[firstName] = {
              firstName: firstName,
              lastName: lastName
            };
          } else {
            rxSet[firstName] = rxSet[firstName].concat(rxsArray.slice());
          }
        }
      });
    }

    // iterate grouped prescriptions and set into cartObj
    var rxSetKeys = _.keys(rxSet);
    _.each(rxSetKeys, function(rxSetKey) {
      cartObj = {
        page: isCartPage,
        firstName: userSet[rxSetKey].firstName,
        lastName: userSet[rxSetKey].lastName,
        rxs: rxSet[rxSetKey]
      };
      // keep all the grouped cartObj into an array
      itemsGroupByUser.push(cartObj);
    });
    return itemsGroupByUser;
  }




  return instance;
});
