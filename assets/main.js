var BRAINYMO = BRAINYMO || {};

BRAINYMO.Game = (function() {

    // Array to keep track of how many cards are active/open
    var activeCards = [];


    /**
     * Method that will be invoked on card click event
     * @param {Number} numberOfSameCards 
     */
    function handleCardClick(numberOfSameCards) {
        // Set card in active state
        // 'this' needs to be attached to context of card which is clicked
        if ( !$(this).hasClass('active') ) {
            $(this).addClass('active');
            activeCards.push($(this));

            // In case when user open more cards then 'numberOfSameCards'
            // then automatically close cards
            if(activeCards.length === numberOfSameCards + 1) {
                for(var i = 0; i < activeCards.length - 1; i++) {
                    activeCards[i].removeClass('active');
                }
                activeCards.splice(0, numberOfSameCards);
            }
        }
    }

    return function(config) {

        var card;
        /**
         * Main method for game start
         */
        this.startGame = function() {
            card = new BRAINYMO.Card(config);
            card.attachCardEvent(handleCardClick, config);
        };
        
        this.generateNewCardSet = function() {
            card.generateCards(config.cards, config.numberOfSameCards);
        };

        this.startGame();
    }

})();



BRAINYMO.Card = (function () {

    // Private variables
    var $cardsContainer = $('.cards-container');
    var $cardTemplate = $('#card-template');

    /**
     * Private method
     * Take card template from DOM and update it with card data
     * @param {Object} card - card object
     * @return {Object} template - jquery object
     */
    function prepareCardTemplate (card) {
        var template = $cardTemplate.clone().removeAttr('id').removeClass('hide');

        template.find('.back').css({
            'background': 'url(' + card.backImg + ') no-repeat center center',
            'background-size': 'cover'
        });

        return template;
    }

    /**
     * Private method
     * Method for random shuffling array
     * @param {Object} cardsArray - array of card objects
     * @return {Object} returns random shuffled array
     */
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
    
    return function() {

        /**
         * Public method
         * Prepare all cards and insert them into DOM
         * Before inserting new set of cards method will erase all previous cards
         * @param {Object} cards - array of card objects
         * @param {Number} numberOfSameCards
         */
        this.generateCards = function(cards, numberOfSameCards) {
            var templates = [];
            var preparedTemplate;

            // Prepare every card and push it to array
            cards.forEach(function (card) {
                preparedTemplate = prepareCardTemplate(card);
                for (var i = 0; i < numberOfSameCards; i++) {
                    templates.push(preparedTemplate.clone());
                }
            });

            // Shuffle card array
            templates = shuffleCards(templates);

            // Hide and empty card container
            $cardsContainer.hide().empty();

            // Append all cards to cards container
            templates.forEach(function(card) {
                $cardsContainer.append(card);
            });

            // Show card container
            $cardsContainer.fadeIn('slow');
        };

        /**
         * Public method
         * Attach click event on every card
         * Before inserting new set of cards method will erase all previous cards
         * @param {Function} func - function that will be invoked on card click
         * @param {Object} config - configuration object
         */
        this.attachCardEvent = function(func, config) {
            $cardsContainer.unbind().on('click', '.flip-container', function() {
                func.call(this, config.numberOfSameCards);
            });
        }
    }
    
})();