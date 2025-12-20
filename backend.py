from flask import Flask, render_template
from flask_cors import CORS
from flask import request, jsonify
import sqlite3
import json
import os

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/register", methods=["GET"])
@app.route("/login", methods=["GET"])
def render_template_page():
    file_name = request.path.replace("/", "")
    template = f"{file_name}.html"

    return render_template(template)


# this section is gpt code, becuase i couldnt find out how to run the db file in my project folder
# # before this it wanted to make one outside of it everytime i ran my backend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(
    BASE_DIR,
    "database.db",
)
print("USING DB FILE:", DB_PATH)

con = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = con.cursor()

# making a table on launch if it doesnt exist, so people without the database wont die
cur.execute(
    """CREATE TABLE IF NOT EXISTS users
            (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL UNIQUE)"""
)


# When homepage button is pressed this will just return some text to our terminal
@app.get("/button_pressed")
def button_pressed():
    print("Button Pressed on Frontend!")
    return "status: ok"


# When text is sent from out homepage this will grab the text sent from our frontend and print out a decoded version of it to our terminal
@app.route("/send_text", methods=["POST"])
def send_text():
    byte_string = request.get_data()
    decoded_string = byte_string.decode()
    print(f"User Entered: {decoded_string}")
    return "status: ok"


# storing registered users here
users = []
current_user = []


# this is where our user can create and account and have it added to the serverside for login
@app.route("/register", methods=["POST"])
def register():
    user = request.get_json()
    
    cur.execute("SELECT * FROM users")
    rows = cur.fetchall()
    user_fixed = tuple(user.values())

    for x in rows:
        if user_fixed == x[1:]:
            print("user already exists")
            return {"status": "exists"}, 401

    else:
        cur.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (user["username"], user["password"]),
        )
        con.commit()

        for row in cur.execute("""SELECT * FROM  users"""):
            print(row)

        return {"status": "ok"}, 200


# this is where our real users login information is handled
@app.route("/real_login", methods=["POST"])
def real_login():
    login_real = request.get_json()

    if login_real in users:
        print(
            login_real
        )  # this is where we can do things with our user, after they succesfully log in
        global current_user
        current_user = login_real

        return jsonify({"status": "ok"}), 200
    else:
        return (
            jsonify({"status": "error", "message": "Invalid username or password"}),
            401,
        )


# my interesting implementation of displaying the current logged in user on the homepage
@app.route("/current_user", methods=["POST"])
def current_user_check():
    if current_user:
        print("sending current user")
        return jsonify(current_user), 200

    else:
        return jsonify({"status": "error", "message": "user does not exist"})


# This is currently running our backend in debug mode, so that when changes are made they update automatically
if __name__ == "__main__":
    app.run(debug=True)
