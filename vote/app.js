const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // <--- parse JSON bodies

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const client = redis.createClient({ url: REDIS_URL });

(async () => {
  client.on('error', err => console.error('Redis Error', err));
  await client.connect();
})();

// POST /api/vote expects JSON { option: "A" }
app.post('/api/vote', async (req, res) => {
  const option = req.body.option?.toUpperCase();
  if (!['A','B'].includes(option)) return res.status(400).json({ error: 'Invalid option' });

  try {
    let current = await client.get(option) || '0';
    await client.set(option, Number(current) + 1);
    res.json({ message: `Vote counted for ${option}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// GET results
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
app.listen(PORT, () => console.log(`vote service listening ${PORT}`));
