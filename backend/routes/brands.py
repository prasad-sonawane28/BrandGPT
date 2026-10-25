from flask import Blueprint, request, jsonify
from database import db
from models import Brand

# A Blueprint lets us group related routes together in their own file,
# then "register" them with the main app later.
brands_bp = Blueprint("brands", __name__)


@brands_bp.route("/api/brands", methods=["POST"])
def create_brand():
    # silent=True returns None on a bad/missing JSON body instead of crashing
    data = request.get_json(silent=True)

    # Basic validation - name is required and can't be only spaces
    if not data or not (data.get("name") or "").strip():
        return jsonify({"error": "Brand name is required"}), 400

    new_brand = Brand(
        name=data.get("name").strip(),
        industry=data.get("industry"),
        description=data.get("description"),
        target_audience=data.get("target_audience"),
        brand_voice=data.get("brand_voice"),
        products=data.get("products"),
    )

    db.session.add(new_brand)
    db.session.commit()

    return jsonify(new_brand.to_dict()), 201


@brands_bp.route("/api/brands", methods=["GET"])
def list_brands():
    brands = Brand.query.order_by(Brand.created_at.desc()).all()
    return jsonify([b.to_dict() for b in brands])


@brands_bp.route("/api/brands/<int:brand_id>", methods=["GET"])
def get_brand(brand_id):
    brand = db.session.get(Brand, brand_id)

    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    return jsonify(brand.to_dict())


@brands_bp.route("/api/brands/<int:brand_id>", methods=["PUT"])
def update_brand(brand_id):
    brand = db.session.get(Brand, brand_id)
    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    data = request.get_json(silent=True)
    if not data or not (data.get("name") or "").strip():
        return jsonify({"error": "Brand name is required"}), 400

    # PUT replaces the whole record with what the client sent
    brand.name = data.get("name").strip()
    brand.industry = data.get("industry")
    brand.description = data.get("description")
    brand.target_audience = data.get("target_audience")
    brand.brand_voice = data.get("brand_voice")
    brand.products = data.get("products")

    db.session.commit()
    return jsonify(brand.to_dict())


@brands_bp.route("/api/brands/<int:brand_id>", methods=["DELETE"])
def delete_brand(brand_id):
    brand = db.session.get(Brand, brand_id)
    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    db.session.delete(brand)
    db.session.commit()
    return jsonify({"message": "Brand deleted"})