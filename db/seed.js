import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  database: 'filez'
});

async function seed() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
  await client.connect();
  await client.query(schema);

  const folderNames = ['Documents', 'Images', 'Videos'];

  for (const name of folderNames) {
    const res = await client.query('INSERT INTO folders(name) VALUES($1) RETURNING id', [name]);
    const folderId = res.rows[0].id;

    for (let i = 1; i <= 5; i++) {
      await client.query(
        `INSERT INTO files(name, folder_id, size, type)
         VALUES($1, $2, $3, $4)`,
        [`file${i}.txt`, folderId, i * 100, 'text/plain']
      );
    }
  }

  await client.end();
}

seed();
