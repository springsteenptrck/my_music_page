from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
from flask_mail import Mail, Message
import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


# Configure logging
logging.basicConfig(level=logging.INFO)

mail = Mail(app)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/bio')
def bio():
    return render_template('bio.html')


@app.route('/music')
def music():
    return render_template('music.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run()