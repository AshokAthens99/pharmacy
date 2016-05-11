// ErrorHelper.js, v0.01
// Created By: Sameer Tandon
// Date: 03/17/2015
// This module defines a generic error handling strategy for RWD project for handling for incoming
// http error messages as well as custom error messages in the javascript project.
define(['backbone', 'utl/Communicator', 'model/errorHandler/errorMsgCollection', 'view/common/errorHandler',
        'jquery', 'helper/errorMsges/mdl/BusinessError', 'helper/errorMsges/mdl/HTTPResponseError'],
       function(Backbone, Communicator, ErrorMsgCollection, ErrorHandlerView, $, BusinessError, HTTPResponseError){
    'use strict';
    var instance = {};

    instance.init = function(iconf) {
        var component = {};
        iconf =  iconf  || {enableLogs:false};
        logMessage(iconf.enableLogs);
        // This listener captures any incoming message send to globalCh associted with event *ERROR:SHOW*.
        // The *ERROR:SHOW* event is used to display error messages on the page.
        Communicator.globalCh.comply('ERROR:SHOW',function(params){
           // if(console && console.log) console.log(params);
            var displayMessage, defaultMessage = new HTTPResponseError({httpResponseCode: 500});
            // Check if the no parameters are passed then set the default error code to 500
            params = (params === undefined || typeof params !== 'object')?defaultMessage:params;
            // Check if the incorrect parameters are passed then set the default error code to 500
            params = !(params instanceof HTTPResponseError || params instanceof BusinessError)?defaultMessage:params;

            params.dialog = (params.dialog === undefined )?false:params.dialog;
            // Check if the custom error object is passes then parse the errors and display the message
            if(params instanceof BusinessError) {
                displayMessage = parseMessage(params.messages);
            // Check if the http error object is passes then parse the errors and display the message
            } else if(params instanceof HTTPResponseError) {
                displayMessage = parseMessage(params.messages);
            }
            // Render Message on the HTML Page
            renderMessage(displayMessage, params.renderTo, params.dialog);
        });
        // This listener captures any incoming message send to globalCh associted with event *ERROR:HIDE*.
        // The *ERROR:HIDE* event is used to display error messages on the page.
        Communicator.globalCh.comply('ERROR:HIDE',function(params){
            var renderTo = (params === undefined)?undefined:params.renderTo;
            //
            if(renderTo && $(renderTo)) {
                $(renderTo).innerHTML = "";
            } else {
                //TODO: Send user to error page instead
              //  if(console.log)
               //     console.log('Invalid Params reject the request to show params');
            }
        });
        return component;
    }
    //
    function renderMessage(messages, renderTo, dialog) {
        var msgColl, errorCompView;

        if(typeof messages === 'object'){
            msgColl = (messages instanceof Array)?new ErrorMsgCollection(messages): new ErrorMsgCollection([messages]);
            var msgModel = new Backbone.Model({messageIconClass: "-system-error"});
            //
            if(dialog) {
                    errorCompView = new ErrorHandlerView({
                        model: msgModel,
                        collection: msgColl
                    });
                    errorCompView.render();
                    $("#pharmacy-center-modal").addClass("modal-showing");
                     $("body").find( "*" ).removeAttr('tabindex');
                    $("#pharmacy-center-modal").find("#errorContent").html(errorCompView.el);
                    $("#errorContent").attr('tabindex', -1).focus().css('outline', 'none');
                    $("#pharmacy-center-modal").find("#closeErrorModal, #errorDailogClose").click(function() {
                      $("#pharmacy-center-modal").removeClass("modal-showing");
                    });
            } else {
                if(renderTo && $(renderTo)) {
                    errorCompView = new ErrorHandlerView({
                        model: msgModel,
                        collection: msgColl,
                        el: renderTo});
                    errorCompView.render();
                } else {
                    errorCompView = new ErrorHandlerView({  model: msgModel,
                                                            collection: msgColl});
                    require('common/appManager').mainRegion.show(errorCompView);
                }
            }
        }
        if($('#pharmacy-center-loader'))
            $('#pharmacy-center-loader').hide();
    }
    //
    function parseMessage(messages) {
        if(messages){
            if(messages instanceof Array) {
                for(var index =0; index< messages.length; index++){
                    messages[index].message = getMessageFromResourceBundle(messages[index]);
                }
            } else {
                messages.message = getMessageFromResourceBundle(messages);
            }
        }
        return messages;
    }
    //
    function getMessageFromResourceBundle(message) {
        return (message.description!==undefined) ? message.description : "Service unavailable at this point of time. Please try later.";
    }
    function logMessage(enableLogs){
            // global error message for debugging
        if(enableLogs) {
            window.onerror = function(message, url, lineNumber) {};
        }
    }
    return instance;
});
