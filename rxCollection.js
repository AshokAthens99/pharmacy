define(['backbone', 'model/prescription/rx'], function (BackBone, Rx) {
    "use strict";
    var rxCollection = Backbone.Collection.extend({
        model: Rx,
        initialize: function () {}
    })
    return rxCollection;
});
