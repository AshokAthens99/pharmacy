 define(['jquery', 'lodash', 'backbone',
          './parser/userParser', 'utl/json2json', 'utl/Communicator','rsvp', 'utl/ajaxUtil', 'model/Config','common/confManager'],
  function ($, _, Backbone, UserParser, J2J, Communicator,RSVP, AjaxUtil, Config,ConfigManager) {
    'use strict';

    var instance = {};
    instance.getUserProfile = function (params) {
        var conf = ConfigManager.getConfig();
        var consumerApiUrl = conf.dtoServerUri + conf.apiRestUris.consumerTokenApiUrlPrefix;
        var promise = new RSVP.Promise(function (resolve, reject) {

      $.ajax(consumerApiUrl, {
        type: 'GET',
        headers: AjaxUtil.httpHeaders(),
        xhrFields: {'withCredentials': true},
        success: function (data) {
          var UserResult = J2J.transform(data, UserParser.user);
          resolve(UserResult);
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
