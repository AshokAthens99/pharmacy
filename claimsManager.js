define(['lodash', 'model/prescription/userListCollection',
  'utl/Communicator', 'rsvp', 'helper/errorMsges/mdl/BusinessError', 'common/rules/dataValidation',
  'serviceDelegate/trialClaimService', 'helper/userProfile/userProfileHelper'
], function(_, UserListCollection,
  Communicator, RSVP, BusinessError, DataValidation, TrialClaimService, UserProfileHelper) {
  'use strict';
  var instance = {};
  var claimsData;
  var totalCost = 0;
  var ifTotal = true;

  instance.setClaims = function(data) {
    claimsData = data;
  }

  instance.getClaims = function() {
    return claimsData;
  }

  instance.ifTotalEstimate = function() {
    return ifTotal;
  }

  instance.claimsInit = function(dmethod) {
    var promise = TrialClaimService.getClaims("INIT", dmethod);
    promise.then(function(data) { //response came back
      if (data.error) {
        Communicator.globalCh.command("ERROR:SHOW",
          new BusinessError({
            messages: data.error,
            renderTo: "#cardInput-page-err-msg"
          }));
      }
    });

  }

  instance.claimsFetch = function(dmethod) {
    var promise = TrialClaimService.getClaims("FETCH", dmethod);
    var _this = this;
    promise.then(function(data) { //response came back
      if (data.error) {
        Communicator.globalCh.command("ERROR:SHOW",
          new BusinessError({
            messages: data.error,
            renderTo: "#cardInput-page-err-msg"
          }));
      } else {
        var claimsList = [];
        _.each(data.claims, function(claim) {
          _.each(claim.claimDetailsArray, function(claimDetail) {
            var cliability;
            if (claimDetail.rxClaimListArray != null)
              cliability = claimDetail.rxClaimListArray.rxPrimaryClaim.claimLiability;
            else
              cliability = null;
            var rxNum = claimDetail.rxNumber;
            claimsList.push({
              "rxNumber": rxNum,
              "claimLiability": cliability
            });
          });
        });
        _this.setClaims(claimsList);
        goToNextPage(claimsList);

      }
    });

  }

  function goToNextPage(claimsList) {
    var cartItems = Communicator.cartCh.request('GET:CARTITEMS');
    var ifpayment = true;
    var totalClaim = 0;
    _.each(claimsList, function(claim) {
      if (claim.claimLiability != "undefined" && claim.claimLiability != null) {
        ifpayment = true;
        claim.claimLiability = Number(claim.claimLiability);
        totalClaim += claim.claimLiability;
      } else {
        claim.claimLiability = 'N/A';
        var copay = _.find(cartItems, function(obj) {
          return (obj.prescriptionNumber == claim.rxNumber)
        }).amount;
        if (copay != "undefined" && copay != null && !_.isEmpty(copay)) {
          totalClaim += copay;
          ifpayment = true;
        } else {
          ifpayment = false;
        }
      }
    });

    Communicator.addressCh.command('ship:address', (ifpayment && totalClaim != 0));

  }



  instance.addClaimsByUser = function(itemsGroupByUser) {
    var _this = this;
    totalCost = 0;
    _.each(itemsGroupByUser, function(itemByUser) {
      _.each(itemByUser.rxs, function(rxs) {
        var claim = _.findWhere(_this.getClaims(), {
          'rxNumber': Number(rxs.prescriptionNumber)
        });
        rxs.estimatedCost = claim.claimLiability;
        if (rxs.estimatedCost != 'N/A')
          totalCost += Number(rxs.estimatedCost);
        else {
          ifTotal = false;
        }
      });
    });
    return itemsGroupByUser;

  }


  instance.getEstimatedTotal = function() {
    return totalCost.toFixed(2);
  }

  instance.isClaimsEnabled = function(flowMode) {
    var isClaimsEnabled;
    if (flowMode === 'byMail')
      isClaimsEnabled = DataValidation.COST_ESTIMATE.RULES.ENABLED[UserProfileHelper.getRegion()].US_MAIL.allowed;
    else if (flowMode === 'pickup')
      isClaimsEnabled = DataValidation.COST_ESTIMATE.RULES.ENABLED[UserProfileHelper.getRegion()].PICKUP.allowed;
    return isClaimsEnabled
  }

  return instance;
});
