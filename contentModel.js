define(['backbone'], function (BackBone) {
    "use strict";
    var contentModel = BackBone.Model.extend({  
       defaults: {
          thankyouContent : undefined
       }
    });
    return contentModel;
});
