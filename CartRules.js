define(['utl/Communicator','lodash','common/rules/dataValidation','helper/content/contentHelper','helper/userProfile/userProfileHelper'],
       function(Communicator,_, RulesConfig, ContentHelper, UserProfileHelper){
    'use strict';
    var instance = {};
    //
    instance.executeRules = function (cartItems, currItem) {
        var userProfile = UserProfileHelper;
        var userRegion = userProfile.getRegion();
        var value = {hasErrors: false, messages: []};
        //
        executeMaxCartSizeRule(value, cartItems, userRegion);
        //
        if(!userProfile.isMember()) {
            value = executeSameProxyRule(value, cartItems, currItem);
        }

        return value;
    };
    //
    function executeSameProxyRule(value, cartItems, currItem) {
        if(ContentHelper.getContentNode().LABELS){
            var oneMemberOnly = ContentHelper.getContentNode().LABELS['messages.oneMemberOnly'];
        }
        if(cartItems && _.keys(cartItems).length > 0) {

            if( !_.findKey(cartItems,{usrId:currItem.usrId})) {
                setErrorMessage(value, 'multiple.usr.not.allowed.nma', oneMemberOnly) ;
            }
        }
        return value;
    }
    //
    function executeMaxCartSizeRule(value, cartItems, region) {
        var maxsize = RulesConfig.CART_SIZE_REGION[region]?RulesConfig.CART_SIZE_REGION[region]:RulesConfig.CART_SIZE_REGION['OTHER'];
     if(ContentHelper.getContentNode().LABELS){
            var maxCart = ContentHelper.getContentNode().LABELS['messages.maxCartSize'];
            var maxCartLimit = maxCart.replace ('#', maxsize);
          }
        if(maxsize <= _.keys(cartItems).length) {
            setErrorMessage(value, 'max.cart.size', maxCartLimit) ;
        }
    }
    //
    function setErrorMessage(value, code, message) {
        value.hasErrors = true;
        value.messages.push({
            code:code,
            description: message
        }) ;
    }
    //
    return instance;
});
