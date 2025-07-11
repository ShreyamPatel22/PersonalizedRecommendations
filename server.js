//Import dependencies
const express = require('express'); //express framework for building the server 
const cors = require('cors'); //enables Cross-Origin Resource Sharing (CORS) for frontend
const axios = require('axios'); //Axios is for making HTTP requests to TMDB API
require('dotenv').config(); // Loads environment variables from .env file

//Initialize App
const app = express();
//sets the server port. Default to 5002 if not provided
const PORT = process.env.PORT || 5002; 
//Gets the TMDB key from environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY;

//In memory storage for user preference. Temporary, will be replaced with a database
let userPreferences = {};

//Middleware configuration
app.use(express.json()); //allows JSON in parsing in requests bodies
app.use(cors({origin: '*'})); // Enables CORS for cross origin requests

//route to fetch popluar movies 
app.get('/movies', async(req, res)=> {
    try {
        //make a request to TMDB API to get popular movies
        const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: {api_key: TMDB_API_KEY, language: "en-US", page:1}
        });
        res.json(response.data.results); // send movie results as JSON response
    } catch (error) {
        res.status(500).json({error: "Error getting movies from TMDB"}); //handle API errors
    }
});

//route to search for movies by title
app.get('/search', async (req, res) => {
    const query = req.query.query //extract search query from request URL
    if(!query) {
        return res.status(400).json({error: 'Query parameter is required'}); //make sure that query is provided
    } try {
        //make response to TMDB API to search for movies
        const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
            params: {api_key: TMDB_API_KEY, language: "en-US", query}
        });
        res.json(response.data.results); //send search results as JSON response
    } catch (error) {
        res.status(500).json({error: "Error searching for movies"}); //handle API errors
    }
});

//Route to store user preference 
app.post('/preferences/:userId', (req, res) => {
    const { userId } = req.params; //extract userId from request URL
    const { movieTitle } = req.body; //extract movie title from request body

    if (!userPreferences[userId]) {
        userPreferences[userId] = []; //initialize user preferences if not already done
    }

    userPreferences[userId].push(movieTitle); //add movie title to user preferences

    res.json({message: 'Movies added to preferences', likedMovies: userPreferences[userId]}); //send success message with updated preferences
});

// route to get user preferences
app.get('/preferences/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json({ preferences: Array.from(userPreferences[userId] || []) });
});

//route to fetch recommendations based on user preferences
app.get('/recommendations/:userId', async (req, res) => {
    const userId = req.params.userId;
    const likedMovies = Array.from(userPreferences[userId] || []);
    if (likedMovies.length === 0) {
        return res.status(400).json({ error: 'No liked movies found for recommendations' });
    }
    try {
        const recommendations = [];
        const movieIds = [];
        
        // First, get movie IDs for the liked movie titles
        for (const movieTitle of likedMovies) {
            const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                params: { api_key: TMDB_API_KEY, language: "en-US", query: movieTitle }
            });
            if (searchResponse.data.results && searchResponse.data.results.length > 0) {
                movieIds.push(searchResponse.data.results[0].id);
            }
        }
        
        // Then get recommendations for each movie ID
        for (const movieId of movieIds) {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, {
                params: { api_key: TMDB_API_KEY, language: "en-US" }
            });
            recommendations.push(...response.data.results);
        }
        
        // Remove duplicates and return top 10
        const uniqueRecommendations = recommendations.filter((movie, index, self) => 
            index === self.findIndex(m => m.id === movie.id)
        );
        res.json(uniqueRecommendations.slice(0, 10));
    } catch (error) {
        console.error('Error fetching recommendations: ', error.message);
        res.status(500).json({ error: "Error fetching recommendations" });
    }
});

// Sample route to check if the API is running
app.get('/', (req, res) => {
    res.send("Movie Recommendation System API is running"); // Returns a text response
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log message when the server starts
});
