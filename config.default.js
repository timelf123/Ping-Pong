module.exports = {
    development: {
        url: 'http://127.0.0.1',
        port: 8989,
        cardReaderPort: 9898,
        database: {
            client: 'postgres',
            connection: {
                host: '127.0.0.1',
                port: 8889,
                user: '',
                password: '',
                database: 'pong'
            },
            migrations: {
                directory: __dirname + '/migrations',
                tableName: 'migrations'
            }
        }
    },
    production: {
        url: 'http://127.0.0.1',
        port: 8989,
        cardReaderPort: 9898,
        database: {
            client: 'postgres',
            connection: {
                host: '127.0.0.1',
                port: 8889,
                user: '',
                password: '',
                database: 'pong'
            },
            migrations: {
                directory: __dirname + '/migrations',
                tableName: 'migrations'
            }
        }
    },
    global: {
        sparkCore: {
            accessToken: undefined,
            id: undefined
        },
        serverSwitchLimit: 2, // How many points before service switches
        serverSwitchThreshold: 20, // When both players have reached this threshold, the server switches every time
        maxScore: 11,
        mustWinBy: 2,
        minPlayers: 2, //temp. should be 2
        maxPlayers: 2, // will make 4 in future
        winningViewDuration: 12000, // The duration to show the winning view for before returning to the leaderboard
        feelers: {
            pingInterval: 1000000000,
            pingThreshold: 250,
            undoThreshold: 750 // was 1500, disabled for now.
        },
        cardReader: {
            pingInterval: 30000,
            pingThreshold: 250
        }
    }
};
