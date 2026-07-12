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

# Teammate yahan aur models likhegi:
# class Driver(db.Model): ...
# class Trip(db.Model): ...