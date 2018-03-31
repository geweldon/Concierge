# Concierge
Home automation solution

# Requirements:
Python 3.6 or higher
Mongodb 3.4 or higher
Nodejs
NPM
Yarn

# Installation Instructions
1. Clone or copy repo into desired install directory
2. From the Concierge root directory run "pip install -r requirements.txt"
3. Run "python manage.py makemigrations Concierge"
followed by "python manage.py migrate" to instantiate the Mongodb database
(mongodb must be running for this to work)
4. From the Front-end directory run "yarn install"
5. To access the web app run "python manage.py runserver" and then navigate to
the indicated ip and port in your web-browser
