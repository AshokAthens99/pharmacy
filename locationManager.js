define(['lodash', 'model/prescription/userListCollection',
  'utl/Communicator', 'rsvp', 'helper/errorMsges/mdl/BusinessError', 'common/rules/dataValidation'
], function(_, UserListCollection,
  Communicator, RSVP, BusinessError, DataValidation) {
  'use strict';
  var instance = {};
  var currentLayout;
  var startIndex = DataValidation.SHOW_MORE_LOCATION_SIZE;
  var relId = "";
  var selectedList = "";
  var fromLandingPage = "";
  var location, locationList;
  var phoneObj = {};
  var phoneObjFinal = {};



  instance.showMoreData = function(locationCollection, relativeId) {
    if (relId !== relativeId) {
      startIndex = DataValidation.SHOW_MORE_LOCATION_SIZE;
      relId = relativeId;
    }
    var newLocationDetail = [];
    if (selectedList == "firstime"){
      startIndex -= DataValidation.SHOW_MORE_LOCATION_SIZE;
    }
    for (var arrIndex = 0; arrIndex < startIndex; arrIndex++) {
      newLocationDetail[arrIndex] = locationCollection[arrIndex];
    }

    if (startIndex < locationCollection.length) {
      startIndex += DataValidation.SHOW_MORE_LOCATION_SIZE;
    } else {
      newLocationDetail = [];
    }

    selectedList = "";

    return newLocationDetail;
  };
  instance.setPhoneObj = function (phoneDetails){
    phoneObj = phoneDetails;
  };
  instance.getPhoneObj = function (){
    return phoneObj;
  };
  instance.setPhoneObjFinal = function (phoneDetails){
    phoneObjFinal = phoneDetails;
  };
  instance.getPhoneObjFinal = function (){
    return phoneObjFinal;
  };
  instance.setSourceLocation = function(isLandingPage) {
    fromLandingPage = isLandingPage;
  };

  instance.isFromLandingPage = function() {
    return fromLandingPage;
  };
  instance.setRxsLocation = function(savedLocation) {
    location = savedLocation;
  };

  instance.getRxsLocation = function() {
    return location;
  };

  instance.setLocationList = function(loc) {
    locationList = loc;
  };

  instance.getLocationList = function() {
    return locationList;
  }

  instance.fetchLocation = function(id) {
    return _.filter(locationList, function(z) {
      return z.pharmacyId == id;
    });
  }

  instance.clearData = function() {
    location = {};
  }

  instance.resetList = function(reset) {
    relId = reset;
    selectedList = reset;
  }

  instance.splitPhNumBySpclChar = function(param) {
    var text = param.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/g, "$1.$2.$3");
    return text;
  };
  return instance;
});
