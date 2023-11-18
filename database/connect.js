const { Pool } = require('pg')

const db = new Pool({
    connectionString: process.env.DB_URL
})

db.on('error', (err) => {
    console.error('PostgreSQL Pool Error:', err);
});

module.exports = db