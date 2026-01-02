from flask import Flask, render_template
from flask_cors import CORS
from flask import request, jsonify
import sqlite3
import json
import os
import bcrypt

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
            (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)"""
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

    cur.execute(f"SELECT * FROM users WHERE username = '{user['username']}'")
    rows = cur.fetchall()
    user_fixed = tuple(user.values())

    for x in rows:
        if user_fixed == x[1:]:
            print("user already exists")
            return {"status": "exists"}, 401

    else:
        password = user["password"]
        bytes = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(bytes, salt)

        cur.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (user["username"], hash),
        )
        con.commit()

        for row in cur.execute("""SELECT * FROM  users"""):
            print(row)

        return {"status": "ok"}, 200


# this is where our real users login information is handled
@app.route("/real_login", methods=["POST"])
def real_login():
    login_real = request.get_json()
    global current_user
    cur.execute(f"SELECT * FROM users WHERE username = '{login_real['username']}'")
    rows = cur.fetchall()
    user_fixed = tuple(login_real.values())

    for x in rows:
        if user_fixed[0] == x[1] and bcrypt.checkpw(user_fixed[1].encode("utf-8"), x[2]):
            current_user = x[1]
            print("user logged in")
            return {"status": "ok"}, 200
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


