# SuperHeroManager — Backend Starter

TypeScript + Express + Mongoose + JWT + Multer.

## Quick start

```bash
cp .env.sample .env
# edit .env as needed

npm install
npm run dev
```

Open http://localhost:$PORT (default 4000).

### Auth
- `POST /api/auth/register` — body: `{ "username": "...", "password": "..." }`
- `POST /api/auth/login` — body: `{ "username": "...", "password": "..." }` -> `{ token }`
- `GET /api/auth/me` — header: `Authorization: Bearer <token>`

### Heroes
- `GET /api/heroes` — query: `q, publisher, minStrength, page, limit, sort`
- `POST /api/heroes` — (admin) JSON hero
- `PUT /api/heroes/:id` — (admin/editor) update
- `DELETE /api/heroes/:id` — (admin) delete
- `POST /api/heroes/:id/image` — (editor/admin) upload `image` (multipart/form-data)

### Scripts
- `npm run dev` — start dev server
- `npm run build && npm start` — production build

Folder layout:
```
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  index.ts
uploads/ (created at runtime)
```
