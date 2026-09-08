// dashboard.js
// Reads the signed-in user straight from Firebase auth state and
// bounces back to sign-in if nobody's logged in.

import { auth } from './firebase-config.js';
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
  const nameEl = document.getElementById('welcomeName');
  const emailEl = document.getElementById('userEmail');
  const avatarEl = document.getElementById('userAvatar');
  const signOutBtn = document.getElementById('signOutBtn');

  onAuthStateChanged(auth, function (fbUser) {
    if (!fbUser) {
      window.location.href = './signin.html';
      return;
    }
    nameEl.textContent = fbUser.displayName || 'there';
    emailEl.textContent = fbUser.email || '';
    if (fbUser.photoURL) {
      avatarEl.style.backgroundImage = 'url(' + fbUser.photoURL + ')';
      avatarEl.textContent = '';
    } else {
      const source = fbUser.displayName || fbUser.email || '?';
      avatarEl.textContent = source.trim().charAt(0).toUpperCase();
    }
  });

  signOutBtn.addEventListener('click', function () {
    signOut(auth).then(function () {
      window.location.href = './signin.html';
    });
  });
});