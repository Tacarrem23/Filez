-- Create the filez database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS filez;

-- Switch to the filez database
\c filez;

CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  folder_id INTEGER NOT NULL,
  FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE CASCADE,
  UNIQUE (name, folder_id)
);
