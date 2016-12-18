var BRAINYMO = BRAINYMO || {};


BRAINYMO.Game = (function() {

    return function(config) {

        this.startGame = function() {
            var card = new BRAINYMO.Card(config);
            card.attachCardEvent();
            card.generateCards();
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

    function appendCardsToDOM(cards, numberOfSameCards) {
        var templates = [];
        var preparedTemplate;

        cards.forEach(function (card) {
            preparedTemplate = prepareCardTemplate(card);

            for (var i = 0; i < numberOfSameCards; i++) {
                templates.push(preparedTemplate.clone());
            }

        });

        templates = shuffleCards(templates);

        $cardsContainer.hide().empty();

        templates.forEach(function(card) {
            $cardsContainer.append(card);
        });

        $cardsContainer.fadeIn('slow');
    }
    
    return function(config) {

        // Array to keep track of how many cards are active/open
        var activeCards = [];

        this.attachCardEvent = function() {
            $cardsContainer.unbind().on('click', '.flip-container', function() {
                // Set card in active state
                if ( !$(this).hasClass('active') ) {
                    $(this).addClass('active');
                    activeCards.push($(this));

                    if(activeCards.length === config.numberOfSameCards + 1) {
                        for(var i = 0; i < activeCards.length - 1; i++) {
                            activeCards[i].removeClass('active');
                        }
                        activeCards.splice(0, config.numberOfSameCards);
                    }
                }

            });
        };

        this.generateCards = function() {
            appendCardsToDOM(config.cards, config.numberOfSameCards);
        };
        
    }
    
})();