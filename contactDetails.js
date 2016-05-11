define(['backbone'], function (BackBone) {
    "use strict";
    var ContactDetails = BackBone.Model.extend({
       defaults: {
                  daytime:'',
                  evening:'',
                  email:''
       }
    });
    return ContactDetails;
});
