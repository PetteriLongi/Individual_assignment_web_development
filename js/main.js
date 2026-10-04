import { getRestaurants } from "./api.js";
import { renderRestaurants, renderRestaurantsError } from "./restaurants.js";
import { showMenu } from "./menu.js";
import { setupFilters } from "./filters.js";
import { setupLanguage } from "./language.js";
// Load authentication event handlers.
import "./auth.js";

setupLanguage();

const restaurantList = document.querySelector(".restaurant-list");
const menuSection = document.querySelector("#menu");

let restaurants = [];
let shownRestaurantId = null;

const getRestaurantIdFromUrl = () =>
  new URLSearchParams(window.location.search).get("restaurant");

// Show the list or menu selected in the URL.
const updateView = () => {
  const restaurant = restaurants.find(
    (item) => item._id === getRestaurantIdFromUrl(),
  );
  const restaurantId = restaurant?._id ?? null;

  // Ignore URL changes that do not change the selected restaurant.
  if (restaurantId === shownRestaurantId) return;
  shownRestaurantId = restaurantId;

  restaurantList.hidden = Boolean(restaurant);
  menuSection.hidden = !restaurant;
  if (restaurant) showMenu(restaurant);

  window.scrollTo(0, 0);
};

const navigate = (url) => {
  history.pushState(null, "", url);
  updateView();
};

// Handle internal navigation without a full page reload.
document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-nav]");

  if (!link) return;

  event.preventDefault();
  navigate(link.href);
});

window.addEventListener("popstate", updateView);

const init = async () => {
  try {
    restaurants = await getRestaurants();
    setupFilters(restaurants, renderRestaurants);
    updateView();
  } catch (error) {
    console.error(error);
    renderRestaurantsError(
      "Could not load restaurants. Please try again later.",
    );
  }
};

init();
