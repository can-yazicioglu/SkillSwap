from werkzeug.security import generate_password_hash, check_password_hash
from .db import get_db

def create_user(email: str, password: str, name: str) -> None:
    db = get_db()
    db.execute(
        "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
        (email, generate_password_hash(password), name),
    )
    db.commit()

def get_user_by_email(email: str):
    db = get_db()
    return db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

def verify_user(email: str, password: str):
    user = get_user_by_email(email)
    if user is None:
        return None
    if not check_password_hash(user["password_hash"], password):
        return None
    return user