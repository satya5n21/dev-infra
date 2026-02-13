const { createClient } = require("redis");

const sleep = ms => new Promise(res => setTimeout(res, ms));
const CHANNEL = "my_topic";

const publisher = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const subscriber = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

publisher.on("error", (err) => console.error("Publisher error:", err));
subscriber.on("error", (err) => console.error("Subscriber error:", err));

async function run() {
  try {
    await publisher.connect();
    await subscriber.connect();

    console.log("✅ Connected to Redis");

    await subscriber.subscribe(CHANNEL, async (message) => {
      console.log("📥 Received message: ", message);

      // wait before cleanup
      await sleep(2000);

      await subscriber.unsubscribe(CHANNEL);
      console.log("🗑️  Unsubscribed from channel:", CHANNEL);

      await subscriber.quit();
      await publisher.quit();

      console.log("🔌 Conenctions closed");
      process.exit(0);
    });

    await sleep(1000);
    console.log("📤 Publishing message...");
    await publisher.publish(
      CHANNEL,
      "Hello from redis pub/sub!"
    );

    await sleep(3000);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

run();