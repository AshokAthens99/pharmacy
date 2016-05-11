define(['backbone'], function (BackBone) {
    'use strict';
    // definition for facility domain, with default example of data structure
    var Address = BackBone.Model.extend({
       defaults: {
           addressId: '',
           firstName:'',
           middleInitial:'',
           lastName:'',
           addressLine1: '',
           addressLine2: '',
           city: '',
           state: '',
           zip5: '',
           preffered: false,
           type:'SHIPPING',
           label:'',
           isNew:true,
           isDelete: false,
           sourceSystem: 'RWD_MBR'
       }
    });
    return Address;
});
