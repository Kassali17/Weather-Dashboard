# Weather Dashboard

A single-page React app that shows current weather for any city, built to demonstrate
React fundamentals: state management, side effects, API calls, and conditional rendering.

## What it does

- Search any city and see current temperature, condition, humidity, wind, and "feels like."
- Background gradient changes based on the weather condition (clear, cloudy, rainy, snowy, stormy, misty).
- Remembers your last search using `localStorage` and reloads it automatically on next visit.
- Handles loading and error states gracefully (city not found, bad API key, network issues).

## Tech used

React 18 · Vite · OpenWeatherMap API · plain CSS (no framework)

## Concepts this project demonstrates (for your resume/interviews)

- `useState` for form input, loading/error/success status, and weather data
- `useEffect` for loading the last-searched city on mount and syncing the document title
- `fetch` with `async/await`, including proper error handling for different HTTP status codes
- Conditional rendering driven by a single `status` state machine (`idle` → `loading` → `success`/`error`)
- Environment variables for keeping the API key out of source control

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api):
   - Sign up → go to the "API keys" tab in your account → copy the default key.
   - New keys can take up to 10–15 minutes to activate.

3. Copy `.env.example` to `.env` and paste in your key:
   ```
   cp .env.example .env
   ```

4. Run it locally:
   ```
   npm run dev
   ```
   Open the URL Vite prints (usually `http://localhost:5173`).

## Deploying it (so you have a live link for your resume)

**Vercel (recommended, free):**
1. Push this folder to a new GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and import the repo.
3. In the project's Environment Variables settings, add `VITE_WEATHER_API_KEY` with your key.
4. Deploy — Vercel auto-detects Vite and builds it for you.

**Netlify** works the same way: import from GitHub, set the same environment variable,
build command `npm run build`, publish directory `dist`.

## Suggested resume bullet points once it's live

- "Built and deployed a React weather app consuming a live REST API, with loading/error
  states and persistent last-search via localStorage."
- "Implemented conditional UI rendering driven by asynchronous fetch requests, handling
  network errors and invalid input gracefully."

## Ideas to extend it further (optional, but strengthens the project)

- Add a 5-day forecast using OpenWeatherMap's forecast endpoint.
- Add geolocation ("use my current location") with the browser's Geolocation API.
- Add unit toggle (°C / °F).
- Add a search history dropdown instead of just remembering the last city.
