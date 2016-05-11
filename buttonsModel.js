define(['backbone'], function (BackBone) {
    "use strict";
    var ButtonsModel = BackBone.Model.extend({  
       defaults: {
          enablePlaceOrderBtn : true,
          specialInstructions : undefined
       }
    });
    return ButtonsModel;
});
