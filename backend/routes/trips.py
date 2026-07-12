from flask import Blueprint, request, jsonify
from datetime import date
from models import db, Trip, Vehicle, Driver

trips_bp = Blueprint('trips', __name__)

# Sab trips dekho
@trips_bp.route('/', methods=['GET'])
def get_trips():
    status = request.args.get('status')
    query = Trip.query
    if status:
        query = query.filter_by(status=status)
    trips = query.all()
    return jsonify([t.to_dict() for t in trips]), 200


# Ek specific trip dekho
@trips_bp.route('/<int:id>', methods=['GET'])
def get_trip(id):
    trip = Trip.query.get_or_404(id)
    return jsonify(trip.to_dict()), 200


# Naya trip banao (status = Draft)
@trips_bp.route('/', methods=['POST'])
def create_trip():
    data = request.get_json()

    vehicle = Vehicle.query.get(data.get('vehicle_id'))
    driver = Driver.query.get(data.get('driver_id'))
    cargo_weight = data.get('cargo_weight')

    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    if not driver:
        return jsonify({"error": "Driver not found"}), 404

    # Business Rule: Retired/In Shop vehicles dispatch me nahi aa sakte
    if vehicle.status not in ["Available"]:
        return jsonify({"error": f"Vehicle is {vehicle.status}, cannot be selected"}), 400

    # Business Rule: Suspended/expired license drivers assign nahi ho sakte
    if driver.status != "Available":
        return jsonify({"error": f"Driver is {driver.status}, cannot be selected"}), 400
    if driver.license_expiry_date < date.today():
        return jsonify({"error": "Driver's license has expired"}), 400

    # Business Rule: Cargo weight <= vehicle max load capacity
    if cargo_weight > vehicle.max_load_capacity:
        return jsonify({"error": "Cargo weight exceeds vehicle's max load capacity"}), 400

    trip = Trip(
        source=data.get('source'),
        destination=data.get('destination'),
        vehicle_id=vehicle.id,
        driver_id=driver.id,
        cargo_weight=cargo_weight,
        planned_distance=data.get('planned_distance'),
        status="Draft"
    )
    db.session.add(trip)
    db.session.commit()
    return jsonify(trip.to_dict()), 201


# Trip DISPATCH karo
@trips_bp.route('/<int:id>/dispatch', methods=['PUT'])
def dispatch_trip(id):
    trip = Trip.query.get_or_404(id)

    if trip.status != "Draft":
        return jsonify({"error": f"Trip is {trip.status}, cannot dispatch"}), 400

    vehicle = trip.vehicle
    driver = trip.driver

    if vehicle.status != "Available":
        return jsonify({"error": f"Vehicle is {vehicle.status}, cannot dispatch"}), 400
    if driver.status != "Available":
        return jsonify({"error": f"Driver is {driver.status}, cannot dispatch"}), 400

    # Automatic status transitions
    vehicle.status = "On Trip"
    driver.status = "On Trip"
    trip.status = "Dispatched"

    db.session.commit()
    return jsonify(trip.to_dict()), 200


# Trip COMPLETE karo
@trips_bp.route('/<int:id>/complete', methods=['PUT'])
def complete_trip(id):
    trip = Trip.query.get_or_404(id)
    data = request.get_json()

    if trip.status != "Dispatched":
        return jsonify({"error": f"Trip is {trip.status}, cannot complete"}), 400

    trip.final_odometer = data.get('final_odometer')
    trip.fuel_consumed = data.get('fuel_consumed')
    trip.status = "Completed"

    # Vehicle ka odometer update karo aur Available karo
    vehicle = trip.vehicle
    if trip.final_odometer:
        vehicle.odometer = trip.final_odometer
    vehicle.status = "Available"

    # Driver Available karo
    driver = trip.driver
    driver.status = "Available"

    db.session.commit()
    return jsonify(trip.to_dict()), 200


# Trip CANCEL karo
@trips_bp.route('/<int:id>/cancel', methods=['PUT'])
def cancel_trip(id):
    trip = Trip.query.get_or_404(id)

    if trip.status not in ["Draft", "Dispatched"]:
        return jsonify({"error": f"Trip is {trip.status}, cannot cancel"}), 400

    # Agar dispatched thi, to vehicle/driver ko Available wapas karo
    if trip.status == "Dispatched":
        trip.vehicle.status = "Available"
        trip.driver.status = "Available"

    trip.status = "Cancelled"
    db.session.commit()
    return jsonify(trip.to_dict()), 200