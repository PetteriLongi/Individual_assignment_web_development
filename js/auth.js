import {
  checkUsernameAvailable,
  getUserFromToken,
  loginUser,
  registerUser,
  updateUser,
  uploadAvatar,
} from "./api.js";

const TOKEN_KEY = "token";

const loggedOutActions = document.querySelector("[data-logged-out]");
const loggedInActions = document.querySelector("[data-logged-in]");
const usernameLabel = document.querySelector("[data-username]");
const logoutButton = document.querySelector("[data-logout]");
const profileImage = document.querySelector("[data-profile-image]");
const profilePreview = document.querySelector("[data-profile-preview]");

const signinForm = document.querySelector("#signin-form");
const signupForm = document.querySelector("#signup-form");
const usernameMessage = document.querySelector("[data-username-message]");
const profileForm = document.querySelector("#profile-form");

let currentUser = null;

export const getCurrentUser = () => currentUser;

const updateAccountActions = () => {
  loggedOutActions.hidden = Boolean(currentUser);
  loggedInActions.hidden = !currentUser;

  if (currentUser) usernameLabel.textContent = currentUser.username;
  if (currentUser) {
    profileForm.elements.username.value = currentUser.username ?? "";
    profileForm.elements.email.value = currentUser.email ?? "";
  }
  updateProfileImages(currentUser);

  // Tell the other modules (like the restaurant list) that the user changed.
  document.dispatchEvent(new Event("userchange"));
};

const getAvatarUrl = (user) => {
  if (!user?.avatar) return "";
  if (user.avatar.startsWith("http")) return user.avatar;
  return `https://media2.edu.metropolia.fi/restaurant/uploads/${user.avatar}`;
};

const updateProfileImages = (user) => {
  const avatarUrl = getAvatarUrl(user);
  profileImage.src = avatarUrl;
  profileImage.hidden = !avatarUrl;
  profilePreview.src = avatarUrl;
  profilePreview.hidden = !avatarUrl;
};

const showMessage = (form, text) => {
  form.querySelector("[data-form-message]").textContent = text;
};

const closeModal = () => {
  window.location.hash = "";
};

const login = async (username, password) => {
  const { token } = await loginUser({ username, password });
  localStorage.setItem(TOKEN_KEY, token);

  // This endpoint returns the user object directly.
  currentUser = await getUserFromToken(token);
  updateAccountActions();
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  currentUser = null;
  updateAccountActions();
};

const saveProfile = async (event) => {
  event.preventDefault();

  const { username, email, password, confirmPassword, avatar } =
    profileForm.elements;
  if (password.value !== confirmPassword.value) {
    showMessage(profileForm, "Passwords do not match.");
    return;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || !currentUser) return;

  const user = {
    username: username.value.trim(),
    email: email.value.trim(),
  };
  if (password.value) user.password = password.value;

  try {
    await updateUser(user, token);
    if (avatar.files[0]) await uploadAvatar(avatar.files[0], token);

    currentUser = await getUserFromToken(token);
    updateAccountActions();
    profileForm.reset();
    showMessage(profileForm, "Profile updated.");
  } catch (error) {
    showMessage(profileForm, error.message);
  }
};

// If a token was saved earlier, ask the server who it belongs to.
const restoreLogin = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return;

  try {
    currentUser = await getUserFromToken(token);
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
  }

  updateAccountActions();
};

signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { username, password } = signinForm.elements;

  try {
    await login(username.value, password.value);
    signinForm.reset();
    showMessage(signinForm, "");
    closeModal();
  } catch (error) {
    showMessage(signinForm, error.message);
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { username, email, password, confirmPassword } = signupForm.elements;

  if (password.value !== confirmPassword.value) {
    showMessage(signupForm, "Passwords do not match.");
    return;
  }

  try {
    await registerUser({
      username: username.value,
      email: email.value,
      password: password.value,
    });
    await login(username.value, password.value);
    signupForm.reset();
    showMessage(signupForm, "");
    usernameMessage.textContent = "";
    closeModal();
  } catch (error) {
    showMessage(signupForm, error.message);
  }
});

// "change" fires when the user leaves the field, so we ask the server once.
signupForm.elements.username.addEventListener("change", async (event) => {
  const username = event.target.value.trim();
  if (!username) return;

  try {
    const { available } = await checkUsernameAvailable(username);
    usernameMessage.textContent = available
      ? "Username is available."
      : "Username is already taken.";
  } catch (error) {
    usernameMessage.textContent = "";
  }
});

profileForm.elements.avatar.addEventListener("change", () => {
  const file = profileForm.elements.avatar.files[0];
  if (!file) {
    updateProfileImages(currentUser);
    return;
  }

  profilePreview.src = URL.createObjectURL(file);
  profilePreview.hidden = false;
});

logoutButton.addEventListener("click", logout);
profileForm.addEventListener("submit", saveProfile);

restoreLogin();
