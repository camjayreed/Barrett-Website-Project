package backend

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func backend() {
	current_user := [...]string{}
	fmt.Print(current_user)

	// JWT Setup

	// SQLite Setup
	// Open database connection
	// SQLite creates the file if it does not exist
	db, err := sql.Open("sqlite3", "./app.db")
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

	// API Endpoints
}
