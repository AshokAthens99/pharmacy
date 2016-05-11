define(['backbone','model/prescription/rxCollection'], function (BackBone,RxCollection) {
    "use strict";
    var UserList = Backbone.Model.extend({
      defaults: {
          firstName           : '',
          lastName            : '',
          middleName          : '',
          rxs                 : new RxCollection()
        }
    });
    return UserList;
});
