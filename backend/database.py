from flask_sqlalchemy import SQLAlchemy

# This object is what lets us define tables and query the database.
# It doesn't connect to anything yet - it gets "attached" to our Flask app in app.py
db = SQLAlchemy()
