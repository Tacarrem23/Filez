// db/queries/files.js
const db = require('../db');

async function createFile(name, folderId) {
  return db.query('INSERT INTO files (name, folder_id) VALUES (<div class="katex-block">1, </div>2) RETURNING id', [name, folderId])
    .then(res => res.rows[0].id);
}

async function getFilesByFolderId(folderId) {
  return db.query('SELECT * FROM files WHERE folder_id = $1', [folderId])
    .then(res => res.rows);
}

async function deleteFile(id) {
  return db.query('DELETE FROM files WHERE id = $1', [id]);
}

module.exports = {
  createFile,
  getFilesByFolderId,
  deleteFile,
};
