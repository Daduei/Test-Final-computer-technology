from app.routes.auth import auth_bp
from app.routes.documents import documents_bp
from app.routes.users import users_bp

__all__ = ['auth_bp', 'documents_bp', 'users_bp']