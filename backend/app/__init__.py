from flask import Flask
from . import db

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.secret_key = "dev"

    db.init_app(app)

    from .routes import bp
    app.register_blueprint(bp)

    return app