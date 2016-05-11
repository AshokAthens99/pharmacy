define(['common/rules/dataValidation', 'helper/userProfile/userProfileHelper','utl/Communicator'],
       function(rulesEnum, UserProfileHelper, Communicator) {
    'use strict';
    var instance = {};
    instance.isOrderShippmentAllowedForState = function(stateCd) {
        var userRegion = UserProfileHelper.getBasicUser().region;
        var rule = rulesEnum.ADDRESS.RULES.OUT_OF_STATE[userRegion.toUpperCase()];
        //
        if(rule !== undefined) {
            if(_.contains(rule, stateCd.toUpperCase())) {
                return true;
            }
            else{ return false;}
        }
        return true;
    };
    instance.isNotificationEnabled = function(mode) {
        var user = UserProfileHelper;
        var rules = rulesEnum.NOTIFICATION.RULES.ENABLED[user.getBasicUser().region.toUpperCase()];
        //
        if(rules !== undefined) {
            var rule = rules[mode];
            if(rule.allowed === true) {
                if(rule.isPilot === false){
                    return true;
                } else if (user.hasEntitlement(rulesEnum.NOTIFICATION.RULES.PILOT_ENTITLEMENT)) {
                    return true;
                }
            }
        }
        return false;

    };

    instance.getValidationRules = function(ruleType) {
        var usrRegion = (UserProfileHelper.getBasicUser().region).toUpperCase();
        if(ruleType === instance.RULE_TYPE.ADDRESS) {
            if(rulesEnum.ADDRESS.VALIDATIONS[usrRegion]) {
                return rulesEnum.ADDRESS.VALIDATIONS[usrRegion];
            } else {
                return rulesEnum.ADDRESS.VALIDATIONS.ALL;

            }
        }
        else if(ruleType === instance.RULE_TYPE.NOTIFICATION) {
            return rulesEnum.NOTIFICATION.VALIDATION;
        }
        else if(ruleType === instance.RULE_TYPE.SPECIAL_INSTRUCTION) {
            return rulesEnum.SPCL_INSTRN_VALIDATION[usrRegion].max;
        }
        else if(ruleType === instance.RULE_TYPE.STATES) {
            return rulesEnum.ADDRESS.STATES;
        }

    };
    instance.RULE_TYPE = {
                ADDRESS: 'address',
                SPECIAL_INSTRUCTION: 'specialInstruction',
                NOTIFICATION:'notifications',
                STATES:'states'
    };

    return instance;
});
