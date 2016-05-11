define([
    'backbone',
    'backbone.marionette',
    'cntrl/routeCntrlManager',
    'helper/errorMsges/ErrorHelper',
    'helper/cart/CartHelper',
    'helper/userProfile/userProfileHelper',
    'utl/Communicator',
    'rsvp',
    'jquery',
    'helper/content/contentHelper',
    'utl/ajaxUtil',
    'helper/webTrends/webTrendsClient',
    './appRoutes',
    'common/confManager'
], function(Backbone, Marionette, RouteCntrlManager, ErrorHelper,
    CartHelper, UserProfileHelper, Communicator, RSVP,
    $, ContentHelper, AjaxUtil, WebTrendsClient, AppRoutes, ConfigManager) {
    'use strict';
    var App;

    // Define Rx-Center Application
    App = new Marionette.Application({
        name: "Pharmacy Center"
    });
    // Add application regions here (Div tag in index.html) Starting point for html rendering (Parent tag)
    App.addRegions({
        mainRegion: '#pharmacy-center-container'
    });
    //
    App.Router = Marionette.AppRouter.extend({
        appRoutes: AppRoutes
    });
    // Add application initializers here. starting Point of the Application
    App.addInitializer(function() {
        new App.Router({
            controller: new RouteCntrlManager()
        });
    });
    //
    App.on("start", function(param) {

        // load configuration file + user details + content + cart cache details
        ConfigManager.init(param.conf);
        var conf = ConfigManager.getConfig();
        ErrorHelper.init(conf);
        AjaxUtil.init({
            conf: conf
        });

        var userPromise = UserProfileHelper.init();
        var contentPromise = ContentHelper.init();
        var cartPromise = CartHelper.init();

        RSVP.all([userPromise, contentPromise, cartPromise]).then(function(results) {
            WebTrendsClient.init();
            try {
                if (Backbone.history) {
                    Backbone.history.start();
                }
            } catch (e) {
                // eat away exception, take user to landing page
               /* if (console.log) {
                    console.log('appManager:App.on:exception occured in Backbone.history.start::');
                    console.log(e);
                }*/
            } finally {
                // As per business requirements , RX shoudl always start from Landign Page
                Backbone.history.navigate('#landingPage', {
                    trigger: true,
                    replace: false
                });
            }
        }, function(error) {
            Communicator.globalCh.command("ERROR:SHOW", error);
        });
        //
    });

    return App;
});
