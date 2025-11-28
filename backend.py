from flask import Flask, render_template
from flask_cors import CORS
from flask import request
import json

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
        return "This is the homepage"

@app.get('/button_pressed')
def button_pressed():
        print('Button Pressed on Frontend!')
        return 'status: ok'

@app.route('/send_text', methods=['POST'])
def send_text():
        byte_string = request.get_data()
        decoded_string = byte_string.decode()
        print(f"User Entered: {decoded_string}")
        return 'status: ok'

@app.route('/user_login', methods=['POST'])
def user_login():
        login = request.get_json()
        print(login)
        return 'status: ok'
        


if __name__ == '__main__':
        app.run(debug=True)




