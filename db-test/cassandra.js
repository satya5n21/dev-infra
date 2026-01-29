const cassandra = require("cassandra-driver");

const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  keyspace: "local_ks"
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to Cassandra");

    const result = await client.execute("SELECT * FROM users");
    console.log("📦 Users:", result.rows);

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.shutdown();
    console.log("🔌 Connection closed");
  }
}

run();
