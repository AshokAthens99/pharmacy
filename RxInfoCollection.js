define(['backbone', 'model/rx/RxInfo'], function (BackBone, RxInfo) {
    "use strict";
    // definition for rx domain, with default example of data structure
    var RxInfoCollection = BackBone.Collection.extend({
        model: RxInfo
    });
    return RxInfoCollection;
});