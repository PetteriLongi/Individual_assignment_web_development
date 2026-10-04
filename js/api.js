// Keep API requests in one module.

const BASE_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1";

const fetchJson = async (path, options) => {
  const response = await fetch(`${BASE_URL}${path}`, options);
  // Use the server message when one is available.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return data;
};

const postJson = (path, body) =>
  fetchJson(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const getRestaurants = () => fetchJson("/restaurants");

export const getRestaurant = (restaurantId) =>
  fetchJson(`/restaurants/${restaurantId}`);

export const getDailyMenu = (restaurantId, language = "en") =>
  fetchJson(`/restaurants/daily/${restaurantId}/${language}`);

export const getWeeklyMenu = (restaurantId, language = "en") =>
  fetchJson(`/restaurants/weekly/${restaurantId}/${language}`);

export const checkUsernameAvailable = (username) =>
  fetchJson(`/users/available/${encodeURIComponent(username)}`);

export const registerUser = (user) => postJson("/users", user);

export const loginUser = (credentials) => postJson("/auth/login", credentials);

export const getUserFromToken = (token) =>
  fetchJson("/users/token", {
    headers: { Authorization: "Bearer " + token },
  });

export const updateUser = (user, token) =>
  fetchJson("/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(user),
  });

export const uploadAvatar = (file, token) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return fetchJson("/users/avatar", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData,
  });
};
