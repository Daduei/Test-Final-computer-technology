from flask import Blueprint, request, jsonify
from app.models.user import User
from app.middleware.auth import token_required, roles_required
from app import db

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
@token_required
def get_users(current_user):
    """
    Get all users - Admins see everyone, others see only themselves
    """
    try:
        if current_user.role == 'admin':
            # Admins can see all users
            users = User.query.order_by(User.created_at.desc()).all()
        else:
            # Non-admins only see themselves
            users = [current_user]
        
        users_list = [{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'createdAt': user.created_at.isoformat() if user.created_at else None
        } for user in users]
        
        return jsonify({
            'success': True,
            'count': len(users_list),
            'users': users_list
        })
    
    except Exception as e:
        print(f"Get users error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Failed to load users from server'}), 500


@users_bp.route('/<int:user_id>', methods=['GET'])
@token_required
def get_user(user_id, current_user):
    """
    Get a specific user by ID
    """
    try:
        # Users can view themselves, admins can view anyone
        if current_user.id != user_id and current_user.role != 'admin':
            return jsonify({'success': False, 'message': 'Not authorized to view this user'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'createdAt': user.created_at.isoformat() if user.created_at else None
            }
        })
    
    except Exception as e:
        print(f"Get user error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Server error'}), 500


@users_bp.route('/<int:user_id>', methods=['PUT'])
@roles_required('admin')
def update_user(user_id, current_user):
    """
    Update user details (admin only)
    """
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        data = request.get_json() or {}
        
        # Update name
        if 'name' in data and data['name'].strip():
            user.name = data['name'].strip()
        
        # Update role (validate it's a valid role)
        if 'role' in data:
            if data['role'] in ['admin', 'editor', 'viewer']:
                user.role = data['role']
            else:
                return jsonify({'success': False, 'message': 'Invalid role'}), 400
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'createdAt': user.created_at.isoformat() if user.created_at else None
            }
        })
    
    except Exception as e:
        print(f"Update user error: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Server error'}), 500


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@roles_required('admin')
def delete_user(user_id, current_user):
    """
    Delete a user (admin only)
    """
    try:
        # Prevent admins from deleting themselves
        if current_user.id == user_id:
            return jsonify({'success': False, 'message': 'Cannot delete your own account'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Store user info for response
        user_name = user.name
        user_email = user.email
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'User {user_name} ({user_email}) deleted successfully'
        })
    
    except Exception as e:
        print(f"Delete user error: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Server error'}), 500


@users_bp.route('/search', methods=['GET'])
@token_required
def search_users(current_user):
    """
    Search users by name or email (admin only)
    """
    try:
        if current_user.role != 'admin':
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({'success': True, 'users': [], 'count': 0})
        
        # Search by name or email
        users = User.query.filter(
            db.or_(
                User.name.ilike(f'%{query}%'),
                User.email.ilike(f'%{query}%')
            )
        ).order_by(User.created_at.desc()).all()
        
        users_list = [{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'createdAt': user.created_at.isoformat() if user.created_at else None
        } for user in users]
        
        return jsonify({
            'success': True,
            'count': len(users_list),
            'users': users_list
        })
    
    except Exception as e:
        print(f"Search users error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Server error'}), 500