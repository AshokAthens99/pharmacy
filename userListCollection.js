define(['backbone', 'model/prescription/userList'], function (BackBone, UserList) {
    "use strict";
    var userListCollection = Backbone.Collection.extend({
        model: UserList,
        initialize: function () {}
    })
    return userListCollection;
});
