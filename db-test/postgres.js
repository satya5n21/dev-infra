const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || "app_user",
  password: process.env.PG_PASSWORD || "app_password",
  database: process.env.PG_DB || "appdb",
});

async function test() {
  try {
    const res = await pool.query("SELECT * FROM users");
    console.log("✅ Users:", res.rows);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await pool.end();
  }
}

test();