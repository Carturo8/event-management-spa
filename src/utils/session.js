// Retrieve the current session from localStorage
export function getCurrentSession() {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
}

// Save the user session to localStorage
export function setSession(user) {
    localStorage.setItem('session', JSON.stringify(user));
}

// Clear the session from localStorage
export function clearSession() {
    localStorage.removeItem('session');
}
