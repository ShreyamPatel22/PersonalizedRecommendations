const API_BASE_URL = "http://localhost:5002";

// Function to search for movies based on user input
function searchMovies() {
    const query = document.getElementById("searchInput").value; // Get search input

    // Get movie search results from the API
    fetch(`${API_BASE_URL}/search?query=${query}`)
    .then(response => response.json()) // Convert to JSON
    .then (movies => {
        const searchResults = document.getElementById("searchResults");
        searchResults.innerHTML = ""; // Clear previous search results

        // Loop through recommended movies and display them
        movies.forEach(movie => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            
            // Create a "Like" button for each movie
            const likeButton = document.createElement("button");
            likeButton.textContent = "Like";
            likeButton.onclick = () => likeMovie(movie.title); // Add like functionality

            li.appendChild(likeButton); // Attach button to movie list item
            searchResults.appendChild(li); // Append movie to search results
        });
    })
    .catch(error => console.error("Error searching movies:", error)); // Handle errors
}


//Function to "Like" a movie and add it to liked movies list
function likeMovie(movieTitle) {
    const likedMovies = document.getElementById("likedMovies"); // Get the liked movies list

    const li = document.createElement("li");
    li.textContent = movieTitle;
    likedMovies.appendChild(li); // Add liked movie to the list

    // Send the liked movie to the server
    fetch(`${API_BASE_URL}/preferences/user1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieTitle: movieTitle })
    })
    .then(response => response.json()) // Convert response to JSON
    .then(data => console.log("Movie liked:", data)) // Log success message
    .catch(error => console.error("Error liking movie:", error)); // Handle errors
}

// Function to get personalized movie recommendations
function getRecommendations() {
    // Get movie recommendation from the API
    fetch(`${API_BASE_URL}/recommendations/user1`)
    .then(response => response.json()) // Convert response to JSON
    .then(movies => {
        const recommendations = document.getElementById("recommendations");
        recommendations.innerHTML = ""; // Clear previous results

        // Loop through recommended movies and display them
        movies.forEach(movie => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            recommendations.appendChild(li); //Add to recommendations list
        });
    })
    .catch(error => console.error("Error fetching recommendations:", error)); // Handle errors
}

