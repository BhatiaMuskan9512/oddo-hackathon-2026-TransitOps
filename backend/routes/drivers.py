from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Driver

drivers_bp = Blueprint('drivers', __name__)

@drivers_bp.route('/', methods=['GET'])
def get_drivers():
    status = request.args.get('status')
    query = Driver.query
    if status:
        query = query.filter_by(status=status)
    drivers = query.all()
    return jsonify([d.to_dict() for d in drivers]), 200

@drivers_bp.route('/<int:id>', methods=['GET'])
def get_driver(id):
    driver = Driver.query.get_or_404(id)
    return jsonify(driver.to_dict()), 200

@drivers_bp.route('/', methods=['POST'])
def create_driver():
    data = request.get_json()
    if Driver.query.filter_by(license_number=data.get('license_number')).first():
        return jsonify({"error": "License number must be unique"}), 400
    try:
        expiry_date = datetime.strptime(data.get('license_expiry_date'), '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return jsonify({"error": "license_expiry_date must be in YYYY-MM-DD format"}), 400
    driver = Driver(
        name=data.get('name'),
        license_number=data.get('license_number'),
        license_category=data.get('license_category'),
        license_expiry_date=expiry_date,
        contact_number=data.get('contact_number'),
        safety_score=data.get('safety_score', 100),
        status=data.get('status', 'Available')
    )
    db.session.add(driver)
    db.session.commit()
    return jsonify(driver.to_dict()), 201

@drivers_bp.route('/<int:id>', methods=['PUT'])
def update_driver(id):
    driver = Driver.query.get_or_404(id)
    data = request.get_json()
    driver.name = data.get('name', driver.name)
    driver.license_category = data.get('license_category', driver.license_category)
    driver.contact_number = data.get('contact_number', driver.contact_number)
    driver.safety_score = data.get('safety_score', driver.safety_score)
    driver.status = data.get('status', driver.status)
    if data.get('license_expiry_date'):
        driver.license_expiry_date = datetime.strptime(data.get('license_expiry_date'), '%Y-%m-%d').date()
    db.session.commit()
    return jsonify(driver.to_dict()), 200

@drivers_bp.route('/<int:id>', methods=['DELETE'])
def delete_driver(id):
    driver = Driver.query.get_or_404(id)
    db.session.delete(driver)
    db.session.commit()
    return jsonify({"message": "Driver deleted"}), 200