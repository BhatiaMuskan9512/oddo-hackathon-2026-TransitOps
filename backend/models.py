from database import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(100), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(50), nullable=False)

    status = db.Column(db.String(20), default="Active")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Teammate yahan models likhegi:
# class Vehicle(db.Model): ...
# class Driver(db.Model): ...
# class Trip(db.Model): ...
