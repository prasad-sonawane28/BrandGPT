from flask import Flask, jsonify
from flask_cors import CORS
from database import db
from models import Brand

# Create the Flask application
app = Flask(__name__)

# Enable CORS so our React app (running on a different port) can call this API
CORS(app)

# Tell Flask where the SQLite database file should live
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///brandgpt.db"

# Connect our db object (from database.py) to this Flask app
db.init_app(app)

# Create all tables defined in models.py, if they don't already exist
with app.app_context():
    db.create_all()

# A simple health-check endpoint.
@app.route("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "BrandGPT backend is running"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)