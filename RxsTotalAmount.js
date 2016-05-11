define(['backbone'], function (BackBone) {
    "use strict";
    // definition for facility domain, with default example of data structure
    var TotalAmount = BackBone.Model.extend({
        defaults: {
            rxsTotal: 0
        },
       initialize: function () {
        },
        validate: function (atts, ops) {}
    });
    return TotalAmount;
});