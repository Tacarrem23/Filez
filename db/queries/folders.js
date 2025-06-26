// db/queries/folders.js
const db = require('../db');

async function createFolder(name) {
  return db.query('INSERT INTO folders (name) VALUES ($1) RETURNING id', [name])
    .then(res => res.rows[0].id);
}

async function getFolderByName(name) {
  return db.query('SELECT * FROM folders WHERE name = $1', [name])
    .then(res => res.rows[0]);
}

async function getAllFolders() {
  return db.query('SELECT * FROM folders').then(res => res.rows);
}

async function deleteFolder(id) {
  return db.query('DELETE FROM folders WHERE id = $1', [id]);
}

module.exports = {
  createFolder,
  getFolderByName,
  getAllFolders,
  deleteFolder,
};
