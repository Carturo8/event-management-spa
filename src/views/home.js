import { navigateTo } from '../router/router.js';

// Render the home view with navigation buttons
export function renderHomeView() {
    const app = document.getElementById('app');

    // Set a home-specific body class
    document.body.className = 'home';

    // Inject basic home screen content
    app.innerHTML = `
        <h1>Welcome to the Event Management SPA</h1>
        <button id="goToLogin">Log In</button>
        <button id="goToRegister">Register</button>
    `;

    // Navigate to the login view when the "Log In" button is clicked
    document.getElementById('goToLogin').addEventListener('click', () => {
        navigateTo('/login');
    });

    // Navigate to the register view when the "Register" button is clicked
    document.getElementById('goToRegister').addEventListener('click', () => {
        navigateTo('/register');
    });
}
