// signup.js
// Handles email/password account creation, Google sign-up, and GitHub sign-up
// for signup.html, using the shared Firebase setup from firebase-config.js.

import { auth, googleProvider, githubProvider } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signUpForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const termsInput = document.getElementById('terms');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const termsError = document.getElementById('termsError');

  const toast = document.getElementById('formToast');
  const submitBtn = document.getElementById('signUpBtn');
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
      case 'auth/email-already-in-use':
        return 'That email is already registered — try signing in instead.';
      case 'auth/invalid-email':
        return 'That email address looks invalid.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Sign-up was cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  nameInput.addEventListener('input', function () {
    if (nameInput.classList.contains('input-error')) {
      setFieldState(nameInput, nameError, nameInput.value.trim().length > 0);
    }
  });
  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('input-error')) {
      setFieldState(emailInput, emailError, isValidEmail(emailInput.value.trim()));
    }
  });
  passwordInput.addEventListener('input', function () {
    if (passwordInput.classList.contains('input-error')) {
      setFieldState(passwordInput, passwordError, passwordInput.value.length >= 8);
    }
  });
  termsInput.addEventListener('change', function () {
    termsError.classList.toggle('visible', !termsInput.checked);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameValid = nameInput.value.trim().length > 0;
    const emailValid = isValidEmail(emailInput.value.trim());
    const passwordValid = passwordInput.value.length >= 8;
    const termsValid = termsInput.checked;

    setFieldState(nameInput, nameError, nameValid);
    setFieldState(emailInput, emailError, emailValid);
    setFieldState(passwordInput, passwordError, passwordValid);
    termsError.classList.toggle('visible', !termsValid);

    if (!nameValid || !emailValid || !passwordValid || !termsValid) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';

    const fullName = nameInput.value.trim();

    createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value)
      .then((cred) => updateProfile(cred.user, { displayName: fullName }))
      .then(() => {
        showToast('Account created! Redirecting…', 'success');
        window.location.href = './dashboard.html';
      })
      .catch((error) => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create account';
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