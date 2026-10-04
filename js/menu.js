import { getDailyMenu, getWeeklyMenu } from "./api.js";
import { getCurrentUser } from "./auth.js";
import { createElement } from "./helpers.js";
import { createFavouriteButton, getFavourites } from "./favourites.js";
import { getLanguage } from "./language.js";

const getEmptyMenuMessage = () =>
  getLanguage() === "fi"
    ? "Tälle ravintolalle ei ole saatavilla ruokalistaa."
    : "No menu is available for this restaurant.";

// Translate diet codes returned by the API.
const DIET_LABELS = {
  G: "Gluten-free",
  L: "Lactose-free",
  M: "Milk-free",
  VL: "Low lactose",
  VEG: "Vegan",
};

const menuTitle = document.querySelector("[data-menu-title]");
const menuAddress = document.querySelector("[data-menu-address]");
const menuContent = document.querySelector("[data-menu-content]");
const toggleButtons = document.querySelectorAll("[data-menu-type]");
const favouriteSlot = document.querySelector("[data-menu-favourite]");

let currentRestaurant = null;
let currentMenuType = "daily";
let latestRequest = 0;

const createMessage = (text) => createElement("p", "menu-message", text);

const createDietTags = (diets) => {
  const tags = createElement("div", "dietary-tags");
  const codes = diets.split(",").map((code) => code.trim());

  codes
    .filter(Boolean)
    .forEach((code) =>
      tags.append(
        createElement("span", "dietary-info", DIET_LABELS[code] ?? code),
      ),
    );

  return tags;
};

const createCourseCard = (course, headingTag) => {
  const card = createElement("article", "menu-card");
  card.append(createElement(headingTag, "", course.name));

  // Some menu items do not have a price.
  if (course.price)
    card.append(createElement("span", "menu-price", course.price));
  if (course.diets) card.append(createDietTags(course.diets));

  return card;
};

const createCourseGrid = (courses, className, headingTag) => {
  const grid = createElement("div", className);
  grid.append(...courses.map((course) => createCourseCard(course, headingTag)));
  return grid;
};

const createDailyMenu = ({ courses }) =>
  courses?.length
    ? createCourseGrid(courses, "menu-items-daily", "h3")
    : createMessage(getEmptyMenuMessage());

const createDaySection = (day) => {
  const section = createElement("section", "menu-day");
  section.append(
    createElement("h3", "", day.date),
    createCourseGrid(day.courses ?? [], "menu-items-weekly", "h4"),
  );
  return section;
};

const createWeeklyMenu = ({ days }) => {
  if (!days?.length) return createMessage(getEmptyMenuMessage());

  const week = createElement("div");
  week.append(...days.map(createDaySection));
  return week;
};

const updateToggle = () => {
  toggleButtons.forEach((button) => {
    const isActive = button.dataset.menuType === currentMenuType;
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const loadMenu = async () => {
  if (!currentRestaurant) return;

  // Prevent an older request from replacing newer menu data.
  const requestId = ++latestRequest;
  menuContent.replaceChildren(createMessage("Loading menu..."));

  try {
    const isDaily = currentMenuType === "daily";
    const fetchMenu = isDaily ? getDailyMenu : getWeeklyMenu;
    const menu = await fetchMenu(currentRestaurant._id, getLanguage());
    if (requestId !== latestRequest) return;

    menuContent.replaceChildren(
      isDaily ? createDailyMenu(menu) : createWeeklyMenu(menu),
    );
  } catch (error) {
    if (requestId !== latestRequest) return;
    console.error(error);
    menuContent.replaceChildren(
      createMessage("Could not load the menu. Please try again later."),
    );
  }
};

// Show the favourite button for logged-in users.
const showFavouriteButton = () => {
  const user = getCurrentUser();

  if (!user || !currentRestaurant) {
    favouriteSlot.replaceChildren();
    return;
  }

  // Restore focus when replacing the button.
  const hadFocus = favouriteSlot.contains(document.activeElement);

  const isFavourite = getFavourites(user).includes(currentRestaurant._id);
  const button = createFavouriteButton(currentRestaurant._id, isFavourite);
  favouriteSlot.replaceChildren(button);

  if (hadFocus) button.focus();
};

export const showMenu = (restaurant) => {
  currentRestaurant = restaurant;
  currentMenuType = "daily";

  menuTitle.textContent = restaurant.name;
  menuAddress.textContent = [
    restaurant.address,
    restaurant.postalCode,
    restaurant.city,
  ]
    .filter(Boolean)
    .join(", ");

  updateToggle();
  showFavouriteButton();
  loadMenu();
};

// Update the button when account or favourite state changes.
document.addEventListener("userchange", showFavouriteButton);
document.addEventListener("favouriteschange", showFavouriteButton);
document.addEventListener("languagechange", loadMenu);

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.menuType === currentMenuType) return;

    currentMenuType = button.dataset.menuType;
    updateToggle();
    loadMenu();
  });
});
