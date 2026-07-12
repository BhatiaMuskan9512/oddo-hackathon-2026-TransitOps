from datetime import date, timedelta
from werkzeug.security import generate_password_hash

from app import app
from database import db
from models import User, Vehicle, Driver, Trip, MaintenanceLog, FuelLog, Expense

with app.app_context():

    # ---------------- USERS ----------------
    users = [
        User(name="Rahul Sharma", email="fleet@transitops.com", password=generate_password_hash("test123"), role="Fleet Manager"),
        User(name="Amit Verma", email="driver@transitops.com", password=generate_password_hash("test123"), role="Driver"),
        User(name="Sneha Patil", email="safety@transitops.com", password=generate_password_hash("test123"), role="Safety Officer"),
        User(name="Arjun Joshi", email="finance@transitops.com", password=generate_password_hash("test123"), role="Financial Analyst"),
    ]
    db.session.add_all(users)
    db.session.commit()

    # ---------------- VEHICLES ----------------
    vehicles = [
        Vehicle(registration_number="GJ-01-AB-1234", vehicle_name="Van-05", vehicle_type="Van",
                max_load_capacity=500, odometer=12000, acquisition_cost=800000, status="Available"),
        Vehicle(registration_number="GJ-01-CD-5678", vehicle_name="Truck-12", vehicle_type="Truck",
                max_load_capacity=2000, odometer=45000, acquisition_cost=1500000, status="Available"),
        Vehicle(registration_number="GJ-05-EF-9012", vehicle_name="Van-08", vehicle_type="Van",
                max_load_capacity=600, odometer=8000, acquisition_cost=850000, status="In_Shop"),
    ]
    db.session.add_all(vehicles)
    db.session.commit()

    # ---------------- DRIVERS ----------------
    # naam "Amit Verma" wahi rakha hai jo Driver-role user ka naam hai, taaki /trips/my kaam kare
    drivers = [
        Driver(name="Amit Verma", license_number="DL-001", license_category="LMV",
               license_expiry=date.today() + timedelta(days=200), contact_number="9876543210",
               safety_score=92, status="Available"),
        Driver(name="Vikas Rana", license_number="DL-002", license_category="HMV",
               license_expiry=date.today() + timedelta(days=15), contact_number="9876543211",
               safety_score=78, status="Available"),
        Driver(name="Suresh Yadav", license_number="DL-003", license_category="LMV",
               license_expiry=date.today() - timedelta(days=5), contact_number="9876543212",
               safety_score=60, status="Suspended"),
    ]
    db.session.add_all(drivers)
    db.session.commit()

    # ---------------- TRIPS ----------------
    trips = [
        Trip(vehicle_id=vehicles[1].id, driver_id=drivers[1].id, source="Ahmedabad", destination="Surat",
             cargo_weight=1200, planned_distance=280, revenue=15000, trip_status="Dispatched"),
        Trip(vehicle_id=vehicles[0].id, driver_id=drivers[0].id, source="Ahmedabad", destination="Vadodara",
             cargo_weight=350, planned_distance=110, revenue=6000,
             final_odometer=12110, fuel_consumed=9, trip_status="Completed"),
        Trip(vehicle_id=vehicles[1].id, driver_id=drivers[2].id, source="Ahmedabad", destination="Rajkot",
             cargo_weight=900, planned_distance=220, revenue=9000, trip_status="Draft"),
    ]
    db.session.add_all(trips)
    db.session.commit()

    # ---------------- MAINTENANCE ----------------
    maintenance = [
        MaintenanceLog(vehicle_id=vehicles[2].id, description="Engine oil change",
                        cost=3500, date=date.today() - timedelta(days=2), status="In Progress"),
        MaintenanceLog(vehicle_id=vehicles[0].id, description="Tyre replacement",
                        cost=8000, date=date.today() - timedelta(days=20), status="Completed"),
    ]
    db.session.add_all(maintenance)
    db.session.commit()

    # ---------------- FUEL LOGS ----------------
    fuel_logs = [
        FuelLog(vehicle_id=vehicles[0].id, liters=30, cost=3000, date=date.today() - timedelta(days=3)),
        FuelLog(vehicle_id=vehicles[1].id, liters=80, cost=8200, date=date.today() - timedelta(days=1)),
        FuelLog(vehicle_id=vehicles[1].id, liters=60, cost=6100, date=date.today() - timedelta(days=6)),
    ]
    db.session.add_all(fuel_logs)
    db.session.commit()

    # ---------------- EXPENSES ----------------
    # expenses = [
    #     Expense(vehicle_id=vehicles[1].id, expense_type="Toll", amount=450, date=date.today() - timedelta(days=1)),
    #     Expense(vehicle_id=vehicles[0].id, expense_type="Other", amount=1200, date=date.today() - timedelta(days=4)),
    # ]
    db.session.add_all(expenses)
    db.session.commit()

    print("✅ Dummy data added successfully!")
    print("\nLogin credentials (password for all: test123):")
    print("Fleet Manager     -> fleet@transitops.com")
    print("Driver            -> driver@transitops.com")
    print("Safety Officer    -> safety@transitops.com")
    print("Financial Analyst -> finance@transitops.com")