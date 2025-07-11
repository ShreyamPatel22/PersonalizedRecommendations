# Personalized Movie Recommendation System

A web application that provides personalized movie recommendations using the TMDB (The Movie Database) API.

## Features

- **Movie Search**: Search for movies by title
- **Like Movies**: Save movies you like to build your preference profile
- **Personalized Recommendations**: Get movie recommendations based on your liked movies
- **Real-time Updates**: See your liked movies update in real-time
- **Beautiful UI**: Modern, responsive design with smooth animations

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **API**: TMDB API for movie data
- **Storage**: In-memory storage (can be extended to database)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- TMDB API key (free from https://www.themoviedb.org/settings/api)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PersonalizedReccomandations
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your TMDB API key to `.env`:
     ```
     TMDB_API_KEY=your_api_key_here
     PORT=5002
     ```

4. Start the server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5002`

## API Endpoints

### Movies
- `GET /movies` - Get popular movies
- `GET /search?query=<movie_title>` - Search movies by title

### User Preferences
- `POST /preferences/:userId` - Add a movie to user's liked movies
- `GET /preferences/:userId` - Get user's liked movies
- `GET /recommendations/:userId` - Get personalized recommendations

### Health Check
- `GET /` - Check if API is running

## Usage

1. **Search for Movies**: Use the search bar to find movies
2. **Like Movies**: Click the "Like" button on movies you enjoy
3. **Get Recommendations**: Click "Get Recommendations" to see personalized suggestions
4. **View Liked Movies**: See all your liked movies in the "Your Liked Movies" section

## File Structure

```
PersonalizedReccomandations/
├── config/
│   └── db.js                 # Database configuration (future use)
├── controllers/
│   └── movieController.js    # Movie-related logic
├── models/
│   ├── Movie.js             # Movie model
│   └── User.js              # User model
├── routes/
│   ├── movies.js            # Movie routes
│   └── users.js             # User routes
├── utils/
│   └── recommendations.js   # Recommendation algorithms
├── .env                     # Environment variables
├── index.html              # Frontend HTML
├── script.js               # Frontend JavaScript
├── server.js               # Main server file
├── styles.css              # Frontend styles
└── package.json            # Project dependencies
```

## Recent Fixes

 **Fixed Issues:**
- Fixed route typo in `/preferences/:userId`
- Corrected API endpoint calls in frontend
- Fixed movie recommendation algorithm to work with titles
- Added proper error handling
- Improved package.json with scripts and metadata
- Fixed HTML structure and CSS classes
- Added comprehensive README

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication
- Advanced recommendation algorithms
- Movie ratings and reviews
- Social features (sharing recommendations)
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Contact

For questions or support, please contact Shreyam Patel.
