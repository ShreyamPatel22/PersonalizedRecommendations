const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tmdbId: { type: String, required: true },
    popularity: { type: Number }
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
