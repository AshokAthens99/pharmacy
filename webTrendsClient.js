define(['lodash','webtrends-client', 'utl/Communicator', 'helper/userProfile/userProfileHelper','common/confManager'],
       function(_, WebtrendsClient, Communicator, UserProfileHelper,ConfigManager) {
    'use strict';
    var instance = {};
    var webtrendsClient;

    function initWebTrends() {
        var user = UserProfileHelper.getBasicUser();
        var conf = ConfigManager.getConfig();
        webtrendsClient = new WebtrendsClient({
            // App name as defined by the webtrends team
            appName: conf.webtrendsAppName,
            // Webtrends configuration key as provided by webtrends team
            key: conf.webtrendsApiKey,
            membershipPlanGroupId: user.memberShipPlanPurchaseId,
            membershipAccountEnrollmentUnit: user.memberShipAccountEnrollmentUnit,
            region: user.region,
            isNMA: (user.isMember)?'Member':'Non Member',
            guid: user.guid,
            age: user.age,
            gender: user.gender
        });
    }

    instance.init = function() {
        initWebTrends();
        Communicator.globalCh.comply('WEB:ANALYTICS:MESSAGE', function(data) {
            var webTrendsData = {
                proxy:  'self',
                eventType: data.eventType,
                pageSection: data.pageSection,
                actionCode: 63
            };
            addUserAction(webTrendsData, data.userAction);
            webtrendsClient.triggerEvent(webTrendsData);
        });
        Communicator.globalCh.comply('WEB:ANALYTICS:PROCESS', function(data) {
            var webTrendsData = {
                proxy:  'self',
                eventType: data.eventType,
                pageSection: data.pageSection,
                process: data.process,
                actionCode: 66
            };
            if(data.userAction){
                addUserAction(webTrendsData, data.userAction);
                webtrendsClient.triggerProcessEvent(webTrendsData);
            }
            else{
                   webtrendsClient.triggerProcessEvent(webTrendsData);
            }
        });

        function addUserAction(webTrendsData, userAction) {
            var keyAlias = 'kp_userAction_';
            if(_.isArray(userAction)){
                _.each(userAction,function(ua){
                    webTrendsData[(keyAlias + ua.key)] = ua.value;
                });
            }else{
               webTrendsData[(keyAlias + userAction.key)] = userAction.value;
            }
        }
    };
    return instance;
});
