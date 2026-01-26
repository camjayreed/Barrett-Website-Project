1. Introduction:
    This is a beginner web development project designed to help me gain experience coding real world features. 
    Each feature of the site was a challenge given to me by a more experienced developer, my job was to implement it, figure out the logic, and make it work.

2. Setup:
    Prerequisites are found in requirements.txt
    Setup a .env file in the project root using the environment variables listed
    SQLite database file will be made upon running backend.py

3. Environment Variables:
    FLASK_SECRET_KEY=your_secret_key -> int
    JWT_SECRET_KEY=your_secret_key -> int

4. Features:
    User:
        User authentication (sign-up, login, logout)
        Persistent user data with SQLite
    
    User Features:
        An input textbox to send strings to the backend via post api request

        A button that will play an animation and send a notification of its press to the backed via post api request

        Real-time article uploading and display
        Persistent article history with SQLite

    User Games:
        A "Tile Frenzy" like game, where a user is given a 9x9 grid 13 of which will be white, and the rest black.
        Upon clicking a black tile a new one will spawn, and you will be given a point.
        Your goal is to click as many as possible before the timer runs out.

5. Running the Application:
    Complete the setup process
    Run backend.py
    Connect to the site at http://127.0.0.1:5000

6. Technologies Used:
    Frontend: HTML, JavaScript, CSS
    Backend: Python, SQLite, JWT (JSON Web Tokens)