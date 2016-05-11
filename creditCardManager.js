define(['jquery', 'lodash', 'helper/content/contentHelper', 'helper/userProfile/userProfileHelper', 'utl/Communicator','serviceDelegate/addCardService'],
  function($, _, ContentHelper, UserProfileHelper, Communicator,AddCardService) {
    'use strict';

    instance.addCard = function() {
      Communicator.creditCardCh.comply('add:card', function(cardModel) {
        var ccObj = {
          cardType: cardModel.get('cardType'),
          persistenceIndicator: cardModel.get('persistenceIndicator'),
          pan: cardModel.get('cardNumber'),
          expiration: ''
        };
        var split = cardModel.get('expirationDate').split('/');
        ccObj.expiration = split[1].substring(2) + '' + split[0];
        var promise = AddCardService.addCard(ccObj); //ajax to dba
        promise.then(function(data) { //response came back
          if (data.error) {
            Communicator.globalCh.command("ERROR:SHOW",
              new BusinessError({
                messages: data.error,
                renderTo: "#cardInput-page-err-msg"
              }));
          } else {
            cardModel.set('token', JSON.parse(data.data).token);
            var originalcardNumber = cardModel.attributes.cardNumber;
            var last4DigitcartNumber = (originalcardNumber) ? originalcardNumber.substring(originalcardNumber.length - 4, originalcardNumber.length) : originalcardNumber;
            cardModel.attributes.cardNumber = last4DigitcartNumber;
            Communicator.cartCh.command('SAVE:CREDIT_CARD', cardModel.attributes);
            if (ccObj.persistenceIndicator === 'P') {
              Communicator.cartCh.command('SAVE:CARD_ON_FILE', cardModel.attributes);
            }
            ccInputView.model.set(cardModel.toJSON());
            var ccListView = new CreditCardListView({
              model: cardModel,
              isInterrupt: false
            });
            creditCardLayout.ccInputRegion.$el.hide();
            creditCardLayout.ccListRegion.show(ccListView).$el.show();
          }

        }, function(error) {
          Communicator.globalCh.command('ERROR:SHOW', error);
        });

      });

    }

instance.cancelCard = function() {
  Communicator.creditCardCh.comply('cancel:card', function(cardModel) {
      var ccFromCache = Communicator.cartCh.request('GET:ORDER');
      if (ccFromCache && ccFromCache.creditCard) {
          cardModel.set('token', null);
          var originalcardNumber = cardModel.attributes.cardNumber;
          var last4DigitcartNumber = (originalcardNumber) ? originalcardNumber.substring(originalcardNumber.length-4,originalcardNumber.length) : originalcardNumber;
          cardModel.attributes.cardNumber = last4DigitcartNumber;

          Communicator.cartCh.command('SAVE:CREDIT_CARD', cardModel.attributes);
          Communicator.cartCh.command('SAVE:CARD_ON_FILE', cardModel.attributes);
          Backbone.history.navigate('#editCreditCard/' + previousPage, {
              trigger: true,
              replace: false
          });
      } else {
          var cartItems = Communicator.cartCh.request('GET:ORDER');
          if (cartItems) {
              var cartSize = _.toArray(cartItems.rxItems).length;
              if (cartSize > 0) {
                  $("body, #cc-my-modal").addClass("modal-showing");
                  $("#ok").click(function() {
                      Communicator.cartCh.command('DEL:CART', {
                          deleteRxs: true,
                          onSuccess: 0
                      });
                      Backbone.history.navigate('prescriptions/ship/editCreditCard', {
                          trigger: true,
                          replace: false
                      });
                  });
                  $(".modal-close, #cancel").click(function() {
                      $("body, #cc-my-modal").removeClass("modal-showing");
                      $("body").css("overflow", "scroll");
                  });
              } else {
                  Communicator.cartCh.command('DEL:CART', {
                      deleteRxs: true,
                      onSuccess: 0
                  });
                  Backbone.history.navigate('prescriptions/ship/editCreditCard', {
                      trigger: true,
                      replace: false
                  });
              }
          }
      }
  });

}

  });
