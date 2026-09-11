// user-profile.js
// Keeps a "users" node in Realtime Database in sync with Firebase Auth.
// Auth only stores identity (uid, email, name, photo) — this is what lets
// other people find you, and what the dashboard reads to show names.

import { db } from './firebase-config.js';
import {
  ref,
  update,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

// Safe to call every time someone signs in — update() only touches the
// fields given here, it never wipes out sibling data (same idea as
// Firestore's { merge: true }, just RTDB's native behavior for update()).
export function ensureUserProfile(fbUser, extra = {}) {
  const userRef = ref(db, 'users/' + fbUser.uid);
  return update(userRef, {
    uid: fbUser.uid,
    fullname: fbUser.displayName || extra.fullname || '',
    email: fbUser.email || '',
    photoURL: fbUser.photoURL || '',
    updatedAt: serverTimestamp(),
  });
}