from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False  # Explicitly set SSL to False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')  # Set default sender

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


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']

        try:
            # Send email
            msg = Message('New Contact Form Submission',
                          recipients=[app.config['MAIL_USERNAME']])
            msg.body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
            mail.send(msg)

            flash('Thanks for reaching out! Your message has been sent!', 'success')
            app.logger.info(f"Message sent successfully from {email}")
        except Exception as e:
            flash('An error occurred while sending your message. Please try again later.', 'error')
            app.logger.error(f"Error sending message: {str(e)}")

        return redirect(url_for('contact'))

    return render_template('contact.html')


if __name__ == '__main__':
    app.run(debug=True)