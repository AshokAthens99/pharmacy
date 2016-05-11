define(['lodash', 'model/prescription/userListCollection',
  'utl/Communicator', 'rsvp', 'helper/errorMsges/mdl/BusinessError', 'common/rules/dataValidation'
], function(_, UserListCollection,
  Communicator, RSVP, BusinessError, DataValidation) {
  'use strict';
  var instance = {};
  var phoneObj = {};
  var phoneObjFinal = {};

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

  return instance;
});
