from flask import Flask, jsonify
from flask_cors import CORS

# Create the Flask application
app = Flask(__name__)

# Enable CORS so our React app (running on a different port) can call this API
CORS(app)

# A simple health-check endpoint.
# When someone visits /api/health, this function runs and returns JSON.
@app.route("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "BrandGPT backend is running"
    })

# This block only runs when we execute this file directly (python app.py)
if __name__ == "__main__":
    app.run(debug=True, port=5000)