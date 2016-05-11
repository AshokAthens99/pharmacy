define(['backbone', 'model/errorHandler/errorMsg'], function (BackBone, ErrorMsg) {
  "use strict";
  var ErrorMsgCollection = BackBone.Collection.extend({
    model: ErrorMsg
  });
  return ErrorMsgCollection;
});
