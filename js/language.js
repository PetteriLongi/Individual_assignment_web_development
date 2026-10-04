const LANGUAGE_KEY = "language";

const translations = {
  en: {
    signIn: "Sign in",
    signUp: "Sign up",
    profile: "Profile",
    logOut: "Log out",
    heroDescription: "Explore student restaurants across Finland.",
    chooseRestaurant: "Choose a restaurant",
    placesToEat: "places to eat",
    searchLabel: "Search by name or city",
    searchPlaceholder: "Search Helsinki, Tampere...",
    city: "City",
    provider: "Provider",
    allCities: "All cities",
    allProviders: "All providers",
    favouritesOnly: "Favourites only",
    allRestaurants: "All restaurants",
    dailyMenu: "Daily menu",
    weeklyMenu: "Weekly menu",
    signInTitle: "Sign In",
    username: "Username",
    password: "Password",
    profileTitle: "Your profile",
    email: "Email",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    profilePicture: "Profile picture",
    saveChanges: "Save changes",
    favourite: "Favourite",
    unfavourite: "Unfavourite",
  },
  fi: {
    signIn: "Kirjaudu",
    signUp: "Luo tili",
    profile: "Profiili",
    logOut: "Kirjaudu ulos",
    heroDescription: "Tutustu Suomen opiskelijaravintoloihin.",
    chooseRestaurant: "Valitse ravintola",
    placesToEat: "ruokapaikkaa",
    searchLabel: "Hae nimen tai kaupungin mukaan",
    searchPlaceholder: "Hae Helsinkiä, Tamperetta...",
    city: "Kaupunki",
    provider: "Palveluntarjoaja",
    allCities: "Kaikki kaupungit",
    allProviders: "Kaikki palveluntarjoajat",
    favouritesOnly: "Vain suosikit",
    allRestaurants: "Kaikki ravintolat",
    dailyMenu: "Päivän menu",
    weeklyMenu: "Viikon menu",
    signInTitle: "Kirjaudu",
    username: "Käyttäjänimi",
    password: "Salasana",
    profileTitle: "Profiilisi",
    email: "Sähköposti",
    newPassword: "Uusi salasana",
    confirmPassword: "Vahvista salasana",
    profilePicture: "Profiilikuva",
    saveChanges: "Tallenna muutokset",
    favourite: "Lisää suosikiksi",
    unfavourite: "Poista suosikeista",
  },
};

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) ?? "en";

export const getLanguage = () => currentLanguage;

export const translate = (key) => translations[currentLanguage][key] ?? key;

const updateText = () => {
  const texts = translations[currentLanguage];
  document.querySelectorAll("[data-language-text]").forEach((element) => {
    const key = element.dataset.languageText;
    if (texts[key]) element.textContent = texts[key];
  });

  document
    .querySelectorAll("[data-language-placeholder]")
    .forEach((element) => {
      const key = element.dataset.languagePlaceholder;
      if (texts[key]) element.placeholder = texts[key];
    });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === currentLanguage),
    );
  });
};

export const setLanguage = (language) => {
  if (!translations[language] || language === currentLanguage) return;

  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  updateText();
  document.dispatchEvent(new Event("languagechange"));
};

export const setupLanguage = () => {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () =>
      setLanguage(button.dataset.language),
    );
  });

  updateText();
};
