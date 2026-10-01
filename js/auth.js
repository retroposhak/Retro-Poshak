/* =========================================================
   RETRO POSHAK — Frontend Auth Prototype
   Stores users + session in localStorage.
   Replace USER_DB helpers with real API calls later.
   ========================================================= */

(function () {
  const USERS_KEY = 'retroPoshakUsers';
  const SESSION_KEY = 'retroPoshakSession';
  const ORDERS_KEY = 'retroPoshakOrders';

  function read(key, fallback) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------- Simple hash (NOT for production — demo only) ---------- */
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
    return 'rp' + (h >>> 0).toString(36);
  }

  /* ---------- User store ---------- */
  function getUsers() { return read(USERS_KEY, []); }
  function saveUsers(users) { write(USERS_KEY, users); }

  function findUser(email) {
    return getUsers().find(u => u.email.toLowerCase() === String(email).toLowerCase());
  }

  /* ---------- Sign up ---------- */
  function signup({ name, email, password }) {
    if (!name || !email || !password) return { ok: false, msg: 'All fields are required.' };
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, msg: 'Enter a valid email.' };
    if (password.length < 6) return { ok: false, msg: 'Password must be at least 6 characters.' };
    if (findUser(email)) return { ok: false, msg: 'An account with this email already exists.' };

    const user = {
      id: 'u_' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim(),
      passwordHash: hash(password),
      createdAt: new Date().toISOString()
    };
    const users = getUsers();
    users.push(user);
    saveUsers(users);
    setSession(user.id);
    return { ok: true, msg: 'Welcome to Retro Poshak.', user: publicUser(user) };
  }

  /* ---------- Login ---------- */
  function login({ email, password }) {
    if (!email || !password) return { ok: false, msg: 'Enter email and password.' };
    const user = findUser(email);
    if (!user) return { ok: false, msg: 'No account found with that email.' };
    if (user.passwordHash !== hash(password)) return { ok: false, msg: 'Incorrect password.' };
    setSession(user.id);
    return { ok: true, msg: 'Welcome back.', user: publicUser(user) };
  }

  /* ---------- Logout ---------- */
  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    document.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: null } }));
  }

  /* ---------- Session ---------- */
  function setSession(userId) {
    write(SESSION_KEY, { userId, at: Date.now() });
    document.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: currentUser() } }));
  }
  function currentUser() {
    const s = read(SESSION_KEY, null);
    if (!s) return null;
    const u = getUsers().find(u => u.id === s.userId);
    return u ? publicUser(u) : null;
  }
  function publicUser(u) {
    return { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt };
  }

  /* ---------- Orders (for account page) ---------- */
  function saveOrder(order) {
    const list = read(ORDERS_KEY, []);
    list.unshift(order);
    write(ORDERS_KEY, list);
  }
  function getOrders() {
    const u = currentUser();
    if (!u) return [];
    return read(ORDERS_KEY, []).filter(o => o.userId === u.id);
  }

  /* ---------- Update profile ---------- */
  function updateProfile({ name }) {
    const u = currentUser();
    if (!u) return { ok: false, msg: 'Not signed in.' };
    const users = getUsers();
    const idx = users.findIndex(x => x.id === u.id);
    if (idx < 0) return { ok: false, msg: 'User missing.' };
    users[idx].name = name.trim() || users[idx].name;
    saveUsers(users);
    document.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: currentUser() } }));
    return { ok: true, msg: 'Profile updated.' };
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: currentUser() } }));
  });

  window.RetroAuth = {
    signup, login, logout,
    currentUser, getOrders, saveOrder, updateProfile
  };
})();