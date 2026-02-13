const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTIC_URL || "http://localhost:9200",
});
const sleep = ms => new Promise(res => setTimeout(res, ms));

async function test() {
  try {
    await client.index({
      index: "users",
      document: {
        name: "Biswajit",
        role: "admin",
      },
    });

    await sleep(1000);
    const result = await client.search({
      index: "users",
      query: {
        match: { name: "Biswajit" },
      },
    });

    console.log("🔍 Search result:", result.hits.hits);

    await sleep(5000);
    await client.delete({
      index: "users",
      id: result.hits.hits[0]["_id"]
    })

  } catch (err) {
    console.error("❌ Elastic error:", err);
  }
}

test();
