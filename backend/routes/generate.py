import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, current_app
from anthropic import Anthropic
from database import db
from models import Brand, Generation

load_dotenv()  # reads backend/.env into environment variables (if it exists)

generate_bp = Blueprint("generate", __name__)

MODEL = "claude-haiku-5-5"  # cheap while testing; switch to claude-sonnet-5-5 later


def use_mock():
    """Mock mode is on when MOCK_AI=1, or automatically when no API key is set."""
    return os.getenv("MOCK_AI") == "1" or not os.getenv("ANTHROPIC_API_KEY")


def get_client():
    # Created per request so a missing key becomes a handled error, not a crash
    return Anthropic()


def build_system_prompt(brand):
    """Turn a Brand row into standing instructions for the model."""
    lines = [
        f"You are the in-house marketing writer for {brand.name}.",
        "Write content that sounds exactly like this brand.",
        "",
    ]

    # Only include fields the user actually filled in
    details = [
        ("Industry", brand.industry),
        ("About the brand", brand.description),
        ("Target audience", brand.target_audience),
        ("Brand voice", brand.brand_voice),
        ("Products/services", brand.products),
    ]
    for label, value in details:
        if value and value.strip():
            lines.append(f"{label}: {value.strip()}")

    lines.append("")
    lines.append("Return only the finished content, with no preamble.")
    return "\n".join(lines)


def mock_response(brand, task):
    """Placeholder output that also shows the prompt a real call would send."""
    return (
        "[MOCK RESPONSE - no API key set]\n\n"
        f"Task: {task}\n\n"
        f"Real content for {brand.name} would appear here.\n\n"
        "--- System prompt that would be sent ---\n"
        f"{build_system_prompt(brand)}"
    )


@generate_bp.route("/api/brands/<int:brand_id>/generate", methods=["POST"])
def generate_content(brand_id):
    brand = db.session.get(Brand, brand_id)
    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    data = request.get_json(silent=True)
    task = ((data or {}).get("task") or "").strip()
    if not task:
        return jsonify({"error": "A task is required"}), 400

    mock = use_mock()

    try:
        if mock:
            text = mock_response(brand, task)
        else:
            response = get_client().messages.create(
                model=MODEL,
                max_tokens=800,
                system=build_system_prompt(brand),
                messages=[{"role": "user", "content": task}],
            )
            text = "".join(
                block.text for block in response.content if block.type == "text"
            )
    except Exception:
        current_app.logger.exception("AI request failed")
        return jsonify({"error": "AI request failed. Check the Flask terminal."}), 502

    # Save the result so it shows up in the brand's history
    generation = Generation(brand_id=brand.id, task=task, content=text)  # type: ignore
    db.session.add(generation)
    db.session.commit()

    result = generation.to_dict()
    result["mock"] = mock
    return jsonify(result), 201


@generate_bp.route("/api/brands/<int:brand_id>/generations", methods=["GET"])
def list_generations(brand_id):
    brand = db.session.get(Brand, brand_id)
    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    generations = (
        Generation.query.filter_by(brand_id=brand_id)
        .order_by(Generation.created_at.desc())
        .all()
    )
    return jsonify([g.to_dict() for g in generations])