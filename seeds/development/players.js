
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('players').del(),
    knex.('games').del(),

    // Inserts seed entries
    knex('players').insert({id: 1, rfid: 123, name: 'Tim', gender: 'male', uri: 'http://crowds.io', elo: 100, image: 'tim.jpg', play_count: 25}),
    knex('players').insert({id: 2, rfid: 124, name: 'Consuela', gender: 'female', uri: 'http://google.com', elo: 2, image: 'consuela.jpg', play_count: 10}),
    knex('players').insert({id: 3, rfid: 125, name: 'Coby', gender: 'male', uri: 'http://apple.com', elo: 1, image: 'coby.jpg', play_count: 30}),
    knex('games').insert({id:"1", player0_id: 1, player1_id: 3, start: "2015-12-08 22:58:24-06", end: "2015-12-08 22:59:24-06", duration: 59666, player0_score: 21, player1_score: 1, score_delta: 20, winner_id: 1})

)};
