const redis = require('redis');
const mysql = require('mysql2/promise');

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const redisClient = redis.createClient({ url: REDIS_URL });

(async () => {
  redisClient.on('error', e => console.error('Redis error', e));
  await redisClient.connect();
})();

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'votes'
};

async function syncVotes() {
  try {
    const a = Number(await redisClient.get('A') || 0);
    const b = Number(await redisClient.get('B') || 0);

    const conn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await conn.changeUser({ database: dbConfig.database });
    await conn.query('CREATE TABLE IF NOT EXISTS results (option_name VARCHAR(10) PRIMARY KEY, votes INT)');
    await conn.query('INSERT INTO results(option_name,votes) VALUES(?,?) ON DUPLICATE KEY UPDATE votes=VALUES(votes)', ['A', a]);
    await conn.query('INSERT INTO results(option_name,votes) VALUES(?,?) ON DUPLICATE KEY UPDATE votes=VALUES(votes)', ['B', b]);
    await conn.end();
    console.log(new Date().toISOString(), 'synced', { A: a, B: b });
  } catch (err) { console.error('sync error', err); }
}

setInterval(syncVotes, 5000);
console.log('worker running, syncing every 5s');
