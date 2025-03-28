from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import requests

load_dotenv()
app = Flask(__name__)

API_KEY = os.getenv("API_KEY") 
BASE_URL = "https://api.themoviedb.org/3"

def search_movie(movie_name, page=1):
    """Fetch movie details from TMDb API and sort by release date."""
    url = f"{BASE_URL}/search/movie?api_key={API_KEY}&query={movie_name}&page={page}"
    response = requests.get(url)
    data = response.json()
    movies = sorted(data["results"], key=lambda x: x.get("release_date", ""), reverse=True)
    return movies

def get_movie_details(movie_id):
    """Fetch detailed movie info from TMDb API."""
    url = f"{BASE_URL}/movie/{movie_id}?api_key={API_KEY}"
    response = requests.get(url)
    return response.json()

def get_movie_trailer(movie_id):
    """Fetch the movie trailer from YouTube."""
    url = f"{BASE_URL}/movie/{movie_id}/videos?api_key={API_KEY}"
    response = requests.get(url)
    videos = response.json().get("results", [])
    trailer = next((video for video in videos if video["type"] == "Trailer"), None)
    return trailer

@app.route("/")
def home():
    """Load the first 20 most recently released movies."""
    movies = search_movie("", page=1)[:20]
    return render_template("index.html", movies=movies)

@app.route("/search", methods=["GET"])
def search():
    movie_name = request.args.get("query", "")
    page = request.args.get("page", 1, type=int)
    movies = search_movie(movie_name, page)
    return jsonify(movies)

@app.route("/movie/<int:movie_id>")
def movie_details(movie_id):
    movie = get_movie_details(movie_id)
    trailer = get_movie_trailer(movie_id)
    return render_template("details.html", movie=movie, trailer=trailer)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
