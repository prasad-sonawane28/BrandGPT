from datetime import datetime
from database import db


class Brand(db.Model):
    __tablename__ = "brands"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    industry = db.Column(db.String(100))
    description = db.Column(db.Text)
    target_audience = db.Column(db.String(200))
    brand_voice = db.Column(db.String(200))
    products = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert a Brand row into a plain dict that jsonify can send."""
        return {
            "id": self.id,
            "name": self.name,
            "industry": self.industry,
            "description": self.description,
            "target_audience": self.target_audience,
            "brand_voice": self.brand_voice,
            "products": self.products,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }