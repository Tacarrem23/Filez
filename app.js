import express from "express";
const app = express();
export default app;

const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({ database: 'filez' });

app.use(express.json());

// GET /files
app.get('/files', async (req, res) => {
  const result = await pool.query(`
    SELECT files.*, folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
  `);
  res.json(result.rows);
});

// GET /folders
app.get('/folders', async (req, res) => {
  const result = await pool.query('SELECT * FROM folders');
  res.json(result.rows);
});

// GET /folders/:id
app.get('/folders/:id', async (req, res) => {
  const folderId = req.params.id;

  const folderResult = await pool.query('SELECT * FROM folders WHERE id = $1', [folderId]);

  if (folderResult.rows.length === 0) {
    return res.status(404).json({ error: 'Folder not found' });
  }

  const filesResult = await pool.query(`
    SELECT json_agg(files) AS files FROM files WHERE folder_id = $1
  `, [folderId]);

  const folder = folderResult.rows[0];
  folder.files = filesResult.rows[0].files || [];

  res.json(folder);
});

// POST /folders/:id/files
app.post('/folders/:id/files', async (req, res) => {
  const folderId = req.params.id;
  const { name, size, type } = req.body;

  const folderCheck = await pool.query('SELECT * FROM folders WHERE id = $1', [folderId]);
  if (folderCheck.rows.length === 0) {
    return res.status(404).json({ error: 'Folder not found' });
  }

  if (!name || !size || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const insertResult = await pool.query(`
      INSERT INTO files(name, folder_id, size, type)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `, [name, folderId, size, type]);

    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      res.status(400).json({ error: 'File with this name already exists in this folder' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Start the server
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

module.exports = app; // for tests
