from flask import Flask, jsonify
from flask_cors import CORS
from database import db
from models import Brand
from routes.brands import brands_bp

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///brandgpt.db"
db.init_app(app)

# Register the brands blueprint so its routes become active
app.register_blueprint(brands_bp)

with app.app_context():
    db.create_all()

@app.route("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "BrandGPT backend is running"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)