define([
    'backbone.marionette', 'view/locationsPckr/mapView', 'view/locationsPckr/locationLayout', 'view/locationsPckr/locationListView',
    'model/locations/locationCollection', 'serviceDelegate/fdsService', 'utl/Communicator',
    'view/locationsPckr/locationBtnView', 'helper/userProfile/userProfileHelper', 'rsvp', 'view/locationsPckr/showMoreLocationView',
    'common/locationManager','view/locationsPckr/stepIndicatorView','common/rules/dataValidation'
  ],
  function(Marionette, MapView, LocationLayout, LocationCompView,
    Locations, FDSService, Communicator, LocationBtnView, UserProfileHelper, RSVP, ShowMoreLocationView, LocationManager, StepIndicatorView,DataValidation) {
    'use strict';
    var _cachedLoc, _showMoreLoctionView, _stepIndicatorView, relativeId;
    var locationsPckrCntrl = Marionette.Controller.extend({
      showMap: function() {
        var region, subjectUser = UserProfileHelper.getBasicUser();

        if (subjectUser) {
          region = (subjectUser.region) ? subjectUser.region : "";
        }

        region = (region === 'MRN') ? 'NCA' : region;

        _showMoreLoctionView = new ShowMoreLocationView();
        _stepIndicatorView = new StepIndicatorView({});

        var ll = new LocationLayout();
        // fetch all the location
        var locationCompView = new LocationCompView({
          collection: new Locations()
        });
        var remainingCnt;
        var PickupCH = Communicator.pickupOrderCh;
        var _promiseLocation, itemCount;

        _promiseLocation = FDSService.loadLocations({
          queryParam: {
            region: region
          }
        });

        _promiseLocation.then(function(data) {
          relativeId = 'firstime';
          var showMoreLocations = LocationManager.showMoreData(data, relativeId);
          _cachedLoc = data;

          if(showMoreLocations && data){
            remainingCnt = data.length - showMoreLocations.length;
          }
          var mapView = new MapView({});

          var locationBtnView = new LocationBtnView({});

          ll.on('show', function() {

            if (showMoreLocations && !_.isEmpty(showMoreLocations)) {
              locationCompView.collection.reset(showMoreLocations);
              ll.showMoreLocRegion.show(_showMoreLoctionView);
              _showMoreLoctionView.setPageSize(remainingCnt);
              LocationManager.setLocationList(showMoreLocations);
            } else {
              locationCompView.collection.reset(data);
              ll.showMoreLocRegion.$el.hide(_showMoreLoctionView);
              LocationManager.setLocationList(data);
            }
            if(LocationManager.isFromLandingPage() == "false"){
              ll.step1Region.show(_stepIndicatorView);
              ll.locationBtnRegion.show(locationBtnView);
            }
            ll.mapViewRegion.show(mapView);
            ll.locationListRegion.show(locationCompView);

            mapView.loadMap();

          });
          require('common/appManager').mainRegion.show(ll);
        }, function(error) {
          Communicator.globalCh.command('ERROR:SHOW', error);
        });

        PickupCH.comply('showMoreLocation:location', function() {

          _promiseLocation = new RSVP.Promise(function(resolve, reject) {
            resolve(_cachedLoc)
          });

          _promiseLocation.then(function(data) {
            var showMoreLocations = LocationManager.showMoreData(data, relativeId);
            _cachedLoc = data;
            itemCount = remainingCnt;

            if(showMoreLocations && data){
              remainingCnt = data.length - showMoreLocations.length;
            }

            var mapView = new MapView({});
            var selectedLocation = LocationManager.fetchLocation($('input[name=locations]:checked').val());
            LocationManager.setRxsLocation(selectedLocation);
            if (showMoreLocations && !_.isEmpty(showMoreLocations)) {
              LocationManager.setLocationList(showMoreLocations);
              locationCompView.collection.reset(showMoreLocations);
              ll.showMoreLocRegion.show(_showMoreLoctionView);
              _showMoreLoctionView.setPageSize(remainingCnt);
              mapView.loadMap();
              var locSize = DataValidation.SHOW_MORE_LOCATION_SIZE;
              //if(data.length > locSize)
              //{
                _showMoreLoctionView.setLocationfocus(showMoreLocations.length-locSize);
              //}
            } else {
              LocationManager.setLocationList(data);
              locationCompView.collection.reset(data);
              mapView.loadMap();
              ll.showMoreLocRegion.$el.hide(_showMoreLoctionView);
              if(showMoreLocations && showMoreLocations.length == 0 && remainingCnt == data.length){
                  _showMoreLoctionView.setLocationfocus(data.length - itemCount);
              }


            }

          }, function(error) {
            Communicator.globalCh.command('ERROR:SHOW', error);
          });

        });

        PickupCH.comply('save:location', function(map) {
          Communicator.cartCh.command('ADD:PHARMACYLOCATION', map[0]);

          Backbone.history.navigate('#showPickupOrder', {
            trigger: true,
            replace: false
          });
        });

        PickupCH.comply('findByGeo:location', function() {
          LocationManager.clearData();
          var mapView = new MapView({});
          var promiseServiceObj = mapView.findByGeoLocation();
          promiseServiceObj.then(function(result) {
            var currentCity,currentZip;
            if(result.city) {
              currentCity = result.city;
            }
            if(result.zip) {
              currentZip = result.zip;
            }
            var promise = FDSService.loadLocations({
              queryParam: {
                region: region,
                query: currentCity,
                zip : currentZip
              }
            });
            promise.then(function(data) {
              relativeId = 'findByGeo';
              var showMoreLocations = LocationManager.showMoreData(data, relativeId);
              _cachedLoc = data;
              if(showMoreLocations && data){
                remainingCnt = data.length - showMoreLocations.length;
              }

              var mapView = new MapView({});

              if (showMoreLocations && !_.isEmpty(showMoreLocations)) {
                LocationManager.setLocationList(showMoreLocations);
                locationCompView.collection.reset(showMoreLocations);
                ll.showMoreLocRegion.$el.show(_showMoreLoctionView);
                _showMoreLoctionView.setPageSize(remainingCnt);
              } else {
                LocationManager.setLocationList(data);
                locationCompView.collection.reset(data);
                ll.showMoreLocRegion.$el.hide(_showMoreLoctionView);
              }

              mapView.loadMap();
            }, function(error) {
              Communicator.globalCh.command('ERROR:SHOW', error);
            });

          }, function(error) {
            Communicator.globalCh.command('ERROR:SHOW', error);
          });

        });

        PickupCH.comply('search:location', function(param) {
          LocationManager.clearData();
          var promise = FDSService.loadLocations({
            queryParam: {
              region: region,
              query: param
            }
          });
          promise.then(function(data) {

            relativeId = 'search';
            var showMoreLocations = LocationManager.showMoreData(data, relativeId);
            if(showMoreLocations && data){
              remainingCnt = data.length - showMoreLocations.length;
            }
            _cachedLoc = data;

            var mapView = new MapView({});
            if (data !== "-1") {
              if (showMoreLocations && !_.isEmpty(showMoreLocations)) {
                LocationManager.setLocationList(showMoreLocations);
                locationCompView.collection.reset(showMoreLocations);
                ll.showMoreLocRegion.$el.show(_showMoreLoctionView);
                _showMoreLoctionView.setPageSize(remainingCnt);
              } else {
                LocationManager.setLocationList(data);
                locationCompView.collection.reset(data);
                ll.showMoreLocRegion.$el.hide(_showMoreLoctionView);
              }
            } else {
              locationCompView.collection.reset("No Data.....");

              mapView = new MapView({
                data: ""
              });
            }
            mapView.loadMap();
          }, function(error) {
            Communicator.globalCh.command('ERROR:SHOW', error);
          });
        });

      }
    });
    return locationsPckrCntrl;
  });
