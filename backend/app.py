from flask import Flask, jsonify, request
from flask_cors import CORS

from database import db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transitops.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this'

db.init_app(app)

# Models import
from models import *



# @app.route('/api/test', methods=['GET'])
# def test():
#     return jsonify({"message": "Backend is working!"})

@app.route('/api/test')
def test():
    return jsonify({"message": "Backend is working!"})

with app.app_context():
    db.create_all()
    print("Database and tables created successfully!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)