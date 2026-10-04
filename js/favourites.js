import { getCurrentUser } from "./auth.js";
import { createElement } from "./helpers.js";
import { translate } from "./language.js";

// Store favourites locally for each user.

const getKey = (user) => `favourites-${user._id}`;

export const getFavourites = (user) =>
  JSON.parse(localStorage.getItem(getKey(user))) ?? [];

// Toggle one restaurant in the user's favourites.
const toggleFavourite = (user, restaurantId) => {
  const favourites = getFavourites(user);

  const updatedFavourites = favourites.includes(restaurantId)
    ? favourites.filter((id) => id !== restaurantId)
    : [...favourites, restaurantId];

  localStorage.setItem(getKey(user), JSON.stringify(updatedFavourites));

  // Notify the list, filters and menu view.
  document.dispatchEvent(new Event("favouriteschange"));
};

// Create the shared favourite button.
export const createFavouriteButton = (restaurantId, isFavourite) => {
  const buttonText = translate(isFavourite ? "unfavourite" : "favourite");
  const button = createElement("button", "favourite-button", buttonText);
  button.type = "button";
  button.dataset.restaurantId = restaurantId;
  button.classList.toggle("is-favourite", isFavourite);
  return button;
};

// Handle buttons created after the page has loaded.
document.addEventListener("click", (event) => {
  const button = event.target.closest(".favourite-button");
  if (!button) return;

  toggleFavourite(getCurrentUser(), button.dataset.restaurantId);
});

document.addEventListener("languagechange", () => {
  document.dispatchEvent(new Event("favouriteschange"));
});
