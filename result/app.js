const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();
app.use(cors());

const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";
const client = redis.createClient({ url: REDIS_URL });

(async () => {
  client.on("error", (err) => console.error("Redis Error", err));
  await client.connect();
})();

app.get("/api/results", async (req, res) => {
  try {
    const a = Number((await client.get("A")) || 0);
    const b = Number((await client.get("B")) || 0);
    res.json({ A: a, B: b });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Result service listening on ${PORT}`));
