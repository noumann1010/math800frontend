# Math800 Frontend

Comprehensive frontend implementation for a SAT Math tutoring website, based on the provided design system (teal + navy palette, rounded cards, soft blue sections, dashboard/lesson workspace layouts).

## Stack

- React + TypeScript + Vite
- React Router
- Framer Motion for page + component animations
- Firebase Web SDK (Auth)
- Typed API service layer with mock fallback

## Pages Included

- `/auth` login/register screen
- `/` home landing page
- `/about` about and benefits
- `/courses` course listing with filters/search
- `/courses/:courseId` course detail
- `/pricing` beta access + FAQ
- `/blog` blog list
- `/blog/:postId` blog detail
- `/dashboard` student dashboard
- `/practice` backend-driven practice mode
- `/full-test` backend-driven full test mode
- `/checkout` beta access screen (no payment)
- `/lesson/:lessonId` lesson workspace (event/share/calendar/video tabs)
- `/contact` contact form

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Backend Integration

This frontend is ready to link to your backend.

1. Copy `.env.example` to `.env`.
2. Fill Firebase values from your Firebase Console > Project Settings > General > Your apps.
3. Set `VITE_API_BASE_URL` to your backend API root (for example `http://localhost:4000`).
4. Implement matching endpoints (or adapt paths) used in `src/lib/api.ts`:
   - `GET /courses`
   - `GET /courses/:courseId`
   - `GET /blog`
   - `GET /pricing`
   - `POST /newsletter/subscribe`
   - `POST /contact`
   - `GET /api/v1/practice/set?count=10`
   - `POST /api/v1/attempts`
   - `POST /api/v1/tests/sessions`
   - `POST /api/v1/tests/sessions/{session_id}/submit`

Also enable `Email/Password` in Firebase Console > Authentication > Sign-in method.

## Firebase Auth Flow (No Manual Token Input)

1. User logs in/registers via Firebase email/password on `/auth`.
2. Frontend gets Firebase ID token from the signed-in user.
3. Frontend stores auth state and token locally.
4. Protected backend calls automatically send `Authorization: Bearer <firebase_id_token>`.

## Dynamic Questions Contract

- Protected calls send `Authorization: Bearer <firebase_id_token>`.
- Practice mode:
1. Fetch once with `GET /api/v1/practice/set?count=10`.
2. Render `prompt`, `choices.A/B/C/D`, `difficulty`, `skill_ids`.
3. Submit each answer with `POST /api/v1/attempts`.
4. Show correctness/explanation only from attempt response.
- Full test mode:
1. Start with `POST /api/v1/tests/sessions` requesting `count=22`.
2. Render questions in `order_index` order.
3. Keep local answers map `{question_id: chosen_choice}`.
4. Submit once via `POST /api/v1/tests/sessions/{session_id}/submit`.

## Expected Counts

- Practice set: exactly 10 questions
- Full test session: exactly 22 questions
- Frontend behavior: if full test returns anything other than 22, UI shows an explicit error that this is a backend generation/count issue.

If no `VITE_API_BASE_URL` is configured, the app uses local mock fallback data so all buttons and flows still work for UI testing.

## Vercel CORS Note

- When `VITE_API_BASE_URL` points to an `.onrender.com` backend and the app is served from `*.vercel.app`, the frontend auto-uses `/api-proxy` to avoid browser CORS blocks.
- `vercel.json` rewrites `/api-proxy/:path*` to the Render backend origin.

## Notes

- Payment/subscription UX is disabled during beta. CTAs now route to free beta access flows with clear messaging.
- All major buttons/CTAs are wired (navigation, tab/filter updates, auth, lesson interactions, practice/test flows).
- The design is responsive for desktop/tablet/mobile.
- Route transitions and card reveal animations are enabled with Framer Motion.
