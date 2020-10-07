// Update with your config settings.
require("dotenv").config()
module.exports = {

  development: {
    client: 'pg',
    connection: process.env.postgresURL,
    },
    migrations: {
      directory: './dev/migrations'
    }
};


