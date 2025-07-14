import { renderHomeView } from '../views/home.js';
import { renderDashboardView } from '../views/dashboard.js';
import { renderNotFoundView } from '../views/not-found.js';
import { renderLoginView } from '../auth/login.js';
import { renderRegisterView } from '../auth/register.js';
import { getCurrentSession } from '../utils/session.js';
import { renderEventForm } from '../events/eventForm.js';

// Map of routes and whether they require authentication
const routes = {
    '/': { view: renderHomeView, private: false },
    '/login': { view: renderLoginView, private: false },
    '/register': { view: renderRegisterView, private: false },
    '/dashboard': { view: renderDashboardView, private: true },
    '/dashboard/events/create': {
        view: () => renderEventForm(document.getElementById('app')),
        private: true
    },
    '/dashboard/events/edit': {
        view: () => renderEventForm(document.getElementById('app')),
        private: true
    }
};

// Main function to handle route changes
export function handleRoute() {
    const path = window.location.pathname;
    const route = routes[path];

    const session = getCurrentSession();

    // Redirect logged-in users away from login, register, and home pages
    if (session) {
        if (path === '/login' || path === '/register' || path === '/') {
            navigateTo('/dashboard');
            return;
        }
    }

    // If the path doesn't match any defined route
    if (!route) {
        renderNotFoundView();
        return;
    }

    // Prevent access to private routes if the user is not authenticated
    if (route.private && !session) {
        renderNotFoundView();
        return;
    }

    // Render the appropriate view
    route.view();
}

// Initialize router on a page load and listen to back/forward navigation
export function initRouter() {
    window.addEventListener('popstate', handleRoute);
    handleRoute();
}

// Navigate to a new path and trigger the route handler
export function navigateTo(path) {
    window.history.pushState({}, '', path);
    handleRoute();
}
