# Kings' Chat-Room

A real-time, multi-room chat web application built with vanilla HTML, CSS, and JavaScript, backed by Firebase Authentication and Firebase Realtime Database.

Users sign in, browse or create topic-based chat rooms (e.g. *Coding*, *Sports*, *Random*), and exchange messages instantly — with support for replying, editing, and deleting messages, live presence counts, and full account management.

---

## Features

All 13 instructor-assigned requirements are implemented:

- [x] **Sign in with 3 auth methods** — email/password, Google, GitHub
- [x] **Delete user account** — profile page, with re-authentication handling
- [x] **Sign out** — confirmation prompt before signing out
- [x] **Protected routes** — both directions. Logged-out users are redirected away from the dashboard/room/profile pages; logged-in users are redirected away from sign-in/sign-up
- [x] **Profile page** — a real page (not a modal); edit name, delete account
- [x] **Landing page** — marketing page with feature highlights
- [x] **Chat with other users** — extended into multiple, user-creatable rooms
- [x] **Chat timestamp** — shown under every message
- [x] **See users online** — live per-room presence count
- [x] **Delete chat** — per-message delete for the sender; room creators can also clear or delete a whole room
- [x] **Edit chat** — edits update the message in place and are marked *(edited)*
- [x] **Reply to a message** — shows a quoted preview of the original message
- [x] **Sender right / others left** — driven by comparing the message's `uid` to the signed-in user

**Beyond the original brief:** multiple, user-creatable chat rooms instead of a single shared room, each with its own message history, live presence, and creator-only management controls (clear messages / delete room).

---

## Tech Stack

- **Front end** — HTML5, CSS3, vanilla JavaScript (ES Modules). No framework, no build step.
- **Authentication** — Firebase Authentication: Email/Password, Google OAuth, GitHub OAuth
- **Database** — Firebase Realtime Database, chosen over Firestore specifically for its native `onDisconnect()` presence support
- **Hosting** — Firebase Hosting
- **Fonts** — Google Fonts (Poppins)

All JavaScript runs as native ES modules directly in the browser. There is no compiler, bundler, or package manager involved in the front end.

---

## Project Structure

```
.
├── firebase.json
├── .firebaserc
├── README.md
│
└── public/                 <- deployed by Firebase Hosting
    ├── index.html           Landing / marketing page
    ├── signup.html          Account creation (email/password, Google, GitHub)
    ├── signin.html          Returning-user sign-in (same 3 methods)
    ├── dashboard.html        Room list - browse or create chat rooms
    ├── room.html             Live chat interface for a single room
    ├── profile.html          View/edit profile, delete account
    │
    ├── style.css             Shared design tokens & layout rules
    ├── firebase-config.js    Firebase project initialization (exported once)
    ├── user.js               User class - caches signed-in user in localStorage
    └── user-profile.js       Keeps the database profile record in sync with Auth
```

Each HTML page is self-contained (its own inline `<style>` and `<script type="module">`), except for the four shared files above, which every page that needs them imports by relative path.

---

## Data Model (Firebase Realtime Database)

```
users/{uid}
  -> { uid, fullname, email, photoURL, updatedAt }

rooms/{roomId}
  -> { name, createdBy, createdByName, createdAt }

chats/{roomId}/{index}
  -> { message, uid, email, fullname, profileImage, timeStamp, edited, replyTo }

presence/{roomId}/{uid}
  -> true   (removed automatically via onDisconnect() when the user leaves/disconnects)
```

Two design details worth noting:

**Message keys** are a manually-tracked numeric index rather than Firebase's auto-generated `push()` keys, matching the pattern taught in class. The next index is computed as `(highest existing index) + 1` rather than `array.length`, since deleting a message in the middle of a room would otherwise leave a gap that causes the next message to silently overwrite an existing one.

**Presence** relies on Realtime Database's `onDisconnect()`, which lets the *server* — not the browser — mark a user offline the instant their connection drops, even from a closed tab or dead network. This isn't natively available in Firestore, and is the main reason Realtime Database was chosen for this project.

---

## Getting Started

1. **Create a Firebase project** at console.firebase.google.com.

2. **Enable sign-in providers** under *Authentication → Sign-in method*: Email/Password, Google, and GitHub.
   GitHub requires registering a separate OAuth App on GitHub's side first (Settings → Developer settings → OAuth Apps) to get a Client ID/Secret, using the callback URL Firebase provides.

3. **Create a Realtime Database** instance under *Build → Realtime Database*, and copy its exact `databaseURL` (it's region-specific) into `firebase-config.js`.

4. **Set database rules.** This project currently runs with open/permissive rules, since access-rule design had not yet been covered in the course at time of writing. Before any real deployment, restrict reads/writes to signed-in participants only.

5. **Deploy:**

   ```bash
   firebase deploy --only hosting
   ```

   All files must live inside whichever folder `firebase.json` names as `"public"`.

### Running locally

Because every page uses ES modules (`<script type="module">`), opening the HTML files directly via `file://` will not work — browsers block module imports over that protocol. Serve the folder over `http://` instead, from inside `public/`:

```bash
npx serve .
```

or

```bash
python3 -m http.server
```

---

## Known Limitations

- **Database rules are open.** Fine for classroom use; not production-ready.
- **Group rooms are UI-only.** The "Create group" style multi-member room flow is a placeholder — clicking it shows an explanatory message rather than creating a real group, since it needs its own data-model decision (who can add/remove members) that wasn't rushed into this version.
- **Blocking a user is a demo-only action** — there is no blocklist collection in the database yet.

---

## Future Work

- Group rooms with real member management
- Proper database security rules
- Typing indicators
- Image/file sharing within a room
- Push notifications for new messages
- Search across a room's message history

---

## Course Context

Built to satisfy a set of 13 instructor-assigned requirements (see Features above), following the Firebase Realtime Database patterns taught in class, and extended with a multi-room structure. Full project documentation — including architecture diagrams, screenshots, and a section documenting real bugs encountered and fixed during development — is available in the accompanying `Kings_Chat_Room_Documentation.docx`.