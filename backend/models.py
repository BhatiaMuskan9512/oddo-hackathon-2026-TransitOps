from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    vehicle_name = db.Column(db.String(100), nullable=False)
    vehicle_type = db.Column(db.String(50))
    max_load_capacity = db.Column(db.Float, nullable=False)
    odometer = db.Column(db.Float, default=0)
    acquisition_cost = db.Column(db.Float)
    status = db.Column(db.String(20), default="Available")

    def to_dict(self):
        return {
            "id": self.id,
            "registration_number": self.registration_number,
            "vehicle_name": self.vehicle_name,
            "vehicle_type": self.vehicle_type,
            "max_load_capacity": self.max_load_capacity,
            "odometer": self.odometer,
            "acquisition_cost": self.acquisition_cost,
            "status": self.status
        }
class Driver(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    license_category = db.Column(db.String(20))
    license_expiry_date = db.Column(db.Date, nullable=False)
    contact_number = db.Column(db.String(15))
    safety_score = db.Column(db.Float, default=100)
    status = db.Column(db.String(20), default="Available")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "license_number": self.license_number,
            "license_category": self.license_category,
            "license_expiry_date": self.license_expiry_date.isoformat() if self.license_expiry_date else None,
            "contact_number": self.contact_number,
            "safety_score": self.safety_score,
            "status": self.status
        }
        
class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('driver.id'), nullable=False)
    cargo_weight = db.Column(db.Float, nullable=False)
    planned_distance = db.Column(db.Float)
    final_odometer = db.Column(db.Float)
    fuel_consumed = db.Column(db.Float)
    status = db.Column(db.String(20), default="Draft")  # Draft, Dispatched, Completed, Cancelled

    vehicle = db.relationship('Vehicle', backref='trips')
    driver = db.relationship('Driver', backref='trips')

    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source,
            "destination": self.destination,
            "vehicle_id": self.vehicle_id,
            "driver_id": self.driver_id,
            "vehicle_registration": self.vehicle.registration_number if self.vehicle else None,
            "driver_name": self.driver.name if self.driver else None,
            "cargo_weight": self.cargo_weight,
            "planned_distance": self.planned_distance,
            "final_odometer": self.final_odometer,
            "fuel_consumed": self.fuel_consumed,
            "status": self.status
        }
# Teammate yahan aur models likhegi:
# class Driver(db.Model): ...
# class Trip(db.Model): ...