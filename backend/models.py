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

    # One brand has many generations. Deleting a brand deletes its history too.
    generations = db.relationship(
        "Generation",
        backref="brand",
        cascade="all, delete-orphan",
        order_by="Generation.created_at.desc()",
    )

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


class Generation(db.Model):
    __tablename__ = "generations"

    id = db.Column(db.Integer, primary_key=True)
    brand_id = db.Column(db.Integer, db.ForeignKey("brands.id"), nullable=False)
    task = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "brand_id": self.brand_id,
            "task": self.task,
            "content": self.content,
            # The trailing "Z" marks the time as UTC so the browser converts it to local time
            "created_at": self.created_at.isoformat() + "Z" if self.created_at else None,
        }