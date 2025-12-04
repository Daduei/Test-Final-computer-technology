import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { usersAPI } from '../services/api';
import './userlist.css';

const roleBadgeClass = {
  admin: 'user-role user-role-admin',
  editor: 'user-role user-role-editor',
  viewer: 'user-role user-role-viewer',
};

const UserRow = ({ u }) => {
  const avatar = u.avatarURL || u.avatarUrl || u.avatar || '';
  const [imgOk, setImgOk] = useState(false);
  const initial = u.name ? u.name.trim()[0].toUpperCase() : '?';

  return (
    <div className="user-row">
      <div className="user-left">
        <div className="avatar-wrap">
          {avatar && (
            <img
              src={avatar}
              alt="avatar"
              className="avatar-img"
              onLoad={() => setImgOk(true)}
              onError={(e) => { setImgOk(false); e.currentTarget.style.display = 'none'; }}
            />
          )}
          {!imgOk && <div className="avatar-pill">{initial}</div>}
        </div>

        <div className="user-meta">
          <div className="user-name">{u.name || '—'}</div>
        </div>
      </div>

      <div className="user-columns">
        <div className="user-email">{u.email || '—'}</div>
        <div className="user-dob">{u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : '—'}</div>
        <div className={roleBadgeClass[u.role] || 'user-role'}>{u.role}</div>
      </div>
    </div>
  );
};

export default function UserList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('[UserList] Calling usersAPI.getAll()...');
        const res = await usersAPI.getAll();
        console.log('[UserList] Response:', res);
        
        if (!res || !res.success) {
          throw new Error(res?.message || 'Failed to load users');
        }
        
        const fetched = Array.isArray(res.users) ? res.users : [];
        console.log('[UserList] Fetched users:', fetched);

        const getLocalAvatar = (email) => {
          try {
            if (!email) return '';
            const key = `avatar:${email}`;
            const keyLower = `avatar:${(email || '').toLowerCase()}`;
            return window.localStorage.getItem(key) || window.localStorage.getItem(keyLower) || '';
          } catch (e) {
            return '';
          }
        };

        // Attach any local avatars (from localStorage) to fetched users
        fetched.forEach((u) => {
          if (!u.avatarURL && u.email) {
            const local = getLocalAvatar(u.email);
            if (local) u.avatarURL = local;
          }
        });

        // Ensure current user is in the list if admin
        if (currentUser && currentUser.email) {
          const existsIndex = fetched.findIndex((u) => (u.email || '').toLowerCase() === currentUser.email.toLowerCase());
          const localAvatar = currentUser.avatarURL || getLocalAvatar(currentUser.email);
          
          if (existsIndex === -1) {
            fetched.unshift({
              id: currentUser.id || 'me',
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role || 'admin',
              avatarURL: localAvatar || undefined,
            });
          } else if (!fetched[existsIndex].avatarURL && localAvatar) {
            fetched[existsIndex].avatarURL = localAvatar;
          }
        }

        setUsers(fetched);
        setError(null);
      } catch (e) {
        console.error('[UserList] Error loading users:', e);
        
        // Show meaningful error message
        setError(e.message || 'Failed to load users from server. Showing local account only.');
        
        // Fallback: show only current user
        const fallback = [];
        try {
          if (currentUser && currentUser.email) {
            const avatarLocal = window.localStorage.getItem(`avatar:${currentUser.email}`) || currentUser.avatarURL || undefined;
            fallback.push({ 
              id: currentUser.id || 'me', 
              name: currentUser.name, 
              email: currentUser.email, 
              role: currentUser.role || 'admin', 
              avatarURL: avatarLocal 
            });
          }
        } catch (ignore) {
          if (currentUser && currentUser.email) {
            fallback.push({ 
              id: currentUser.id || 'me', 
              name: currentUser.name, 
              email: currentUser.email, 
              role: currentUser.role || 'admin' 
            });
          }
        }
        setUsers(fallback);
      }
      setLoading(false);
    };

    load();
  }, [currentUser]);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="userlist-card wiki-card">
        <div className="userlist-empty">You are not authorized to view this page.</div>
      </div>
    );
  }

  const admins = users.filter((u) => u.role === 'admin');
  const editors = users.filter((u) => u.role === 'editor');
  const viewers = users.filter((u) => u.role === 'viewer');

  // Apply search filter
  const matches = (u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) || 
           (u.email || '').toLowerCase().includes(q) || 
           (u.role || '').toLowerCase().includes(q);
  };

  const adminsFiltered = admins.filter(matches);
  const editorsFiltered = editors.filter(matches);
  const viewersFiltered = viewers.filter(matches);

  return (
    <div className="userlist-card wiki-card">
      <div className="userlist-header">
        <h3>User List</h3>
        {error && <div className="userlist-error">{error}</div>}
      </div>

      <div className="userlist-search-wrapper">
        <Search className="userlist-search-icon" size={16} />
        <input
          className="userlist-search-input"
          type="search"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="userlist-section">
        <h4>Admins</h4>
        <div className="user-columns-header">
          <div className="col-spacer">User name</div>
          <div className="col-email">Email</div>
          <div className="col-dob">Date of Birth</div>
          <div className="col-role">Role</div>
        </div>
        {loading ? (
          <div className="userlist-loading">Loading…</div>
        ) : adminsFiltered.length === 0 ? (
          <div className="userlist-empty">No admins found</div>
        ) : (
          adminsFiltered.map((u) => <UserRow key={u.id || u.email} u={u} />)
        )}
      </div>

      <div className="userlist-section">
        <h4>Editors</h4>
        <div className="user-columns-header">
          <div className="col-spacer">User name</div>
          <div className="col-email">Email</div>
          <div className="col-dob">Date of Birth</div>
          <div className="col-role">Role</div>
        </div>
        {loading ? (
          <div className="userlist-loading">Loading…</div>
        ) : editorsFiltered.length === 0 ? (
          <div className="userlist-empty">No editors found</div>
        ) : (
          editorsFiltered.map((u) => <UserRow key={u.id || u.email} u={u} />)
        )}
      </div>

      <div className="userlist-section">
        <h4>Viewers</h4>
        <div className="user-columns-header">
          <div className="col-spacer">User name</div>
          <div className="col-email">Email</div>
          <div className="col-dob">Date of Birth</div>
          <div className="col-role">Role</div>
        </div>
        {loading ? (
          <div className="userlist-loading">Loading…</div>
        ) : viewersFiltered.length === 0 ? (
          <div className="userlist-empty">No viewers found</div>
        ) : (
          viewersFiltered.map((u) => <UserRow key={u.id || u.email} u={u} />)
        )}
      </div>
    </div>
  );
}