define([
        'backbone.marionette',
        'view/searchByRxPage/searchByRxInputView','view/searchByRxPage/searchByRxLayout', 'view/searchByRxPage/searchByRxResultView',
        'view/searchByRxPage/searchByRxRsltPgBtnView','utl/Communicator','serviceDelegate/pharmacyDetailsService',
        'helper/errorMsges/mdl/BusinessError','model/prescription/rxCollection','common/cartManager',
        'view/searchByRxPage/searchByRxHeaderView','helper/userProfile/userProfileHelper',
    ],
    function(Marionette,
        SearchByRxInputView, SearchByRxLayout, SearchByRxResultView,SearchByRxRsltPgBtnView,
        Communicator,PhcDetailsSrvc,BusinessError,RxCollection,CartManager,SearchByRxHeaderView,UserProfileHelper) {
      'use strict';
      var _searchRxCh = Communicator.searchByRxCh;
      var _searchByRxLayout, _searchByRxInputView, _searchByRxResultView,_searchByRxRsltPgBtnView,_searchByRxHeaderView;

      var searchByRxCntrl = Marionette.Controller.extend({

      findRx: function() {
        var _this = this;
        _searchByRxLayout         = new SearchByRxLayout();
        _searchByRxInputView      = new SearchByRxInputView();
        _searchByRxRsltPgBtnView  = new SearchByRxRsltPgBtnView();
        _searchByRxHeaderView     = new SearchByRxHeaderView();

        _searchByRxLayout.on('show', function() {
          _searchByRxLayout.searchHeaderRegion.show(_searchByRxHeaderView);
          _searchByRxLayout.searchInputRegion.show(_searchByRxInputView);

          if (!CartManager.isSearchListEmpty()) {
            _searchByRxResultView = CartManager.getSearchView(_searchByRxResultView);
            _searchByRxLayout.searchResultRegion.show(_searchByRxResultView);
            _searchByRxLayout.searchResultPgBtnRegion.show(_searchByRxRsltPgBtnView);
            _searchByRxRsltPgBtnView.showCartSizeCntOnGoToCartBtn(CartManager.getCartSize());
          }

        });

        _searchByRxResultView = new SearchByRxResultView({
          collection: new RxCollection()
          });

        _searchRxCh.comply('remove:searchRx', function(searchRxKey) {
          var response = CartManager.removeFromSearchList(searchRxKey);
          if (response) {
            _searchByRxResultView = CartManager.getSearchView(_searchByRxResultView);
            _searchByRxLayout.searchResultRegion.show(_searchByRxResultView);
          }
        });

        _searchRxCh.comply('result:searchRx', function(query) {

          var isRxFoundToThisUser = CartManager.checkRxInSearchCollection(query);
          if (isRxFoundToThisUser) {

            var errorMsg = {
                code: 'already.in.searchList',
                description: 'Entered Prescription Number exists in search list'
            }
            $('#searchErrorMsg')[0].innerHTML = errorMsg.description;
            $("body").find( "*" ).removeAttr('tabindex');
            $('#searchErrorMsg').attr('tabindex', -1).focus().css('outline', 'none');


          } else {
              var promise = PhcDetailsSrvc.findByRx(query);
              promise.then(function(data) {
                if (data.errors) {
                  $('#searchErrorMsg')[0].innerHTML = data.errors.description;
                  $("body").find( "*" ).removeAttr('tabindex');
                  $('#searchErrorMsg').attr('tabindex', -1).focus().css('outline', 'none');
                  if(data.errors.code == 2016) {
                    var promise = UserProfileHelper.init();
                    promise.then(function() {

                        resolve(true);

                    }, function(error) {
                        Communicator.globalCh.command("ERROR:SHOW", error);
                    });
                  }
                } else {
                    _this.manageSearchResult(data.detail[0],query);
                    _searchByRxResultView = CartManager.getSearchView(_searchByRxResultView);
                    _searchByRxLayout.searchResultRegion.show(_searchByRxResultView);
                    _searchByRxLayout.searchResultPgBtnRegion.show(_searchByRxRsltPgBtnView);
                    _searchByRxLayout.searchResultRegion.$el.show();
                    _searchByRxLayout.searchResultPgBtnRegion.$el.show();
                    _searchByRxRsltPgBtnView.showCartSizeCntOnGoToCartBtn(CartManager.getCartSize());
                  }
                }, function(error) {
                  var errorMsg;
                  if (error.httpResponseCode === 403) {
                      errorMsg = {
                          code: 2001,
                          description: 'Access to the requested feature not allowed for this viewer'
                      }
                          $('#searchErrorMsg').innerHTML = errorMsg.description;
                          $("body").find( "*" ).removeAttr('tabindex');
                          $('#searchErrorMsg').attr('tabindex', -1).focus().css('outline', 'none');

                  } else {
                      Communicator.globalCh.command('ERROR:SHOW', error);
                  }

              });
            }

        });

        _searchRxCh.comply('input:searchRx', function() {
          _searchByRxLayout.searchInputRegion.$el.show();
          _searchByRxLayout.searchResultRegion.$el.show();
        });
        require('common/appManager').mainRegion.show(_searchByRxLayout);
      },
      manageSearchResult : function(rx,query) {
        CartManager.addItemstoSearchCollection(rx,query);
      }
    });
  return searchByRxCntrl;
});
