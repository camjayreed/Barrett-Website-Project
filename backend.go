package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "modernc.org/sqlite"
)

func main() {
	current_user := [...]string{}
	fmt.Print(current_user)

	// JWT Setup

	// SQLite Setup
	// Open database connection
	// SQLite creates the file if it does not exist
	db, err := sql.Open("sqlite", "./app.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	defer db.Close()

	// Verify the connection is working
	// stores the result of ping in err, err (the result of ping) will then be checked against
	// err != nil, if an error occurs then we will run the rest of the block, if not then we continue
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database %v", err)
	}
	fmt.Println("Successfully connected to SQLite database")

	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			password_hash TEXT NOT NULL
		);
		
		CREATE TABLE IF NOT EXISTS articles (
			id	INTEGER PRIMARY KEY AUTOINCREMENT, 
			title TEXT NOT NULL, 
			username TEXT NOT NULL, 
			link TEXT NOT NULL
		);`); err != nil {
		fmt.Print("Failed to create db tables")
	}

	// Main Code Section

	// Handlers
	// Serve assets from the static directory under /static/ URL path.
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	// homepage handler
	// function takes two parameters: ‘w’, which is an http.ResponseWriter that is used to write the response back to the client,
	// and ‘r’, which is an http.Request that contains information about the incoming request.
	home := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "templates/index.html")
	}

	register := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "templates/register.html")
	}

	login := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "templates/login.html")
	}

	tilefrenzy := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "templates/tilefrenzy.html")
	}

	// Routes
	// route to homepage
	// HandleFunc takes an address and a function
	http.HandleFunc("/", home)
	// register route
	http.HandleFunc("/register", register)
	// login route
	http.HandleFunc("/login", login)
	// tilefrenzy route
	http.HandleFunc("/tilefrenzy", tilefrenzy)

	// API Handlers
	send_text := func(w http.ResponseWriter, r *http.Request) {
		res, err := http.Get()
	}

	// API Endpoints
	http.HandleFunc("/send_text", send_text)

	fmt.Print("Please connect at: http://localhost:8080") // simple print statement letitng use know where site is hosted
	http.ListenAndServe(":8080", nil)                     // Listening port for server, code after this WILL NOT RUN
}
