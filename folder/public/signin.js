// signin.js
// Handles email/password sign-in, Google sign-in, and GitHub sign-in
// for signin.html, using the shared Firebase setup from firebase-config.js.

import { auth, googleProvider, githubProvider } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signInForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const toast = document.getElementById('formToast');
  const submitBtn = document.getElementById('signInBtn');
  const rememberInput = document.querySelector('.form-row-between input[type="checkbox"]');
  const googleBtn = document.getElementById('googleBtn');
  const githubBtn = document.getElementById('githubBtn');

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldState(input, errorEl, valid) {
    input.classList.toggle('input-error', !valid);
    errorEl.classList.toggle('visible', !valid);
  }

  function showToast(message, type) {
    toast.textContent = message;
    toast.className = 'form-toast visible ' + type;
  }

  function friendlyError(code) {
    switch (code) {
      case 'auth/invalid-email':
        return 'That email address looks invalid.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('input-error')) {
      setFieldState(emailInput, emailError, isValidEmail(emailInput.value.trim()));
    }
  });
  passwordInput.addEventListener('input', function () {
    if (passwordInput.classList.contains('input-error')) {
      setFieldState(passwordInput, passwordError, passwordInput.value.length > 0);
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailValid = isValidEmail(emailInput.value.trim());
    const passwordValid = passwordInput.value.length > 0;

    setFieldState(emailInput, emailError, emailValid);
    setFieldState(passwordInput, passwordError, passwordValid);

    if (!emailValid || !passwordValid) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    // "Remember me" controls whether the session survives closing the browser
    const persistence = rememberInput && rememberInput.checked
      ? browserLocalPersistence
      : browserSessionPersistence;

    setPersistence(auth, persistence)
      .then(() => signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value))
      .then(() => {
        showToast('Signed in successfully. Redirecting…', 'success');
        window.location.href = './dashboard.html';
      })
      .catch((error) => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';
        showToast(friendlyError(error.code), 'error');
      });
  });

  googleBtn.addEventListener('click', function () {
    signInWithPopup(auth, googleProvider)
      .then(() => { window.location.href = './dashboard.html'; })
      .catch((error) => showToast(friendlyError(error.code), 'error'));
  });

  githubBtn.addEventListener('click', function () {
    signInWithPopup(auth, githubProvider)
      .then(() => { window.location.href = './dashboard.html'; })
      .catch((error) => showToast(friendlyError(error.code), 'error'));
  });
});