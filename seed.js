// seed.js
const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const pool = new Pool({
  user: 'your_user',  // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'filez',
  password: 'your_password', // Replace with your PostgreSQL password
  port: 5432,
});

async function seedDatabase() {
  try {
    // 1. Create Folders
    const folderNames = ['Documents', 'Images', 'Videos'];
    const folderInserts = folderNames.map(name => pool.query('INSERT INTO folders (name) VALUES ($1) RETURNING id', [name]));
    const folderResults = await Promise.all(folderInserts);
    const folderIds = folderResults.map(result => result.rows[0].id);

    // 2. Create Files for each folder
    for (let i = 0; i < folderIds.length; i++) {
      const folderId = folderIds[i];
      const fileInserts = Array(5).fill(null).map(() => {
        const fileName = faker.system.fileName(); // Generate unique filenames
        return pool.query('INSERT INTO files (folder_id, name) VALUES (<div class="katex-block">1, </div>2)', [folderId, fileName]);
      });
      await Promise.all(fileInserts);
    }

    
