const express = require('express');
const redis = require('redis');
const cors = require('cors');
const app = express();
app.use(cors());

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const client = redis.createClient({ url: REDIS_URL });

(async () => {
  client.on('error', err => console.error('Redis Error', err));
  await client.connect();
})();

app.get('/api/results', async (req, res) => {
  try {
    const a = await client.get('A') || '0';
    const b = await client.get('B') || '0';
    res.json({ A: Number(a), B: Number(b) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`result service listening ${PORT}`));
