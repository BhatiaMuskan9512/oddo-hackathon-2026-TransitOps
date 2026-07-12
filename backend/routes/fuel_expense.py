from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db
from models import FuelLog, Expense, Vehicle, MaintenanceLog

fuel_expense_bp = Blueprint('fuel_expense', __name__)

# Fuel log create
@fuel_expense_bp.route('/fuel', methods=['POST'])
def create_fuel_log():
    data = request.get_json()

    log_date = None
    if data.get('date'):
        log_date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()

    log = FuelLog(
        vehicle_id=data.get('vehicle_id'),
        liters=data.get('liters'),
        cost=data.get('cost'),
        date=log_date
    )
    db.session.add(log)
    db.session.commit()
    return jsonify(log.to_dict()), 201

@fuel_expense_bp.route('/fuel', methods=['GET'])
def get_fuel_logs():
    logs = FuelLog.query.all()
    return jsonify([l.to_dict() for l in logs]), 200

# Expense create
@fuel_expense_bp.route('/expense', methods=['POST'])
def create_expense():
    data = request.get_json()

    exp_date = None
    if data.get('date'):
        exp_date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()

    expense = Expense(
        vehicle_id=data.get('vehicle_id'),
        type=data.get('type'),
        amount=data.get('amount'),
        date=exp_date
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify(expense.to_dict()), 201

@fuel_expense_bp.route('/expense', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses]), 200

# Total operational cost per vehicle