from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from sqlite3 import IntegrityError
from .models import create_user, verify_user

bp = Blueprint("main", __name__)

@bp.get("/")
def index():
    user_name = session.get("user_name")
    return render_template("index.html", user_name=user_name)

@bp.get("/register")
def register_form():
    return render_template("register.html")

@bp.post("/register")
def register_submit():
    email = request.form.get("email", "").strip().lower()
    name = request.form.get("name", "").strip()
    password = request.form.get("password", "")

    if not email or not name or not password:
        flash("Fill in all fields.")
        return redirect(url_for("main.register_form"))

    try:
        create_user(email=email, password=password, name=name)
    except IntegrityError:
        flash("That email is already registered.")
        return redirect(url_for("main.register_form"))

    flash("Account created. You can now log in.")
    return redirect(url_for("main.login_form"))

@bp.get("/login")
def login_form():
    return render_template("login.html")

@bp.post("/login")
def login_submit():
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")

    user = verify_user(email=email, password=password)
    if user is None:
        flash("Invalid email or password.")
        return redirect(url_for("main.login_form"))

    session["user_id"] = user["id"]
    session["user_name"] = user["name"]
    flash("Logged in.")
    return redirect(url_for("main.index"))

@bp.get("/logout")
def logout():
    session.clear()
    flash("Logged out.")
    return redirect(url_for("main.index"))