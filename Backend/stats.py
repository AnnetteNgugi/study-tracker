from datetime import date, timedelta

from flask import Blueprint, jsonify, request

import db

bp = Blueprint("stats", __name__)
GOALS = {"study": 60, "coding": 60, "exercise": 30}  # minutes/day


def completion(d, habit_ids):
    parts = [min(d["tracks"].get(k, 0) / g, 1) for k, g in GOALS.items()]
    parts += [1 if d["habits"].get(str(h)) else 0 for h in habit_ids]
    todos = [t for t in d["todos"] if t["text"].strip()]
    if todos:
        parts.append(sum(t["done"] for t in todos) / len(todos))
    parts.append(min(d["water"] / 8, 1))
    return round(100 * sum(parts) / len(parts))


def streak(active, end):
    # Today not done yet? Start counting from yesterday so the streak survives.
    day = end if end in active else end - timedelta(days=1)
    n = 0
    while day in active:
        n += 1
        day -= timedelta(days=1)
    return n


@bp.get("/api/stats")
def stats():
    try:
        end = date.fromisoformat(request.args.get("date") or date.today().isoformat())
    except ValueError:
        return jsonify(error="invalid date"), 400

    habits = db.list_habits()
    ids = [h["id"] for h in habits]
    stored = db.all_days()
    full = lambda dt: {**db.blank_day(), **stored.get(dt.isoformat(), {})}
    days = {date.fromisoformat(k): full(date.fromisoformat(k)) for k in stored}

    active = {"overall": {k for k, v in days.items() if completion(v, ids) >= 50}}
    for g in GOALS:
        active[g] = {k for k, v in days.items() if v["tracks"].get(g, 0) > 0}
    streaks = {k: streak(v, end) for k, v in active.items()}

    week_dates = [end - timedelta(days=i) for i in range(6, -1, -1)]
    week = []
    for dt in week_dates:
        d = full(dt)
        todos = [t for t in d["todos"] if t["text"].strip()]
        week.append({
            "date": dt.isoformat(),
            "completion": completion(d, ids),
            "study": d["tracks"].get("study", 0),
            "coding": d["tracks"].get("coding", 0),
            "exercise": d["tracks"].get("exercise", 0),
            "water": d["water"],
            "todos_done": sum(t["done"] for t in todos),
            "todos_total": len(todos),
        })

    streaks["habits"] = []
    for h in habits:
        done = {k for k, v in days.items() if v["habits"].get(str(h["id"]))}
        streaks["habits"].append({
            "id": h["id"], "name": h["name"],
            "streak": streak(done, end),
            "week": sum(1 for dt in week_dates if dt in done),
        })

    return jsonify(
        date=end.isoformat(),
        completion=completion(full(end), ids),
        goals=GOALS,
        streaks=streaks,
        week=week,
        week_avg=round(sum(w["completion"] for w in week) / 7),
    )