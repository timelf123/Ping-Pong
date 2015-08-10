var
    events = require('events'),
    util = require('util'),
    config = require('../config.js');



module.exports = function() {
    return this instanceof FeelerController
        ? FeelerController
        : new FeelerController;
};



/**
 * Feeler Controller
 */
function FeelerController() {
    var self = this;
    self.threshold = config.global.feelers.undoThreshold || 0;
    self.timer;
    self.lastPressedTime = -1;

    self.isUndo = function(){
        if(self.lastPressedTime < 0) return false;
        return (new Date() - self.lastPressedTime ) < self.threshold;
    }

    self.on('press', self.counter);

};

util.inherits(FeelerController, events.EventEmitter);



/**
 * Counter
 */

FeelerController.prototype.counter = function() {
    var self = this;
    if(!self.timer && !self.isUndo()){

        self.timer = setTimeout(function(){
            console.log('SCORING FUNCTION RUNNING');
            self.emit('score');
            self.timer = null;
        }, self.threshold);
    }
    else if(self.isUndo()){
        console.log("killing scoring function!");
        console.log(self.timer);
        clearTimeout(self.timer);
        self.emit('removePoint');
        self.timer = null;
    }

    self.lastPressedTime = new Date();

};
