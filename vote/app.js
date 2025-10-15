const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";
const client = redis.createClient({ url: REDIS_URL });

(async () => {
  client.on("error", (err) => console.error("Redis Error", err));
  await client.connect();
})();

app.post("/api/vote", async (req, res) => {
  const option = req.body.option?.toUpperCase();
  if (!["A", "B"].includes(option))
    return res.status(400).json({ error: "Invalid option" });

  try {
    const count = Number((await client.get(option)) || 0) + 1;
    await client.set(option, count);
    res.json({ message: `Vote counted for ${option}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

app.get("/api/results", async (_, res) => {
  try {
    const a = Number((await client.get("A")) || 0);
    const b = Number((await client.get("B")) || 0);
    res.json({ A: a, B: b });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Vote service listening on ${PORT}`));
