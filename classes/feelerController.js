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
    if(self.isUndo()){
        // Feeler pressed within threshold - undo
        this.emit('removePoint');
        self.lastPressedTime = new Date();
        return;
    }

    // Feeler pressed after threshold elapsed - score
    this.emit('score');
    self.lastPressedTime = new Date();
    return;
};