from flask import Flask, render_template
from flask_cors import CORS
from flask import request
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

# When a user enters a fake login on our homepage this will grab the username and password as json data and print them out to our terminal
# with a properly assigned key value pair
@app.route('/user_login', methods=['POST'])
def user_login():
        login = request.get_json()
        print(login)
        return {"status": "ok"}


# this is where our user can create and account and have it added to the serverside for login
@app.route('/register', methods=['POST'])
def register():
        register = request.get_json()
        users.append(register)
        if register not in users:
                return {"status": "404"}
        else:
                print(users)
                return {"status": "ok"}
        
users = []


# this is where our real users login information is handled
@app.route('/real_login', methods=['POST'])
def real_login():
        login_real = request.get_json()
        if login_real in users:
                print(login_real)               # this is where we can do things with our user, after they succesfully log in
                return {"status": "ok"}
        else:
                return {"status": "404"}

# This is currently running our backend in debug mode, so that when changes are made they update automatically
if __name__ == '__main__':
        app.run(debug=True)




