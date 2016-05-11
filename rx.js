define(['backbone'], function (BackBone) {
    "use strict";
    var Rx = Backbone.Model.extend({
      defaults: {
          prescriptionName    : '',
          instructions        : '',
          lastRefillDate      : '',
          prescribedBy        : '',
          prescribedOn        : '',
          drugInfo            : '',
          prescriptionNumber  : '',
          mrn                 : '',
          pharmacyInfo        :{
            quantity          : '',
            mailable          : false
          },
          statusCodes:{
            refillable        : false,
            statusDescription : ''
          },
          rxBtnClass          : '',
          rxBtnLbl            : '',
          isExistInCart       : false,
          pickUpInstruction   : '',
          addedToCart         : ''
      }
    });
    return Rx;
});
