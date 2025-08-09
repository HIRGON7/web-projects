import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const dbPath = path.join(dataDir, 'coffee.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS coffees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    origin TEXT,
    description TEXT,
    strength INTEGER DEFAULT 3 CHECK (strength BETWEEN 1 AND 5)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed coffees if empty
const countRow = db.prepare('SELECT COUNT(*) as count FROM coffees').get();
if (countRow.count === 0) {
  const coffees = [
    {
      name: 'Espresso',
      emoji: '☕',
      origin: 'Italy',
      description: 'A strong, concentrated coffee shot with rich crema.',
      strength: 5,
    },
    {
      name: 'Latte',
      emoji: '🥛☕',
      origin: 'Italy',
      description: 'Espresso with plenty of steamed milk: smooth and creamy.',
      strength: 2,
    },
    {
      name: 'Cappuccino',
      emoji: '🫧☕',
      origin: 'Italy',
      description: 'Equal parts espresso, steamed milk, and foam.',
      strength: 3,
    },
    {
      name: 'Americano',
      emoji: '💧☕',
      origin: 'USA',
      description: 'Espresso diluted with hot water for a longer cup.',
      strength: 3,
    },
    {
      name: 'Mocha',
      emoji: '🍫☕',
      origin: 'Yemen',
      description: 'Chocolate + espresso + milk, a dessert in a cup.',
      strength: 3,
    },
    {
      name: 'Cold Brew',
      emoji: '🧊☕',
      origin: 'Global',
      description: 'Slow-steeped in cold water, smooth and less acidic.',
      strength: 3,
    },
  ];
  const insert = db.prepare(
    'INSERT INTO coffees (name, emoji, origin, description, strength) VALUES (@name, @emoji, @origin, @description, @strength)'
  );
  const tx = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  tx(coffees);
}

// API routes
app.get('/api/coffees', (req, res) => {
  const rows = db
    .prepare(
      'SELECT id, name, emoji, origin, description, strength FROM coffees ORDER BY id ASC'
    )
    .all();
  res.json(rows);
});

app.get('/api/comments', (req, res) => {
  const rows = db
    .prepare('SELECT id, name, message, created_at FROM comments ORDER BY id DESC LIMIT 50')
    .all();
  res.json(rows);
});

app.post('/api/comments', (req, res) => {
  const { name, message } = req.body || {};
  const trimmedName = String(name || 'Anonymous').trim().slice(0, 40);
  const trimmedMessage = String(message || '').trim().slice(0, 500);
  if (!trimmedMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  const stmt = db.prepare('INSERT INTO comments (name, message) VALUES (?, ?)');
  const info = stmt.run(trimmedName || 'Anonymous', trimmedMessage);
  const row = db
    .prepare('SELECT id, name, message, created_at FROM comments WHERE id = ?')
    .get(info.lastInsertRowid);
  res.status(201).json(row);
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for non-API GETs
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

app.listen(PORT, HOST, () => {
  console.log(`Coffee Pixel server running at http://${HOST}:${PORT}`);
});