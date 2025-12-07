# 🎬 Movie Search

This project is a fullstack React + Express application that allows users to:
- Search movies by title using the TMDb API
- Build a personal watchlist
- Provide an email address to receive their selected movies
- Secure requests with JWT stored in cookies
- Serve the React frontend directly from the Express backend

---

## ⚙️ Installation

### `npm install`
Run this command in the root directory to install backend dependencies.  
Then run it inside the `front` directory to install frontend dependencies.

---

## ▶️ Running the Project

### Build Frontend
From the `front` directory:
```bash
npm run build

### Backend
Start the Express server locally on port **4001**:
node server.js

🔑 Environment Variables
Create a .env file in the project root with the following:

API_KEY
Your TMDB API Key used to fetch movie data.

JWT_KEY
The JWT secret used to sign and verify tokens.

EMAIL_USER
The email address used by Nodemailer to send messages.

EMAIL_PASS
The password or app password for the email account.

PORT
(Optional) Port for the backend server. Defaults to 4001.

📡 Features
🔍 Search movies by title using TMDb API

📝 Build a playlist of selected movies

📧 Send email with your watchlist using Nodemailer

🔐 JWT authentication stored in cookies for secure requests

🎨 React frontend styled with modern UI and emoji accents

📜 License
Copyright (c) 2025 Elvis Dovi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.