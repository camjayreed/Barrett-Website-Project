from flask import Flask, render_template
from flask_cors import CORS
from flask import request, jsonify
import json

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
        return render_template("index.html")

# When homepage button is pressed this will just return some text to our terminal
@app.get('/button_pressed')
def button_pressed():
        print('Button Pressed on Frontend!')
        return 'status: ok'

# When text is sent from out homepage this will grab the text sent from our frontend and print out a decoded version of it to our terminal
@app.route('/send_text', methods=['POST'])
def send_text():
        byte_string = request.get_data()
        decoded_string = byte_string.decode()
        print(f"User Entered: {decoded_string}")
        return 'status: ok'

# storing registered users here
users = []
current_user = []

# this is where our user can create and account and have it added to the serverside for login
@app.route('/register', methods=['POST'])
def register():
    user = request.get_json()

    if user in users:
        return {"status": "exists"}, 401

    users.append(user)
    print(users)
    return {"status": "ok"}, 200  

# this is where our real users login information is handled
@app.route('/real_login', methods=['POST'])
def real_login():
    login_real = request.get_json()

    if login_real in users:
            print(login_real)               # this is where we can do things with our user, after they succesfully log in
            global current_user
            current_user = login_real

            return jsonify({"status": "ok"}), 200
    else:
            return jsonify({"status": "error", "message": "Invalid username or password"}), 401
    
@app.route('/current_user', methods=['POST'])
def current_user_check():

    if current_user:
        print("sending current user")
        return jsonify(current_user), 200
    
    else:
        return jsonify({"status": "error", "message": "user does not exist"})

# This is currently running our backend in debug mode, so that when changes are made they update automatically
if __name__ == '__main__':
        app.run(debug=True)




