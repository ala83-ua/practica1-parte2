### Quick orientation

This is a small single-repo web app that uses a local PocketBase binary as the backend and a static frontend under `public/`.

- Backend: the `pocketbase/` directory contains the PocketBase executable and data bucket `pb_data/` (databases, storage). Admin UI and REST API are provided by the bundled `pocketbase` server (v0.21.3 in this copy).
- Frontend: static HTML/CSS/JS in `public/`. Client code uses the official PocketBase JS SDK via CDN in `public/js/pb.js`.
- Client-side services: small wrappers for PocketBase collection operations live in `public/js/services/`:
  - `auth.service.js` — authentication helpers (login, register, session helpers)
  - `publicaciones.service.js` — CRUD for `publicaciones` collection (note: contains functions like `listarPublicaciones`, `crearPublicacion`, `eliminarPublicacion`)
  - `items.service.js` — similar for `publicaciones` but with slightly different parameter names (used in some pages)
  - `users.service.js` — currently empty (placeholder)

### What to know before editing

- The frontend talks to PocketBase at http://127.0.0.1:8090 (see `public/js/pb.js` and hard-coded `BASE` values in HTML files). Do not change the URL without updating all pages.
- File uploads are sent as FormData and rely on PocketBase collection fields of type `file` / `array` of files. See `crearPublicacion` implementations in `public/js/services/*.js` for the exact FormData keys used (`imagenes`, `comentario`, `usuario` / `id_usuario`).
- Session persistence uses PocketBase authStore and cookies. `pb.authStore.loadFromCookie(document.cookie)` is called on module load and `pb.authStore.onChange()` writes the cookie back — the code expects non-HttpOnly cookie handling in the browser.

### Useful developer commands

- Start PocketBase locally (from project root):

  npm run pb

  This runs `cd pocketbase && ./pocketbase serve` and uses the `pocketbase/pocketbase` binary. Stop it with CTRL-C.

- Serve the static frontend locally (from project root):

  npm run dev

  This uses `npx serve public -p 5173` to host the `public/` folder. The frontend assumes the backend is at http://127.0.0.1:8090 so start the `pb` server first.

### Project-specific conventions & gotchas for an AI agent

- Naming: some service files use Spanish identifiers: `publicaciones` (posts), `comentario` (text), `imagenes` (images), `usuario` / `id_usuario`. When modifying or adding code, preserve these field names unless you update both the frontend and the PocketBase collection schema.
- Multiple implementations: there are two similar service modules (`items.service.js` and `publicaciones.service.js`) that overlap. Inspect which page imports which file (e.g., `feed.html` imports `publicaciones.service.js`). Prefer to update the file actually used by the target page.
- Empty placeholders: `public/js/services/users.service.js` is an empty file — if you add new user helper functions, consider adding them there and update imports.
- File URLs: frontend computes file URLs with `/api/files/${collectionId}/${id}/${filename}` (see `feed.html` and `explorar.html`). Use that pattern when rendering or testing images.
- Filtering: `explorar.html` builds PocketBase `filter` strings with `~` (regex-like contains) and `expand` fields are used (`expand: 'id_usuario'`) when listing publications. Keep this when querying server-side or implementing server rules.

### Integration points and data flow

- Client -> PocketBase: all client actions are direct PocketBase JS SDK calls (no intermediate API). Examples:
  - Login: `pb.collection('users').authWithPassword(email, password)` in `auth.service.js`.
  - Create post: `pb.collection('publicaciones').create(form)` where `form` is FormData with keys `comentario`, `imagenes`, `id_usuario`.
  - List posts: `pb.collection('publicaciones').getList(page, perPage, { sort, expand, filter })`.

- Storage: uploaded files are stored under `pocketbase/pb_data/storage/` and referenced by filename in the record fields. The frontend constructs file URLs based on collectionId + record id + filename.

### Examples to reference when making changes

- Update post creation (FormData): public/js/services/publicaciones.service.js — see `crearPublicacion` and `eliminarImagenDePublicacion` for how images arrays are handled.
- Session handling and cookie syncing: public/js/pb.js — any change to session mechanics should maintain cookie load/save behavior.
- Listing + expand: public/explorar.html and public/feed.html — both call `listarPublicaciones` and expect the server to return `expand.id_usuario` for author metadata.

### Small tasks AI can safely do automatically

- Add missing exports or small helper functions to `users.service.js` for user-related usage discovered in pages.
- Fix minor UI bugs in `public/*.html` or consolidate duplicated code between `items.service.js` and `publicaciones.service.js` but keep existing public APIs to avoid breaking pages.

### When not to change (ask a human)

- Do not modify PocketBase database files under `pocketbase/pb_data/` directly. Use migrations or the admin UI.
- Do not change the PocketBase binary in `pocketbase/pocketbase` unless you understand Go/PocketBase builds.

### Where to run tests / smoke checks

- Smoke test workflow:
  1. npm run pb (start backend)
  2. npm run dev (or open `public/*.html` with a static server)
  3. Visit `http://localhost:5173/feed.html`, `explorar.html`, `login.html` and exercise login/register and post creation.

### If you add new endpoints or change collection schemas

- Update both the frontend service wrappers in `public/js/services/` and, if relevant, add a PocketBase migration script in `pocketbase/pb_migrations/` (this project already contains migrations in the pocketbase subfolder in other projects — follow that pattern if present).

---

If anything above is unclear or you want more examples (e.g., a suggested migration template or a list of collection fields), tell me which area and I will expand the instructions with concrete code snippets from the repo.
