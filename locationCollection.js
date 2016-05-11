define(['backbone', 'model/locations/location'], function (BackBone, Location) {
    "use strict";
    var Locations = Backbone.Collection.extend({
        model: Location,

        initialize: function () {}
    })
    return Locations;
});
