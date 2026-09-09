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