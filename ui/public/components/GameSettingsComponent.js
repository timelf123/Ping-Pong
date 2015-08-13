/**
 * @jsx React.DOM
 */

var
    React = require('react'),
    config = window.config,
    node = require('../js/node');

var GameSettingsComponent = module.exports = React.createClass({

    getInitialState: function() {
        return {
            selected: 11
        };
    },



    componentDidMount: function() {
        var self = this;
        this.getState();
        node.socket.on('game.end', self.clearInfo);
        node.socket.on('game.changeSettings', self.updateSettings);

    },

    updateSettings: function(returnVal){
        var self = this;

        if(self.isMounted()) {
            var maxScore = returnVal.maxScore;
            self.setState({
                selected: maxScore
            });
        }
    },

    getState: function(){
        var self = this;

        $.get(config.url + '/maxScore', function(score) {
            self.setState({
                selected: score
            });
            self.forceUpdate();
        });
    },

    clearInfo: function(){
        this.reset()
    },

    reset: function(){
        if(this.isMounted()) {
            this.getState();
        }
    },

    show: function() {
        this.setState({
            active: true
        });
    },

    render: function() {
        var self = this;
        var settings = [
            {
                title: "21 Point Game",
                maxScore: 21
            },
            {
                title: "11 Point Game",
                maxScore: 11
            }
        ];

        var settingsRendered = [];

        for (var i = 0; i < settings.length; i++) {
            var classString = 'setting ';
            if(settings[i].maxScore === self.state.selected){
                classString += 'selected';
            }
            settingsRendered.push(
                <span className={classString}>{settings[i].title}</span>
            );
        }


        var settingsPanel = (
            <div className='settingsPanel'>
                <br/>
                {settingsRendered}
            </div>
        );

        return settingsPanel;

    }



});
