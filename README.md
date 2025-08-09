# Coffee Pixel Cafe ☕

A tiny full-stack pixel-themed coffee site.

- Backend: Node.js, Express, SQLite (better-sqlite3)
- Frontend: Vanilla JS, retro pixel art aesthetic

## Run

```bash
npm install
npm start
# open http://localhost:3000
```

## API
- GET `/api/coffees`
- GET `/api/comments`
- POST `/api/comments` JSON: `{ name?: string, message: string }`