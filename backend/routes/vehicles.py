from flask import Blueprint, request, jsonify
from models import db, Vehicle

vehicles_bp = Blueprint('vehicles', __name__)

# Sab vehicles dekho (filters ke saath)
@vehicles_bp.route('/', methods=['GET'])
def get_vehicles():
    status = request.args.get('status')
    vehicle_type = request.args.get('type')
    
    query = Vehicle.query
    if status:
        query = query.filter_by(status=status)
    if vehicle_type:
        query = query.filter_by(vehicle_type=vehicle_type)
    
    vehicles = query.all()
    return jsonify([v.to_dict() for v in vehicles]), 200

# Ek specific vehicle dekho
@vehicles_bp.route('/<int:id>', methods=['GET'])
def get_vehicle(id):
    vehicle = Vehicle.query.get_or_404(id)
    return jsonify(vehicle.to_dict()), 200

# Naya vehicle banao
@vehicles_bp.route('/', methods=['POST'])
def create_vehicle():
    data = request.get_json()
    
    if Vehicle.query.filter_by(registration_number=data.get('registration_number')).first():
        return jsonify({"error": "Registration number must be unique"}), 400
    
    vehicle = Vehicle(
        registration_number=data.get('registration_number'),
        vehicle_name=data.get('vehicle_name'),
        vehicle_type=data.get('vehicle_type'),
        max_load_capacity=data.get('max_load_capacity'),
        odometer=data.get('odometer', 0),
        acquisition_cost=data.get('acquisition_cost'),
        status=data.get('status', 'Available')
    )
    db.session.add(vehicle)
    db.session.commit()
    return jsonify(vehicle.to_dict()), 201

# Vehicle update karo
@vehicles_bp.route('/<int:id>', methods=['PUT'])
def update_vehicle(id):
    vehicle = Vehicle.query.get_or_404(id)
    data = request.get_json()
    
    vehicle.vehicle_name = data.get('vehicle_name', vehicle.vehicle_name)
    vehicle.vehicle_type = data.get('vehicle_type', vehicle.vehicle_type)
    vehicle.max_load_capacity = data.get('max_load_capacity', vehicle.max_load_capacity)
    vehicle.odometer = data.get('odometer', vehicle.odometer)
    vehicle.acquisition_cost = data.get('acquisition_cost', vehicle.acquisition_cost)
    vehicle.status = data.get('status', vehicle.status)
    
    db.session.commit()
    return jsonify(vehicle.to_dict()), 200

# Vehicle delete karo
@vehicles_bp.route('/<int:id>', methods=['DELETE'])
def delete_vehicle(id):
    vehicle = Vehicle.query.get_or_404(id)
    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({"message": "Vehicle deleted"}), 200