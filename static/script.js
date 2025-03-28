document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");
    const resultsDiv = document.getElementById("results");
    const paginationDiv = document.getElementById("pagination");
    let currentPage = 1;
    let isLoading = false;

    async function loadMovies(query = "", page = 1) {
        if (isLoading || (page === 1 && !query)) return;
        
        isLoading = true;
        resultsDiv.classList.add("loading");
        
        try {
            const response = await fetch(`/search?query=${encodeURIComponent(query)}&page=${page}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (page === 1) {
                resultsDiv.innerHTML = "";
                currentPage = 1;
            }
            
            if (data.length === 0 && page === 1) {
                resultsDiv.innerHTML = `<div class="no-results">No movies found. Try a different search.</div>`;
                paginationDiv.innerHTML = "";
                return;
            }
            
            data.forEach(movie => {
                const movieCard = document.createElement("div");
                movieCard.className = "movie-card";
                movieCard.innerHTML = `
                    <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/static/images/no-poster.webp'}" 
                         alt="${movie.title}" 
                         class="movie-poster"
                         onerror="this.src='/static/no-image.jpg'">
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.title}</h3>
                        <p class="movie-year">${movie.release_date ? movie.release_date.substring(0,4) : 'N/A'}</p>
                        
                        <p class="movie-rating">
                            <i class="fas fa-star"></i>
                            ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                        </p>
                    </div>
                `;
                movieCard.addEventListener("click", () => {
                    window.location.href = `/movie/${movie.id}`;
                });
                resultsDiv.appendChild(movieCard);
            });
            
            // Load more button logic
            if (data.length >= 20) { 
                currentPage = page;
                paginationDiv.innerHTML = `
                    <button id="load-more" class="load-more-btn">
                        <i class="fas fa-plus"></i> Load More
                    </button>
                `;
                document.getElementById("load-more").addEventListener("click", () => {
                    loadMovies(query, currentPage + 1);
                });
            } else {
                paginationDiv.innerHTML = "";
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            resultsDiv.innerHTML = `<div class="error">Failed to load movies. Please try again.</div>`;
        } finally {
            isLoading = false;
            resultsDiv.classList.remove("loading");
        }
    }

   
    let searchTimeout;
    searchBox.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        const query = searchBox.value.trim();
        searchTimeout = setTimeout(() => loadMovies(query), 500);
    });
    
   
    loadMovies();
});


