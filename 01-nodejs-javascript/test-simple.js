require('dotenv').config();
const { Client } = require('pg');

console.log('Testing with:');
console.log('URL:', process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Connection successful!');
    return client.query('SELECT NOW()');
  })
  .then((result) => {
    console.log('✅ Query successful:', result.rows[0]);
    client.end();
  })
  .catch((error) => {
    console.log('❌ Connection failed:', error.message);
    client.end();
  });