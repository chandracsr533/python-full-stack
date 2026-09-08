from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017")
db = client["mitsDB"]
students = db["students"]


@app.route("/students", methods=["POST"])
def add_student():
    data = request.get_json(silent=True) or {}

    if not data.get("name") or not data.get("email") or data.get("age") is None:
        return jsonify({"message": "invalid student data"}), 400

    student = {
        "name": data["name"],
        "email": data["email"],
        "age": data["age"],
    }

    result = students.insert_one(student)
    student["_id"] = str(result.inserted_id)

    return jsonify({
        "message": "student created successfully",
        "student": student,
    }), 201


@app.route("/students", methods=["GET"])
def get_students():
    student_list = []

    for student in students.find():
        student_list.append({
            "_id": str(student["_id"]),
            "name": student["name"],
            "email": student["email"],
            "age": student["age"],
        })

    return jsonify(student_list)


@app.route("/students/<id>", methods=["GET"])
def get_student(id):
    try:
        student = students.find_one({"_id": ObjectId(id)})
    except Exception:
        return jsonify({"message": "invalid student id"}), 400

    if student:
        return jsonify({
            "_id": str(student["_id"]),
            "name": student["name"],
            "email": student["email"],
            "age": student["age"],
        })

    return jsonify({"message": "student not available"}), 404


@app.route("/students/<id>", methods=["PUT"])
def update_student(id):
    data = request.get_json(silent=True) or {}
    update_data = {}

    for field in ["name", "email", "age"]:
        if field in data:
            update_data[field] = data[field]

    if not update_data:
        return jsonify({"message": "no valid fields to update"}), 400

    try:
        result = students.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    except Exception:
        return jsonify({"message": "invalid student id"}), 400

    if result.matched_count == 0:
        return jsonify({"message": "student not available"}), 404

    return jsonify({"message": "student updated successfully"})


@app.route("/students/<id>", methods=["DELETE"])
def delete_student(id):
    try:
        result = students.delete_one({"_id": ObjectId(id)})
    except Exception:
        return jsonify({"message": "invalid student id"}), 400

    if result.deleted_count == 0:
        return jsonify({"message": "student not available"}), 404

    return jsonify({"message": "student deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)
