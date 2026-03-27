package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"io"
	"log"
	"net/http"

	_ "modernc.org/sqlite"
)

// globals
var current_user string
var str_hash string

func main() {

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
			name TEXT NOT NULL UNIQUE,
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
	// Send Text Handler
	send_text := func(w http.ResponseWriter, r *http.Request) {
		data, err := io.ReadAll(r.Body) // read incoming text and store it as a byte
		if err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		fmt.Println(string(data))    // convert the byte to a readable string and print our resulting data to console
		_, _ = w.Write([]byte("ok")) // returns ok to the browser
	}

	// Register User Handler

	register_user := func(w http.ResponseWriter, r *http.Request) {
		type RegisterPayload struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		var user RegisterPayload

		err := json.NewDecoder(r.Body).Decode((&user))
		if err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		var id int
		var username string
		var password_hash string

		row := db.QueryRow("SELECT * FROM users WHERE name = ?", user.Username)

		if err := row.Scan(&id, &username, &password_hash); err == sql.ErrNoRows { // Scan copies the columns from the matched row into the values
			fmt.Println("no user found, safe to register")

			// hash and salt users password
			// get users pass as byte
			hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.MinCost)
			if err != nil {
				log.Println(err)
			}

			str_hash := string(hash)

			stmt, err := db.Prepare("INSERT INTO users (name, password_hash) VALUES (?, ?)")
			if err != nil {
				log.Fatal(err)
			}
			defer stmt.Close()

			_, err = stmt.Exec(user.Username, str_hash)
			if err != nil {
				log.Fatal(err)
			}
			fmt.Println("User successfully created")
			_, _ = w.Write([]byte("200"))
		} else {
			fmt.Println("user already exists")
			_, _ = w.Write([]byte("401"))
		}
	}

	login_user := func(w http.ResponseWriter, r *http.Request) {
		type LoginPayload struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		var user LoginPayload

		err := json.NewDecoder(r.Body).Decode((&user))
		if err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		var id int
		var username string
		var password_hash string

		row := db.QueryRow("SELECT * FROM users WHERE name = ?", user.Username)

		err = row.Scan(&id, &username, &password_hash)
		if err == sql.ErrNoRows {
			// user not found
			_, _ = w.Write([]byte("401"))
			return
		}
		if err != nil {
			// db error
			_, _ = w.Write([]byte("400"))
			return
		}
		if bcrypt.CompareHashAndPassword([]byte(password_hash), []byte(user.Password)) != nil {
			// bad password
			_, _ = w.Write([]byte("401"))
			return
		}

		// else
		current_user = user.Username
		fmt.Println("user logged in")
		_, _ = w.Write([]byte("200"))
	}

	// API Endpoints
	http.HandleFunc("/send_text", send_text)

	http.HandleFunc("/register_user", register_user)

	http.HandleFunc("/real_login", login_user)

	fmt.Println("Please connect at: http://localhost:8080") // simple print statement letitng use know where site is hosted
	http.ListenAndServe(":8080", nil)                       // Listening port for server, code after this WILL NOT RUN
}
