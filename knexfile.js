var config = require('./config.js');

module.exports = {
  development: {
    client: config.development.database.client,
    connection: config.development.database.connection,
    migrations: config.development.database.migrations,
    seeds: config.development.database.seeds
  },
  production: {
    client: config.production.database.client,
    connection: config.production.database.connection,
    migrations: config.production.database.migrations,
    seeds: config.production.database.seeds
  }
};
