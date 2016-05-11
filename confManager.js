define(['backbone',
        'lodash', 'model/Config',
        'rsvp','utl/Communicator',
        'helper/userProfile/mdl/confMdl'
       ],
  function (Backbone,
            _,Config,
            RSVP,Communicator,
            ConnectionMdl) {
    'use strict';
    var instance = {}, confProfile, conf;
    instance.getConfig = function() {
      return _.clone(confProfile.get('config'), true);
    };
    instance.init = function(iconf) {
      confProfile = new ConnectionMdl({
         config: new Config(iconf)
       });
    };
    return instance;
});
