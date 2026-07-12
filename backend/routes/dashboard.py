from flask import Blueprint, jsonify
from database import db
from models import Vehicle, Driver, Trip

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/', methods=['GET'])
def get_dashboard():
    total_vehicles = Vehicle.query.count()
    active_vehicles = Vehicle.query.filter(Vehicle.status != "Retired").count()
    available_vehicles = Vehicle.query.filter_by(status="Available").count()
    in_maintenance = Vehicle.query.filter_by(status="In Shop").count()
    on_trip_vehicles = Vehicle.query.filter_by(status="On Trip").count()

    active_trips = Trip.query.filter_by(trip_status="Dispatched").count()
    pending_trips = Trip.query.filter_by(trip_status="Draft").count()

    drivers_on_duty = Driver.query.filter_by(status="On Trip").count()

    fleet_utilization = round((on_trip_vehicles / active_vehicles) * 100, 2) if active_vehicles > 0 else 0

    return jsonify({
        "active_vehicles": active_vehicles,
        "available_vehicles": available_vehicles,
        "vehicles_in_maintenance": in_maintenance,
        "active_trips": active_trips,
        "pending_trips": pending_trips,
        "drivers_on_duty": drivers_on_duty,
        "fleet_utilization_percent": fleet_utilization
    }), 200