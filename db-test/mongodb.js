const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const sleep = ms => new Promise(res => setTimeout(res, ms));

const client = new MongoClient(uri);
async function connectMongo() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");
    return client;
  } catch (err) {
    console.error("❌ Mongo error:", err);
  }
}

async function test() {
  const client = await connectMongo();
  const db = client.db("appdb");

  const users = db.collection("users");

  await users.insertOne({ name: "Biswajit", role: "admin" });

  const result = await users.findOne({ name: "Biswajit" });

  console.log("📦 Mongo result:", result);

  await sleep(5000);
  await users.deleteOne({ _id: result._id });

  await client.close();
}

test();