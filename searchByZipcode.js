define(['lodash', 'rsvp'],
    function(_, RSVP) {
        'use strict';
        var instance = {};

        instance.searchByZipCode = function(params) {
            var googleURI = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + params.zipCode + '&sensor=true';
            var promise = new RSVP.Promise(function(resolve, reject) {

                $.ajax(googleURI, {
                    type: 'GET',
                    success: function(data) { //  (data, status, xhr)
                        var state, city,country, searchResponse;
                        if (data.results[0]) {
                          _.each(data.results[0].address_components, function(addr) {
                              if (addr.types[0] === 'locality') {
                                  city = addr;
                              }
                              else if (addr.types[0] === 'administrative_area_level_1') {
                                  state = addr;
                              }
                              else if (addr.types[0] === 'country') {
                                country = addr;
                              }
                          });
                        }


                        if(country && country.long_name === 'United States'){
                          searchResponse = {
                              city  : (city)  ? city.long_name    : undefined,
                              state : (state) ? state.short_name  : undefined

                          };
                        }
                        resolve(searchResponse);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        reject({
                            httpResponse: {
                                code: xhr.status,
                                message: thrownError
                            }
                        });
                    }
                });
            });

            return promise;
        };
        instance.validateAddress = function(params) {
            var googleURI = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + params.zipCode + '&sensor=true';
            var promise = new RSVP.Promise(function(resolve, reject) {

                $.ajax(googleURI, {
                    type: 'GET',
                    success: function(data) { //  (data, status, xhr)
                        var state, city,country,zipCode, searchResponse;
                        if (data.results[0]) {
                          _.each(data.results[0].address_components, function(addr) {
                              if (addr.types[0] === 'locality' && params.city.toUpperCase().trim() === addr.long_name.toUpperCase().trim()) {
                                  city = addr;
                              }
                              else if (addr.types[0] === 'postal_code' && params.zipCode === addr.long_name) {
                                  zipCode = addr;
                              }
                              else if (addr.types[0] === 'administrative_area_level_1' && params.stateCode === addr.short_name) {
                                  state = addr;
                              }
                              else if (addr.types[0] === 'country') {
                                country = addr;
                              }
                          });
                        }


                        if(city && state && zipCode && country && country.long_name === 'United States'){
                          resolve(true);
                        }else {
                          resolve(false);
                        }

                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        reject({
                            httpResponse: {
                                code: xhr.status,
                                message: thrownError
                            }
                        });
                    }
                });
            });

            return promise;
        };
       return instance;
    });
