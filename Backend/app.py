from datetime import date

from flask import Flask, jsonify, request
from flask_cors import CORS

import db

app = Flask(__name__)
CORS(app)
db.init()


def valid_date(s):
    try:
        date.fromisoformat(s)
        return True
    except ValueError:
        return False


@app.get("/api/day/<day>")
def get_day(day):
    if not valid_date(day):
        return jsonify(error="invalid date"), 400
    return jsonify(db.get_day(day))


@app.put("/api/day/<day>")
def put_day(day):
    data = request.get_json(silent=True)
    if not valid_date(day) or not isinstance(data, dict):
        return jsonify(error="invalid request"), 400
    db.save_day(day, data)
    return jsonify(ok=True)


@app.get("/api/habits")
def habits():
    return jsonify(db.list_habits())


@app.post("/api/habits")
def create_habit():
    name = ((request.get_json(silent=True) or {}).get("name") or "").strip()
    if not name:
        return jsonify(error="name required"), 400
    return jsonify(db.add_habit(name)), 201


@app.delete("/api/habits/<int:habit_id>")
def remove_habit(habit_id):
    db.delete_habit(habit_id)
    return "", 204


if __name__ == "__main__":
    app.run(port=5001, debug=True)