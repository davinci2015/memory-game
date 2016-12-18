var BRAINYMO = BRAINYMO || {};


BRAINYMO.Game = (function() {

    return function(config) {

        this.startGame = function() {
            var card = new BRAINYMO.Card();

            card.attachCardEvent();
            card.generateCards(config.cards);
        };

        this.startGame();
    }

})();



BRAINYMO.Card = (function () {

    var $cardsContainer = $('.cards-container');
    var $cardTemplate = $cardsContainer.find('#card-template');
    
    function prepareCardTemplate (card) {
        var template = $cardTemplate.clone().removeAttr('id').removeClass('hide');
        template.find('.back').css({
            'background': 'url(' + card.backImg + ') no-repeat center center',
            'background-size': 'cover'
        });
        return template;
    }

    function shuffleCards(cardsArray) {
        var currentIndex = cardsArray.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cardsArray[currentIndex];
            cardsArray[currentIndex] = cardsArray[randomIndex];
            cardsArray[randomIndex] = temporaryValue;
        }

        return cardsArray;
    }

    function appendCardsToDOM(cards) {
        var templates = [];
        var preparedTemplate;

        cards.forEach(function (card) {
            preparedTemplate = prepareCardTemplate(card);
            templates.push(preparedTemplate, preparedTemplate.clone());
        });

        templates = shuffleCards(templates);

        $cardsContainer.hide().empty();

        templates.forEach(function(card) {
            $cardsContainer.append(card);
        });

        $cardsContainer.fadeIn('slow');
    }
    
    return function() {

        this.attachCardEvent = function() {
            $cardsContainer.unbind().on('click', '.flip-container', function() {
                $(this).toggleClass('active');
            });
        };

        this.generateCards = function(cards) {
            appendCardsToDOM(cards);
        };

    }
    
})();