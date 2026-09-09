from flask import Blueprint, request, jsonify
from database import db
from models import Brand

# A Blueprint lets us group related routes together in their own file,
# then "register" them with the main app later.
brands_bp = Blueprint("brands", __name__)

@brands_bp.route("/api/brands", methods=["POST"])
def create_brand():
    data = request.get_json()

    # Basic validation - name is required
    if not data.get("name"):
        return jsonify({"error": "Brand name is required"}), 400

    new_brand = Brand(
        name=data.get("name"),
        industry=data.get("industry"),
        description=data.get("description"),
        target_audience=data.get("target_audience"),
        brand_voice=data.get("brand_voice"),
        products=data.get("products")
    )

    db.session.add(new_brand)
    db.session.commit()

    return jsonify({
        "id": new_brand.id,
        "name": new_brand.name,
        "industry": new_brand.industry,
        "description": new_brand.description,
        "target_audience": new_brand.target_audience,
        "brand_voice": new_brand.brand_voice,
        "products": new_brand.products
    }), 201


@brands_bp.route("/api/brands/<int:brand_id>", methods=["GET"])
def get_brand(brand_id):
    brand = Brand.query.get(brand_id)

    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    return jsonify({
        "id": brand.id,
        "name": brand.name,
        "industry": brand.industry,
        "description": brand.description,
        "target_audience": brand.target_audience,
        "brand_voice": brand.brand_voice,
        "products": brand.products
    })