/**
 * @jsx React.DOM
 */
'use strict';



var
    React = require('react'),
    config = window.config,
    node = require('../../js/node');



var LeaderboardComponent = module.exports = React.createClass({



        getInitialState: function() {
            return {
                players: [],
                active: true
            };
        },



        componentDidMount: function() {

            var _this = this;

            this.getLeaderboard();

            //node.socket.on('leaderboard.show', _this.show);
            //node.socket.on('leaderboard.hide', _this.hide);

        },



        show: function() {
            this.getLeaderboard();
            this.setState({
                active: true
            });
        },



        hide: function() {
            this.setState({
                active: false
            });
        },



        getLeaderboard: function() {
            var _this = this;
            $.get(config.url + '/leaderboard', function(players) {
            _this.setState({
                players: players
            });
        });
    },



    render: function() {

        var
            players,
            leaderboard;

        players = this.state.players.map(function(player, i) {
            return (
                <li className='collection-item avatar' key={player.id}>
                    <img src={player.image} className='circle' />
                    <div className=''>{i + 1}. {player.name} - <span className='elo'>{player.elo} points</span></div>
                </li>
            );
        });

        if(this.state.active) {
            leaderboard = (
                <div className='leaderboard' key='leaderboard'>
                    <ul className='collection'>
                        {players}
                    </ul>
                </div>
            );
        }

        return leaderboard;

    }



});
