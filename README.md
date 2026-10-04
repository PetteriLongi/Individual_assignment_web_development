# Campus Table

Campus Table is a vanilla JavaScript web application for finding student
restaurants in Finland and viewing their daily and weekly menus.

## Features

- Lists restaurants from the restaurant API
- Searches restaurants by name or city
- Filters restaurants by city and service provider
- Shows daily and weekly menus
- Supports English and Finnish
- Allows users to register, sign in, and log out
- Allows logged-in users to edit their profile
- Allows users to upload a profile picture
- Allows users to save favourite restaurants

## Technologies

- HTML
- CSS
- Vanilla JavaScript
- JavaScript modules
- Fetch API
- Metropolia restaurant REST API

## Running locally

This project does not need a build tool or package installation.

1. Clone or download the project.
2. Open the `Individual_assignment_web` folder.
3. Start a local web server in that folder.
4. Open the local address shown by the server in a browser.

For example, with the VS Code **Live Server** extension, right-click
`index.html` and choose **Open with Live Server**.

The project uses JavaScript modules, so opening `index.html` directly from the
file system may not work correctly in every browser.

## API access

The application uses the Metropolia restaurant API. Restaurant and menu data
may only be available when connected to the Metropolia network or VPN.

## Project structure

```text
Individual_assignment_web/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── favourites.js
│   ├── filters.js
│   ├── helpers.js
│   ├── language.js
│   ├── main.js
│   ├── menu.js
│   └── restaurants.js
├── images/
│   └── placeholder_image.png
```



## Notes

- Login tokens are stored in the browser's local storage.
- Favourite restaurants are stored locally for each user.
- Do not commit passwords, tokens, or `.env` files.
- For accessibility I added a focus restoring to restaurant.js and menu.js so a keyboard user wont lose their place when rerendered.
- A request guard to menu.js so quick switching between menus cant cause older server response to overwrite new ones
