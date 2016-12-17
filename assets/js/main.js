var BRAINYMO = BRAINYMO || {};


BRAINYMO.Game = BRAINYMO.Game || (function() {
   
    return function(config) {

        this.startGame = function() {
            console.log("Game started");
            console.log("Configuration: " + config);
        }
        
    }
    
})();