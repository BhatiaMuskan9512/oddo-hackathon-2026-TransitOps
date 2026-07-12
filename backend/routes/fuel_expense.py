from flask import Blueprint, request, jsonify
from models import db, FuelLog, Expense, Vehicle, MaintenanceLog

fuel_expense_bp = Blueprint('fuel_expense', __name__)

# Fuel log create
@fuel_expense_bp.route('/fuel', methods=['POST'])
def create_fuel_log():
    data = request.get_json()
    log = FuelLog(
        vehicle_id=data.get('vehicle_id'),
        liters=data.get('liters'),
        cost=data.get('cost'),
        date=data.get('date')
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
    expense = Expense(
        vehicle_id=data.get('vehicle_id'),
        type=data.get('type'),
        amount=data.get('amount'),
        date=data.get('date')
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify(expense.to_dict()), 201

@fuel_expense_bp.route('/expense', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses]), 200

# Total operational cost per vehicle (Fuel + Maintenance)
@fuel_expense_bp.route('/vehicle/<int:id>/cost', methods=['GET'])
def get_vehicle_cost(id):
    vehicle = Vehicle.query.get_or_404(id)
    total_fuel = sum(f.cost for f in vehicle.fuel_logs)
    total_maintenance = sum(m.cost for m in vehicle.maintenance_logs)
    total_expense = sum(e.amount for e in vehicle.expenses)

    return jsonify({
        "vehicle_id": id,
        "total_fuel_cost": total_fuel,
        "total_maintenance_cost": total_maintenance,
        "total_other_expenses": total_expense,
        "total_operational_cost": total_fuel + total_maintenance + total_expense
    }), 200