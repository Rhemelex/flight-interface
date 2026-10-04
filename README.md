# Flight Interface

A small full-stack flight dashboard project with a React frontend and a Flask backend.

The app displays a flight instrument-style interface for altitude, heading (HIS), and ADI values, and stores the latest readings in a SQLite database.

## Project Structure

```text
flight-interface/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── flight_data.db
├── frontend/
│   └── FlightInterface-main/
│       ├── package.json
│       ├── public/
│       └── src/
└── README.md
```

## Tech Stack

- Frontend: React + Create React App
- Backend: Python + Flask
- Database: SQLite

## Features

- Text and visual display modes
- Altitude, HIS, and ADI controls
- Form to send flight data to the backend
- SQLite persistence for saved readings
- Latest reading retrieval via Flask API
- History endpoint for database readback

## Backend API

The Flask service listens on `http://127.0.0.1:3500`.

### Endpoints

- `GET /health` — health check
- `GET /controlpanel` — fetch the latest saved reading
- `POST /controlpanel` — save a new reading
- `GET /history` — fetch recent saved readings

### Accepted values

- altitude: 0 to 3000
- his: 0 to 360
- adi: -100 to 100

## Database

The SQLite database is stored at:

```text
backend/flight_data.db
```

The table used is:

```sql
control_readings
```

with columns:

- id
- altitude
- his
- adi
- created_at

## Setup Instructions

### 1. Backend setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

This starts the Flask API on port `3500`.

### 2. Frontend setup

In a second terminal:

```powershell
cd frontend\FlightInterface-main
npm install
npm start
```

The React app runs at:

```text
http://127.0.0.1:3000
```

> The frontend is configured to proxy requests to the Flask backend on port `3500`.

## Viewing database contents

You can inspect the SQLite database with PowerShell:

```powershell
cd backend
..\.venv\Scripts\python.exe -c "import sqlite3; c=sqlite3.connect('flight_data.db'); print(*c.execute('SELECT id, altitude, his, adi, created_at FROM control_readings ORDER BY id DESC').fetchall(), sep='\n')"
```

## Notes

- The project was set up as a lightweight local flight-control dashboard.
- It is meant for local development and demonstration.
- The frontend and backend are intentionally separated so it is easy to expand later.

## License

This project is for local development and learning purposes.

