import React, { useEffect, useState } from 'react';
import { usersAPI } from '../services/api';
import './userlist.css';

const roleBadgeClass = {
  admin: 'user-role user-role-admin',
  editor: 'user-role user-role-editor',
  viewer: 'user-role user-role-viewer',
};

const UserRow = ({ u }) => {
  const avatar = u.avatarURL || u.avatarUrl || u.avatar || '';
  return (
    <div className="user-row">
      <div className="user-left">
        {avatar ? (
          <img src={avatar} alt="avatar" className="avatar-img" />
        ) : (
          <div className="avatar-pill">{u.name ? u.name[0] : '?'}</div>
        )}

        <div className="user-meta">
          <div className="user-name">{u.name || '—'}</div>
        </div>
      </div>

      <div className="user-columns">
        <div className="user-email">{u.email || '—'}</div>
        <div className={roleBadgeClass[u.role] || 'user-role'}>{u.role}</div>
      </div>
    </div>
  );
};

export default function UserList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await usersAPI.getAll();
        const fetched = (res && Array.isArray(res.users)) ? res.users : [];

        const getLocalAvatar = (email) => {
          try {
            if (!email) return '';
            return window.localStorage.getItem(`avatar:${email}`) || '';
          } catch (e) {
            return '';
          }
        };

        // If backend returned some users, make sure to attach local avatar
        // values when available and ensure currentUser is included.
        if (Array.isArray(fetched) && fetched.length > 0) {
          for (let i = 0; i < fetched.length; i++) {
            const email = fetched[i].email;
            if (!fetched[i].avatarURL && email) {
              const a = getLocalAvatar(email);
              if (a) fetched[i].avatarURL = a;
            }
          }
        }

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
      } catch (e) {
        // On error: do not show sample users. Instead show empty list but add
        // currentUser if present so the admin sees their own account.
        setError('Failed to load users from server. Showing local account only.');
        const fallback = [];
        try {
          if (currentUser && currentUser.email) {
            const avatarLocal = window.localStorage.getItem(`avatar:${currentUser.email}`) || currentUser.avatarURL || undefined;
            fallback.push({ id: currentUser.id || 'me', name: currentUser.name, email: currentUser.email, role: currentUser.role || 'admin', avatarURL: avatarLocal });
          }
        } catch (ignore) {
          if (currentUser && currentUser.email) {
            fallback.push({ id: currentUser.id || 'me', name: currentUser.name, email: currentUser.email, role: currentUser.role || 'admin' });
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

  return (
    <div className="userlist-card wiki-card">
      <div className="userlist-header">
        <h3>User List</h3>
        {error && <div className="userlist-error">{error}</div>}
      </div>

      <div className="userlist-section">
        <h4>Admins</h4>
        {loading ? (
          <div className="userlist-loading">Loading…</div>
        ) : admins.length === 0 ? (
          <div className="userlist-empty">No admins found</div>
        ) : (
          admins.map((u) => <UserRow key={u.id || u.email} u={u} />)
        )}
      </div>

      <div className="userlist-section">
        <h4>Editors</h4>
        {loading ? (
          <div className="userlist-loading">Loading…</div>
        ) : editors.length === 0 ? (
          <div className="userlist-empty">No editors found</div>
        ) : (
          editors.map((u) => <UserRow key={u.id || u.email} u={u} />)
        )}
      </div>

      <div className="userlist-section">
        <h4>Viewers</h4>
        {loading ? (
          <div className="userlist-loading">Loading…</div>
        ) : viewers.length === 0 ? (
          <div className="userlist-empty">No viewers found</div>
        ) : (
          viewers.map((u) => <UserRow key={u.id || u.email} u={u} />)
        )}
      </div>
    </div>
  );
}
