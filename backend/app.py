from flask import Flask
from flask_cors import CORS
from config import Config
from ml.matcher import matcher
from routes.health  import health_bp
from routes.analyze import analyze_bp
from routes.jobs    import jobs_bp
from routes.upload  import upload_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, origins=config_class.CORS_ORIGINS)
    matcher.init(config_class)
    for bp in (health_bp, analyze_bp, jobs_bp, upload_bp):
        app.register_blueprint(bp)
    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=5000)
