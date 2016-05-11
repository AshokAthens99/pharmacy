define(['backbone'], function (BackBone) {
    "use strict";
    var notificationMdl = BackBone.Model.extend({  
       default: {
         rxEmailAlert : true,
         rxTextAlert : true,
         email : '',
         mobile : ''
       },
        initialize: function () {
        },
    });
    return notificationMdl;
});	