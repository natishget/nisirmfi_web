const { Client } = require('pg');

async function testConnection(connectionString) {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Success with URL:", connectionString.replace(/:[^@]+@/, ':****@'));
    await client.end();
    return true;
  } catch (err) {
    console.log("Failed with URL:", connectionString.replace(/:[^@]+@/, ':****@'), "Error:", err.message);
    return false;
  }
}

async function main() {
  const p1 = "yU3nPd4\\$h!.sLLX"; // literal backslash
  const p2 = "yU3nPd4$h!.sLLX"; // no backslash
  const p3 = "yU3nPd4h!.sLLX"; // empty $h

  const url1 = `postgresql://postgres.ijbhaxszvxqsitvqotmj:${p1}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`;
  const url2 = `postgresql://postgres.ijbhaxszvxqsitvqotmj:${p2}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`;
  const url3 = `postgresql://postgres.ijbhaxszvxqsitvqotmj:${p3}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`;

  console.log("Testing url1...");
  await testConnection(url1);
  console.log("Testing url2...");
  await testConnection(url2);
  console.log("Testing url3...");
  await testConnection(url3);
}

main();
