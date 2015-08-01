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
            selected: 21
        };
    },



    componentDidMount: function() {
        var self = this;
        node.socket.on('game.end', self.clearInfo);

        node.socket.on('game.changeSettings', self.updateSettings);
    },

    updateSettings: function(returnVal){
        var self = this;
        var maxScore = returnVal.maxScore;
        console.log(maxScore);
        self.setState({
            selected: maxScore
        });
    },

    clearInfo: function(){
        this.reset()
    },

    reset: function(){
        try{
            this.setState(this.getInitialState());
        }
        catch(e){
            //do nothing
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
            console.log('SELECTED: ' + self.state.selected);
            console.log(settings[i].maxScore);
            if(settings[i].maxScore === self.state.selected){
                console.log('true');
                classString += 'selected';
            }
            settingsRendered.push(
                <span className={classString}>{settings[i].title}</span>
            );
        }


        var settingsPanel = (
            <div className='settingsPanel'>
                {settingsRendered}
            </div>
        );

        return settingsPanel;

    }



});