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


class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.Integer, primary_key=True)

    registration_number = db.Column(db.String(50), unique=True, nullable=False)

    vehicle_name = db.Column(db.String(100), nullable=False)

    vehicle_type = db.Column(db.String(50), nullable=False)

    max_load_capacity = db.Column(db.Float, nullable=False)

    odometer = db.Column(db.Float, default=0)

    acquisition_cost = db.Column(db.Float, nullable=False)

    status = db.Column(db.String(20), default="Available")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

class Driver(db.Model):
    __tablename__ = "drivers"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    license_number = db.Column(db.String(50), unique=True, nullable=False)

    license_category = db.Column(db.String(50), nullable=False)

    license_expiry = db.Column(db.Date, nullable=False)

    contact_number = db.Column(db.String(15), nullable=False)

    safety_score = db.Column(db.Float, default=100.0)

    status = db.Column(db.String(20), default="Available")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id"),
        nullable=False
    )

    driver_id = db.Column(
        db.Integer,
        db.ForeignKey("drivers.id"),
        nullable=False
    )

    source = db.Column(db.String(100), nullable=False)

    destination = db.Column(db.String(100), nullable=False)

    cargo_weight = db.Column(db.Float, nullable=False)

    planned_distance = db.Column(db.Float, nullable=False)

    revenue = db.Column(db.Float, default=0)

    final_odometer = db.Column(db.Float, default=0)

    fuel_consumed = db.Column(db.Float, default=0)

    trip_status = db.Column(db.String(20), default="Draft")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )