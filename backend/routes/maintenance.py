from flask import Blueprint, request, jsonify
from database import db
from models import MaintenanceLog, Vehicle

maintenance_bp = Blueprint('maintenance', __name__)

@maintenance_bp.route('/', methods=['GET'])
def get_maintenance_logs():
    logs = MaintenanceLog.query.all()
    return jsonify([m.to_dict() for m in logs]), 200

@maintenance_bp.route('/', methods=['POST'])
def create_maintenance():
    data = request.get_json()
    vehicle = Vehicle.query.get(data.get('vehicle_id'))
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404

    log = MaintenanceLog(
        vehicle_id=vehicle.id,
        description=data.get('description'),
        cost=data.get('cost', 0),
        status="In Progress"
    )
    # Business Rule: Maintenance create hote hi vehicle "In Shop"
    vehicle.status = "In Shop"

    db.session.add(log)
    db.session.commit()
    return jsonify(log.to_dict()), 201

@maintenance_bp.route('/<int:id>/close', methods=['PUT'])
def close_maintenance(id):
    log = MaintenanceLog.query.get_or_404(id)
    log.status = "Completed"

    # Business Rule: Close hone pe vehicle Available (agar Retired nahi hai)
    vehicle = Vehicle.query.get(log.vehicle_id)
    if vehicle.status != "Retired":
        vehicle.status = "Available"

    db.session.commit()
    return jsonify(log.to_dict()), 200