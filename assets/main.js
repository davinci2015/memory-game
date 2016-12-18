var BRAINYMO = BRAINYMO || {};

BRAINYMO.Game = (function() {

    // Array to keep track of how many cards are active/open
    var activeCards = [];
    var timeStart, timeEnd, timeDiff;
    var numOfCards;
    var cardHitCounter = 0;

    /**
     * Method that will be invoked on card click event
     */
    function handleCardClick() {

        var connection = $(this).data('connection');
        var hit;

        // Set card in active state
        // 'this' needs to be attached to context of card which is clicked
        if ( !$(this).hasClass('active') ) {
            $(this).addClass('active');
            activeCards.push($(this));

            // If user click on two cards then check
            if (activeCards.length == 2) {
                hit = checkActiveCards(activeCards);
            }

            if (hit === true) {
                cardHitCounter++;
                activeCards[0].add(activeCards[1]).unbind().addClass('wobble cursor-default');
                activeCards = [];

                // Game End
                if(cardHitCounter === (numOfCards / 2)) {
                    endGame();
                }
            }
            // In case when user open more then 2 cards then automatically close first two
            else if(activeCards.length === 3) {
                for(var i = 0; i < activeCards.length - 1; i++) {
                    activeCards[i].removeClass('active');
                }
                activeCards.splice(0, 2);
            }
        }
    }

    function endGame() {
        // Reset hit counter
        cardHitCounter = 0;

        // Calculate time
        timeEnd = new Date();
        timeDiff = (timeEnd - timeStart) / 1000;
        alert("Your time: " + timeDiff + " seconds");
    }

    function checkActiveCards(connections) {
        return connections[0].data('connection') === connections[1].data('connection');
    }

    return function(config) {
        var card;

        /**
         * Main method for game initialization
         */
        this.startGame = function() {
            card = new BRAINYMO.Card();
            numOfCards = config.cards.length;
            card.attachCardEvent(handleCardClick, config);
        };

        /**
         * After game initialization call this method in order to generate cards
         */
        this.generateCardSet = function() {
            // Generate new card set
            card.generateCards(config.cards, config.numberOfSameCards);
            // Reset active cards array
            activeCards = [];
            // Set timer
            timeStart = new Date();
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
        var template = $cardTemplate
                            .clone()
                            .removeAttr('id')
                            .removeClass('hide')
                            .attr('data-connection', card.connectionID);

        // If card has background image
        if (card.backImg != '' && card.backImg != undefined) {
            template.find('.back').css({
                'background': 'url(' + card.backImg + ') no-repeat center center',
                'background-size': 'cover'
            });
        }
        // Else if card has no background image but has text
        else if (card.backTxt != '' && card.backTxt != undefined) {
            template.find('.back > label').html(card.backTxt);
        }

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
         */
        this.generateCards = function(cards) {
            var templates = [];
            var preparedTemplate;

            // Prepare every card and push it to array
            cards.forEach(function (card) {
                preparedTemplate = prepareCardTemplate(card);
                templates.push(preparedTemplate);
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
        this.attachCardEvent = function(func) {
            $cardsContainer.unbind().on('click', '.flip-container', function() {
                func.call(this);
            });
        }
    }
    
})();