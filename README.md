# CineVault 🎬

CineVault is a full-stack web application that allows users to discover, rate, and save their favorite movies. It features a beautiful, glassmorphic UI and integrates with The Movie Database (TMDB) to provide real-time, dynamic movie data.

## Tech Stack

- **Frontend**: React, Vite, React Router, CSS (Vanilla with Glassmorphism UI)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT) and bcrypt
- **External API**: The Movie Database (TMDB) API

## Features

- **Modern Aesthetics**: Sleek dark mode design with glassmorphism panels, gradient texts, and micro-animations.
- **User Authentication**: Secure signup and login functionality.
- **Dynamic Movie Data**: Fetches real-time trending movies and search results using the TMDB API.
- **Movie Details**: View in-depth information about any movie, including runtime, release year, genres, and overviews.
- **Rating System**: Authenticated users can rate movies from 1 to 5 stars.
- **Saved Lists**: Users can create lists (e.g., "Watchlist") and add movies to them.
- **User Profile**: A personalized dashboard displaying the user's lists and rated movies.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB account (Atlas cluster or local instance)
- TMDB API Key (Create an account at [themoviedb.org](https://www.themoviedb.org/) to get a free API key)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jason-131/cineVault.git
   cd cineVault
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory using the provided sample:
   ```bash
   cp .env.example .env
   ```
   *Make sure to fill in your actual `MONGO_URI` and `TMDB_API_KEY` in the newly created `.env` file.*

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You will need to run the backend and frontend servers simultaneously in two separate terminals.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will now be running locally at `http://localhost:5173`.