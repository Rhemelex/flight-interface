import math
import os
import sqlite3
from contextlib import closing
from pathlib import Path

from flask import Flask, jsonify, request


DEFAULT_DATABASE = Path(__file__).with_name("flight_data.db")
LIMITS = {
	"altitude": (0, 3000),
	"his": (0, 360),
	"adi": (-100, 100),
}


def create_app(database_path=None):
	app = Flask(__name__)
	app.config["DATABASE"] = str(database_path or os.environ.get("FLIGHT_DB_PATH", DEFAULT_DATABASE))

	def connect_database():
		connection = sqlite3.connect(app.config["DATABASE"])
		connection.row_factory = sqlite3.Row
		return connection

	with closing(connect_database()) as connection, connection:
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS control_readings (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				altitude REAL NOT NULL,
				his REAL NOT NULL,
				adi REAL NOT NULL,
				created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
			)
			"""
		)

	@app.get("/health")
	def health():
		return jsonify({"status": "ok"})

	@app.get("/controlpanel")
	def get_controlpanel():
		with closing(connect_database()) as connection, connection:
			reading = connection.execute(
				"SELECT id, altitude, his, adi, created_at FROM control_readings ORDER BY id DESC LIMIT 1"
			).fetchone()

		if reading is None:
			return jsonify({"altitude": 0, "his": 0, "adi": 0, "updated_at": None})

		result = dict(reading)
		result["updated_at"] = result.pop("created_at")
		return jsonify(result)

	@app.post("/controlpanel")
	def post_controlpanel():
		payload = request.get_json(silent=True)
		if not isinstance(payload, dict):
			return jsonify({"error": "Request body must be a JSON object."}), 400

		reading = {}
		for field, (minimum, maximum) in LIMITS.items():
			value = payload.get(field)
			if isinstance(value, bool):
				return jsonify({"error": f"{field} must be a number between {minimum} and {maximum}."}), 400
			try:
				number = float(value)
			except (TypeError, ValueError):
				return jsonify({"error": f"{field} must be a number between {minimum} and {maximum}."}), 400
			if not math.isfinite(number) or not minimum <= number <= maximum:
				return jsonify({"error": f"{field} must be a number between {minimum} and {maximum}."}), 400
			reading[field] = number

		with closing(connect_database()) as connection, connection:
			cursor = connection.execute(
				"INSERT INTO control_readings (altitude, his, adi) VALUES (?, ?, ?)",
				(reading["altitude"], reading["his"], reading["adi"]),
			)
			saved = connection.execute(
				"SELECT id, altitude, his, adi, created_at FROM control_readings WHERE id = ?",
				(cursor.lastrowid,),
			).fetchone()

		result = dict(saved)
		result["updated_at"] = result.pop("created_at")
		return jsonify(result), 201

	@app.get("/history")
	def get_history():
		with closing(connect_database()) as connection, connection:
			readings = connection.execute(
				"SELECT id, altitude, his, adi, created_at FROM control_readings ORDER BY id DESC LIMIT 100"
			).fetchall()
		return jsonify([
			{**dict(reading), "updated_at": reading["created_at"]}
			for reading in readings
		])

	return app


app = create_app()


if __name__ == "__main__":
	app.run(host="127.0.0.1", port=3500, debug=True)
