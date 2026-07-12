from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transitops.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registration_no = db.Column(db.String(50), unique=True, nullable=False)
    vehicle_name = db.Column(db.String(100), nullable=False)
    vehicle_type = db.Column(db.String(50))
    status = db.Column(db.String(20), default="Available")


@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Backend is working!"})


with app.app_context():
    db.create_all()
    print("Database and tables created successfully!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)