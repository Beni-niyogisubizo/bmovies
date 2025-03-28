# BMovie App

## Introduction
BMovie App is a web-based application that allows users to browse and search for movies. It utilizes Flask as the backend and is deployed using Gunicorn and Nginx on a cloud server.

## Features
- Browse trending and popular movies
- Search for movies by title
- View detailed movie information
- Responsive and user-friendly interface

## Technologies Used
- **Backend:** Flask, Gunicorn
- **Frontend:** HTML, CSS, JavaScript
- **Database:** N/A
- **Web Server:** Nginx
- **Load Balancer:** Nginx (for distributing requests)
- **API:** [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api)

---

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Python 3.x
- Pip (Python package manager)
- Nginx
- Gunicorn
- Curl

### Clone the Repository
```sh
$ git clone https://github.com/Beni-niyogisubizo/bmovies.git movie-app
$ cd movie-app
```

### Install Dependencies
```sh
$ pip install -r requirements.txt
```

### Set Up Environment Variables
Create a `.env` file in the root directory and add your API keys from API provider:
```sh
API_KEY=your_api_key_here
FLASK_ENV=production
```

### Run the Application Locally
```sh
$ python app.py #python3 app.py for unix users
```
The application should now be running on `http://127.0.0.1:5000`.

---

## Deployment Guide
### Server Setup
Ensure the necessary packages are installed:
```sh
$ sudo apt update
$ sudo apt install python3-pip python3-venv nginx
```

### Clone the Repository
```sh
$ git clone https://github.com/Beni-niyogisubizo/bmovies.git movie_app
$ cd movie_app
```


### Create a Virtual Environment
```sh
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

### Start Gunicorn
```sh
$ gunicorn --workers 3 --bind 0.0.0.0:8000 app:app
```

### Configure Nginx
Edit the Nginx configuration:
```sh
$ sudo nano /etc/nginx/sites-available/movie_app
```
Add the following configuration:
```nginx
server {
    listen 80;
    server_name domain_or_ip;  # Replaced by my server IP

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
Enable the configuration:
```sh
$ sudo ln -s /etc/nginx/sites-available/movie_app /etc/nginx/sites-enabled/
$ sudo systemctl restart nginx
```

---

## APIs Used
- **TMDb API**: Used for fetching movie data.
  - [Official Documentation](https://www.themoviedb.org/documentation/api)

---

## Challenges & Solutions
- **ModuleNotFoundError:** Encountered missing module errors during deployment. Resolved by ensuring dependencies were installed correctly using `pip install -r requirements.txt`.
- **502 Bad Gateway Error:** Fixed by properly configuring the Nginx reverse proxy.
- **Gunicorn Execution Issues:** Solved by verifying the virtual environment path in the systemd service file.

---

## Credits & Acknowledgments
- [TMDb API Developers](https://www.themoviedb.org/) for providing movie data.
- Flask & Gunicorn developers for making Python web applications scalable.


---

### Author
Developed by [Ben Niyogisubizo](https://github.com/Beni-niyogisubizo/).

---
