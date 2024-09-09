from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

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

        # Send email
        msg = Message('New Contact Form Submission',
                      sender=app.config['MAIL_USERNAME'],
                      recipients=[app.config['MAIL_USERNAME']])
        msg.body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
        mail.send(msg)

        # Send phone notification (using IFTTT as an example)
        ifttt_webhook_url = f"https://maker.ifttt.com/trigger/contact_form_submitted/with/key/{os.getenv('IFTTT_KEY')}"
        requests.post(ifttt_webhook_url, json={"value1": name, "value2": email})

        flash('Your message has been sent!', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)