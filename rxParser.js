define(['lodash'], function(_) {
    'use strict';
    return {
        rxParserResponse: {
            PrescriptionDetails: [{
                root: "Prescriptions.PrescriptionDetails",
                data: {
                    "prescriptionName": "medicine.name",
                    "prescriptionNumber": function(obj) {

                        if (obj.pharmacyInfo) { // check for pharmacyInfo object, if null then return prescriptionNumber
                            if (obj.pharmacyInfo.detail.rxNumberNew) { // if pharmacyInfo object not null, then get rxNewNumber
                                return obj.pharmacyInfo.detail.rxNumberNew;
                            } else if (obj.pharmacyInfo.detail.rxNumber) { //if rxNewNumber is  null then get rxNumber
                                return obj.pharmacyInfo.detail.rxNumber;
                            }
                        } else {
                            return obj.prescriptionNumber;
                        }
                    },
                    "drugInfo": function(obj) {
                        return _.findWhere(obj.medicine.codes, {
                            'type': 'FDB'
                        })
                    },
                    "prescribedBy": "prescriber.consumerName",
                    "firstFill": "firstFill",
                    "prescribedOn": function(obj) {
                        var lastDateFormatRequired;
                        if(!_.isEmpty(obj.startDate)){
                          var lastDateFormatFromService = obj.startDate;
                          var lastDateAfterSplit  = lastDateFormatFromService.split('-');
                          lastDateFormatRequired = lastDateAfterSplit[1]+"/"+lastDateAfterSplit[2] + "/"+lastDateAfterSplit[0];
                        } else {
                          lastDateFormatRequired = 'N/A';
                        }

                          return lastDateFormatRequired;
                    },
                    "lastRefillDate": function(obj) {
                        var lastDateFormatRequired;
                        if(!_.isEmpty(obj.lastRefillDate)){
                          var lastDateFormatFromService = obj.lastRefillDate;
                          var lastDateAfterSplit  = lastDateFormatFromService.split('-');
                          lastDateFormatRequired = lastDateAfterSplit[1]+"/"+lastDateAfterSplit[2] + "/"+lastDateAfterSplit[0];
                        } else {
                          lastDateFormatRequired = 'N/A';
                        }

                          return lastDateFormatRequired;
                    },
                    "instructions": function(obj) {
                        return _.isEmpty(obj.consumerInstructions) ? 'N/A' : obj.consumerInstructions
                    },
                    "pharmacyInfo": function(obj) {
                        if (obj.pharmacyInfo) {
                            return {
                                "quantity": obj.pharmacyInfo.detail.quantity,
                                "coPayAmount": obj.pharmacyInfo.detail.coPayAmount,
                                "mailable": obj.pharmacyInfo.detail.mailable,
                                "nhinId": obj.pharmacyInfo.detail.nhinId,
                                "dispenseLocationCode": obj.pharmacyInfo.detail.dispenseLocationCode
                            };
                        } else {
                            return null;
                        }
                    },
                    "statusCodes": function(obj) {
                        if (obj.pharmacyInfo) {
                            return {
                                "rxDetailResponseCode": obj.pharmacyInfo.detail.statusCodes.rxDetailResponseCode,
                                "consumerResponseCode": obj.pharmacyInfo.detail.statusCodes.consumerResponseCode1,
                                "consumerResponseCodeType": obj.pharmacyInfo.detail.statusCodes.consumerResponseCodeType,
                                "refillable": obj.pharmacyInfo.detail.canOrderRx
                            }
                        } else {
                            return {
                                "rxDetailResponseCode": null,
                                "consumerResponseCode": null,
                                "consumerResponseCodeType": null,
                                "refillable": false
                            };
                        }
                    }
                }
            }]
        },
        searchRxParserResponse: {
            searchRxDetails: {
                "prescriptionName": function(obj) {
                    return obj.PharmacyDetails.out.Rx.detail.rxName
                },
                "mrn": function(obj) {
                    return obj.PharmacyDetails.out.Rx.detail.mrn
                },
                "prescriptionNumber": function(obj) {
                    if (obj.PharmacyDetails.out.Rx.detail.rxNumberNew) { // if pharmacyInfo object not null, then get rxNewNumber
                        return obj.PharmacyDetails.out.Rx.detail.rxNumberNew;
                    } else if (obj.PharmacyDetails.out.Rx.detail.rxNumber) { //if rxNewNumber is  null then get rxNumber
                        return obj.PharmacyDetails.out.Rx.detail.rxNumber;
                    }
                },
                "pharmacyInfo": function(obj) {
                    return {
                        "quantity": obj.PharmacyDetails.out.Rx.detail.quantity,
                        "coPayAmount": obj.PharmacyDetails.out.Rx.detail.coPayAmount,
                        "mailable": obj.PharmacyDetails.out.Rx.detail.mailable,
                        "nhinId": obj.PharmacyDetails.out.Rx.detail.nhinId,
                        "dispenseLocationCode": obj.PharmacyDetails.out.Rx.detail.dispenseLocationCode
                    };
                },
                "statusCodes": function(obj) {
                    return {
                        "rxDetailResponseCode": obj.PharmacyDetails.out.Rx.detail.statusCodes.rxDetailResponseCode,
                        "consumerResponseCode": obj.PharmacyDetails.out.Rx.detail.statusCodes.consumerResponseCode1,
                        "consumerResponseCodeType": obj.PharmacyDetails.out.Rx.detail.statusCodes.consumerResponseCodeType,
                        "refillable": obj.PharmacyDetails.out.Rx.detail.canOrderRx
                    }
                },
                "person": function(obj) {
                    if (obj.PharmacyDetails.out.Rx.detail.memberName) {
                        return {
                            "firstName": obj.PharmacyDetails.out.Rx.detail.memberName.firstName,
                            "lastName": obj.PharmacyDetails.out.Rx.detail.memberName.lastName,
                            "middleName": obj.PharmacyDetails.out.Rx.detail.memberName.middleName
                        };
                    } else {
                        return {
                            "firstName": '',
                            "lastName": '',
                            "middleName": ''
                        };
                    }
                }
            }
        }
    }
});
