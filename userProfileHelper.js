define(['lodash','rsvp','kp-user-profile'],
  function (_,RSVP,KPUserProfile) {
    'use strict';
    var UserProfileClient = KPUserProfile.UserProfileClient;

    var instance = {};

    instance.getProxies = function() {
        return UserProfileClient.getProxies();
    };

    instance.getFamilySpec = function(){

        var subjectUser = UserProfileClient.getUser();
        var proxyUsers  = UserProfileClient.getProxies();

        var subjs = [];
        if (subjectUser && subjectUser.isMember) {
              subjs.push({
                'subjId'    : subjectUser.guid,
                'type'      : 'GUID',
                'relId'     : null,
                'name'      : subjectUser.firstName +' '+subjectUser.lastName,
                'isNmaUser' : false,
                'isSelf'    : true
              });
        }
        if (proxyUsers) {
          _.each(proxyUsers, function (proxy) {
             subjs.push({
              'subjId'      : proxy.id,
              'type'        : proxy.type,
              'relId'       : proxy.relationshipID,
              'name'        : proxy.name,
              'isNmaUser'   : false,
              'isSelf'      : false
            });
          }, this);
        }

      return _.clone(subjs, true);

    };

    instance.hasEntitlement = function(params) {
          return UserProfileClient.hasEntitlement(params.code,params.relId);
    };

    instance.getBasicUser= function() {
        return UserProfileClient.getUser();
    };


    instance.isMember = function() {
        return UserProfileClient.getUser().isMember;
    };
    instance.getRegion= function() {
      return UserProfileClient.getUser().region;
    };

    instance.init = function() {
        var promise = new RSVP.Promise(function (resolve, reject) {
            UserProfileClient.load().then(function (data) {
              resolve(data);
            }, function (error) {
                  reject("Error");
            });
        });
        return promise;
    };

    return instance;
});
