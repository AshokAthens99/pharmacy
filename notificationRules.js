define(['common/rules/dataValidation', 'helper/userProfile/userProfileHelper' ], 
       function(RulesEnum, UserProfileHelper) {
    var instance = {};
    
    instance.isNotificationAllowed = function() {
        var regionCd =  UserProfileHelper.getRegion();
        
        //var rules = _.find(RulesEnum.NOTIFICATION.REDERING_RULE, regionCd);
        
        
        return false;   
    };
    
    return instance; 
});