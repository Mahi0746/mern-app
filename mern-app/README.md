## MERN Questboard

Gamified MERN starter that stores quests, XP, streaks, and badges inside MongoDB Atlas.

### Stack
- **Backend**: Express, Mongoose, Nodemon
  - Collections: `todos`, `profiles`, `badges`, `userbadges`
- **Frontend**: React + Vite + TypeScript

### Setup
1. Create `server/.env` with:
   ```
   PORT=5000
   MONGO_URI=<your_atlas_connection_string>
   CLIENT_ORIGIN=http://localhost:5173
   ```
2. Optionally create `client/.env` to customize the API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Install
```bash
cd server && npm install
cd ../client && npm install
```

### Run
- Backend: `cd server && npm run dev`
- Frontend: `cd client && npm run dev`

### API surface
- `GET /api/todos` – list quests
- `POST /api/todos` – create quest with metadata
- `PUT /api/todos/:id` – edit quest fields
- `PATCH /api/todos/:id/toggle` – complete quest, updates XP/badges
- `DELETE /api/todos/:id` – remove quest
- `GET /api/profile` – retrieve XP, level, streak
- `GET /api/profile/badges` – earned badges
- `GET /api/badges` – catalog of unlockable badges

Frontend dashboard shows active quests, inline editing, badge gallery, and a level progress tracker powered entirely by Atlas.

