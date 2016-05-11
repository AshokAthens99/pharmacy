define(['backbone'], function (BackBone) {
    "use strict";
    var Location = Backbone.Model.extend({
        defaults: {
            id: '',
            official_name: '',
            address: {
                building_name: '',
                street: '',
                city: '',
                zip: '',
                state:'',
                phone_number:''
            }
        }
    });
    return Location;
});
