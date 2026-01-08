/** 
 * Content-based movie recommendation system
 * Uses TF-IDF + cosine similarity to recommend movies based on plot descriptions.
 */


/* ---- Text Processing ---- */
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 2);
}

/* ---- Text Processing ---- */
function computeTF(tokens) {
  const tf = {};
  tokens.forEach(t => (tf[t] = (tf[t] || 0) + 1));

  const len = tokens.length || 1;
  for (const term in tf) tf[term] = tf[term] / len;
  return tf;
}

function computeIDF(documents) {
  const idf = {};
  const totalDocs = documents.length || 1;

  documents.forEach(doc => {
    const seen = new Set(doc);
    seen.forEach(term => (idf[term] = (idf[term] || 0) + 1));
  });

  for (const term in idf) {
    idf[term] = Math.log(totalDocs / (1 + idf[term]));
  }
  return idf;
}

function computeTFIDF(tf, idf) {
  const tfidf = {};
  for (const term in tf) {
    if (idf[term]) {
      tfidf[term] = tf[term] * idf[term];
    }
  }
  return tfidf;
}

/* ---- Cosine Similarity ---- */
function cosineSimilarity(vecA, vecB) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (const term in vecA) {
        if (vecB[term]) {
            dot += vecA[term] * vecB[term];
        }
        magA += vecA[term] * vecA[term];
    }

    for (const term in vecB) {
        magB += vecB[term] ** 2;
    }
    return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

/* ---- Recommendation Logic ---- */
function buildFeatureText(movie) {
  return `${movie.title || ""} ${movie.genre || ""} ${movie.overview || ""}`;
}

function recommendMovies(userLikes, allMovies, topK = 5) {
    if (!userLikes.length) return [];

    // Build documents
    const movieDocs = allMovies.map(m => tokenize(buildFeatureText(m)));
    const idf = computeIDF(movieDocs);

    // Build TF - IDF vectors for all movies
    const tfidfVectors = movieDocs.map(doc => 
        computeTFIDF(computeTF(doc), idf)
    );

    // Build user profile vector
    const userVec = {};
    let count = 0;

    userLikes.forEach(liked => {
        const idx = allMovies.findIndex(m => m.id === liked.id);
        if (idx === -1) return;

        const vec = tfidfVectors[idx];
        for (const term in vec) {
            userVec[term] = (userVec[term] || 0) + vec[term];

        }
        count++;
    });

    for (const term in userVec) {
        userVec[term] /= count;
    }

    // Score all movies
    const indexById = new Map(allMovies.map((m, i) => [m.id, i]));

    const scored = allMovies
        .filter(m => !userLikes.some(l => l.id === m.id))
        .map(movie => {
            const i = indexById.get(movie.id);
            return {
            movie,
            score: cosineSimilarity(userVec, tfidfVectors[i])
        };
    })
    .sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.movie);
}

module.exports = {
    recommendMovies
};