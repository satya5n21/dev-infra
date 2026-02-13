const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("ready", () => {
  console.log("✅ Redis ready");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error", err);
});

async function test() {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis");

    await redisClient.set(
      "user:1",
      JSON.stringify({ name: "Biswajit" }),
      { EX: 60 }
    );

    const cachedUser = await redisClient.get("user:1");
    console.log(JSON.parse(cachedUser));

    console.log("✅ Redis cache working");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await redisClient.quit();
  }
}

test();
