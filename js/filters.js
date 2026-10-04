import { getCurrentUser } from "./auth.js";
import { getFavourites } from "./favourites.js";

const searchInput = document.querySelector("[data-search]");
const citySelect = document.querySelector("[data-filter-city]");
const companySelect = document.querySelector("[data-filter-company]");
const favouritesField = document.querySelector("[data-favourites-field]");
const favouritesCheckbox = document.querySelector("[data-filter-favourites]");

const fillSelect = (select, values) => {
  const uniqueValues = [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, "fi"),
  );
  uniqueValues.forEach((value) => select.append(new Option(value, value)));
};

// Set up the filter controls and render matching restaurants.
export const setupFilters = (restaurants, onChange) => {
  fillSelect(
    citySelect,
    restaurants.map((restaurant) => restaurant.city),
  );
  fillSelect(
    companySelect,
    restaurants.map((restaurant) => restaurant.company),
  );

  const applyFilters = () => {
    const searchText = searchInput.value.trim().toLowerCase();

    // Only logged-in users can filter by favourites.
    const user = getCurrentUser();
    favouritesField.hidden = !user;
    if (!user) favouritesCheckbox.checked = false;
    const favourites = user ? getFavourites(user) : [];

    const filteredRestaurants = restaurants.filter(
      (restaurant) =>
        (restaurant.name.toLowerCase().includes(searchText) ||
          restaurant.city.toLowerCase().includes(searchText)) &&
        (!citySelect.value || restaurant.city === citySelect.value) &&
        (!companySelect.value || restaurant.company === companySelect.value) &&
        (!favouritesCheckbox.checked || favourites.includes(restaurant._id)),
    );

    onChange(filteredRestaurants);
  };

  searchInput.addEventListener("input", applyFilters);
  citySelect.addEventListener("change", applyFilters);
  companySelect.addEventListener("change", applyFilters);
  favouritesCheckbox.addEventListener("change", applyFilters);

  // Refresh the list when account or favourite state changes.
  document.addEventListener("userchange", applyFilters);
  document.addEventListener("favouriteschange", applyFilters);

  // Render the initial list.
  applyFilters();
};
