define(['jquery', 'lodash', 'backbone',
          './parser/userParser', 'utl/json2json', 'utl/Communicator','rsvp', 'utl/ajaxUtil', 'model/Config','common/confManager'],
  function ($, _, Backbone, UserParser, J2J, Communicator, RSVP, AjaxUtil, Config,ConfigManager) {
    'use strict';

    var instance = {};
    instance.getUserEntitlements = function (params) {
      var conf = ConfigManager.getConfig();
      var entitlementURI = conf.dtoServerUri + conf.apiRestUris.entitlementApiUri;

      if (params && params.relId !== undefined) {
        entitlementURI += '?relid=' + params.relId;
      }
      var promise = new RSVP.Promise(function (resolve, reject) {
      $.ajax(entitlementURI, {
        type: 'GET',
        headers: AjaxUtil.httpHeaders(),
        xhrFields: {'withCredentials': true},
        success: function (data) { //  (data, status, xhr)
          resolve(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
         reject({
            httpResponse: {
              code: xhr.status,
              message: thrownError
            }
          });
        }
    });
  });
      return promise;

    }


    return instance;
  });
