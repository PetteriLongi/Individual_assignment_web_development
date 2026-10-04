import { getCurrentUser } from "./auth.js";
import { createElement } from "./helpers.js";
import { createFavouriteButton, getFavourites } from "./favourites.js";

const restaurantGrid = document.querySelector(".restaurant-grid");
const restaurantCount = document.querySelector("[data-restaurant-count]");

// A null value means the user is signed out.
const createRestaurantCard = (restaurant, favourites) => {
  const card = createElement("div", "restaurant-card");

  const link = createElement("a", "restaurant-link");
  link.href = `?restaurant=${restaurant._id}`;
  link.dataset.nav = "";

  const imageWrapper = createElement("div", "restaurant-image");
  const image = document.createElement("img");
  image.src = "images/placeholder_image.png";
  // The card already contains the restaurant name.
  image.alt = "";
  imageWrapper.append(image);

  const body = createElement("div", "restaurant-card-body");
  body.append(
    createElement("span", "restaurant-index", restaurant.city),
    createElement("b", "", restaurant.name),
    createElement("span", "", restaurant.address),
    createElement("span", "restaurant-meta", restaurant.company),
  );

  link.append(imageWrapper, body);
  card.append(link);

  // Show favourite controls only for logged-in users.
  if (favourites) {
    const isFavourite = favourites.includes(restaurant._id);
    card.classList.toggle("favourite", isFavourite);
    card.append(createFavouriteButton(restaurant._id, isFavourite));
  }

  return card;
};

export const renderRestaurants = (restaurants) => {
  restaurantCount.textContent = restaurants.length;

  if (restaurants.length === 0) {
    restaurantGrid.replaceChildren(
      createElement("p", "", "No restaurants match your search."),
    );
    return;
  }

  // Keep focus when the cards are rebuilt.
  const active = document.activeElement;
  const focusedId = restaurantGrid.contains(active)
    ? active.dataset.restaurantId
    : null;

  const user = getCurrentUser();
  const favourites = user ? getFavourites(user) : null;

  const cards = restaurants.map((restaurant) =>
    createRestaurantCard(restaurant, favourites),
  );

  restaurantGrid.replaceChildren(...cards);

  if (focusedId) {
    restaurantGrid
      .querySelector(`[data-restaurant-id="${focusedId}"]`)
      ?.focus();
  }
};

export const renderRestaurantsError = (message) => {
  restaurantGrid.replaceChildren(createElement("p", "", message));
};
