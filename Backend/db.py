import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "tracker.db"


def conn():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    return c


def init():
    with conn() as c:
        c.execute("CREATE TABLE IF NOT EXISTS days (date TEXT PRIMARY KEY, data TEXT NOT NULL)")
        c.execute("CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)")
        if c.execute("SELECT COUNT(*) FROM habits").fetchone()[0] == 0:
            c.executemany("INSERT INTO habits(name) VALUES(?)",
                          [("Read 10 pages",), ("Meditate",), ("Sleep 8h",)])


def blank_day():
    return {
        "priorities": ["", "", ""],
        "todos": [{"text": "", "done": False} for _ in range(11)],
        "timetable": {},
        "water": 0,
        "meals": {"breakfast": "", "lunch": "", "snacks": "", "dinner": ""},
        "notes": "",
        "gratitude": "",
        "mood": "",
        "tracks": {"study": 0, "coding": 0, "exercise": 0},
        "habits": {},
    }


def get_day(day):
    with conn() as c:
        row = c.execute("SELECT data FROM days WHERE date=?", (day,)).fetchone()
    data = blank_day()
    if row:
        data.update(json.loads(row["data"]))
    return data


def save_day(day, data):
    with conn() as c:
        c.execute(
            "INSERT INTO days(date, data) VALUES(?, ?) "
            "ON CONFLICT(date) DO UPDATE SET data=excluded.data",
            (day, json.dumps(data)),
        )


def all_days():
    with conn() as c:
        rows = c.execute("SELECT date, data FROM days").fetchall()
    return {r["date"]: json.loads(r["data"]) for r in rows}


def list_habits():
    with conn() as c:
        return [dict(r) for r in c.execute("SELECT id, name FROM habits ORDER BY id")]


def add_habit(name):
    with conn() as c:
        cur = c.execute("INSERT INTO habits(name) VALUES(?)", (name,))
        return {"id": cur.lastrowid, "name": name}


def delete_habit(habit_id):
    with conn() as c:
        c.execute("DELETE FROM habits WHERE id=?", (habit_id,))