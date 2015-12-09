
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('players').del(),
    knex('games').del(),

    // Inserts seed entries
    knex('players').insert({id: 1, rfid: 123, name: 'Tim', gender: 'male', uri: 'http://crowds.io', elo: 1, image: 'tim.jpg', play_count: 0}),
    knex('players').insert({id: 2, rfid: 124, name: 'Consuela', gender: 'female', uri: 'http://google.com', elo: 1, image: 'consuela.jpg', play_count: 0}),
    knex('players').insert({id: 3, rfid: 125, name: 'Coby', gender: 'male', uri: 'http://apple.com', elo: 1, image: 'coby.jpg', play_count: 0}),
    knex('players').insert({id: 4, rfid: 126, name: '#sweatervest', gender: 'male', uri: 'http://apple.com', elo: 1, image: 'coby.jpg', play_count: 0}),
    knex('players').insert({id: 5, rfid: 127, name: 'trae', gender: 'male', uri: 'http://apple.com', elo: 1, image: 'trae.jpg', play_count: 0}),
    knex('players').insert({id: 6, rfid: 128, name: 'Jeremy', gender: 'male', uri: 'http://apple.com', elo: 1, image: 'jeremy.jpg', play_count: 0}),
    knex('players').insert({id: 7, rfid: 129, name: 'Jermo', gender: 'male', uri: 'http://apple.com', elo: 1, image: 'jeremy.jpg', play_count: 0})

)};
