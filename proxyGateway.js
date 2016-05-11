define(['jquery', 'lodash', 'backbone',
          './parser/userParser', 'utl/json2json', 'utl/Communicator','rsvp', 'utl/ajaxUtil', 'model/Config','common/confManager'],
  function ($, _, Backbone, UserParser, J2J, Communicator,RSVP, AjaxUtil, Config,ConfigManager) {
    'use strict';
   var instance = {};
      instance.getUserProxies = function (params) {
    var conf = ConfigManager.getConfig();
     var proxyURI = conf.dtoServerUri + conf.apiRestUris.consumerCareApiUrlPrefix;
     var promise = new RSVP.Promise(function (resolve, reject) {
      $.ajax(proxyURI, {
        type: 'GET',
        headers: AjaxUtil.httpHeaders({"X-encryption": "true"}),
        xhrFields: {'withCredentials': true},
        success: function (data) { //  (data, status, xhr)
         if (data && data.ProxyInformation) {
           resolve(data);
         } else {
           data.ProxyInformation = {};
           resolve(data);
         }

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

    };

    return instance;
  });
