const { createClient } = require("redis");

const sleep = ms => new Promise(res => setTimeout(res, ms));
const STREAM_KEY = "my_topic_stream";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("ready", () => {
  console.log("✅ Redis ready");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error", err);
});

async function run() {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis");

    // pusblish message to stream
    const messageId = await redisClient.xAdd(STREAM_KEY, "*", {
      event: "user_login",
      user: "Biswajit",
      timestamp: Date.now().toString()
    });

    console.log("📤 Oublished message with ID:", messageId);

    // wait some time before fetch
    await sleep(2000);

    // pull messages from stream
    const message = await redisClient.xRead(
      {
        key: STREAM_KEY,
        id: "0"
      },
      {
        COUNT: 10,
        BLOCK: 1000
      }
    );

    console.log("📥 Pulled messages:");
    console.dir(message, { depth: null });

    await sleep(1000);
    await redisClient.del(STREAM_KEY);
    console.log("🗑️ Stream deleted:", STREAM_KEY);

    console.log("✅ Redis stream working");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await redisClient.quit();
    console.log("🔌 Redis connection closed");
  }
};

run();