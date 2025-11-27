# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

1) Copy environment file:
   cp .env.example .env
   Adjust values if your backend is on a different host/port.

2) Start the app:
   npm install
   npm start

The app runs in development mode.
Open http://localhost:3000 to view it in your browser.

### Scripts

- `npm start` – start dev server
- `npm test` – run tests
- `npm run build` – production build
- `npm run eject` – eject configuration

## Environment

Key variables used by the app (see .env.example for full list):
- REACT_APP_API_BASE (default http://localhost:3001/api)
- REACT_APP_BACKEND_URL (default http://localhost:3001)
- REACT_APP_FRONTEND_URL (default http://localhost:3000)
- REACT_APP_WS_URL (default http://localhost:3001/api/events)
- REACT_APP_HEALTHCHECK_PATH (default /)

The app resolves the API base in this order:
1. REACT_APP_API_BASE (used as-is)
2. REACT_APP_BACKEND_URL + "/api" if not present
3. http://localhost:3001/api

## Post-update checks

- Backend CORS allows http://localhost:3000
- Backend health route (/) responds OK
- All /api routes respond according to the OpenAPI spec
- Database connection is successful on backend startup and schema is applied
- Smoke test: create room, join with a second player, submit moves, verify status and history update

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`.

### Components

This template uses pure HTML/CSS components. Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting
Moved: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size
Moved: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App
Moved: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration
Moved: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment
Moved: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify
Moved: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
