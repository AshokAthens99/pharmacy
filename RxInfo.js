define(['backbone'], function (BackBone) {
    "use strict";
    // definition for facility domain, with default example of data structure
    var RxInfo = BackBone.Model.extend({
        initialize: function () {
        },
        defaults: {
            memberName: null,
            rxsArray : null
        }
    });
    return RxInfo;
});
