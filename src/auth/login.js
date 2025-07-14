import { getUserByEmail } from '../services/api.js';
import { setSession } from '../utils/session.js';
import { navigateTo } from '../router/router.js';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Render the login view and handle login logic
export function renderLoginView() {
    const app = document.getElementById('app');

    // Inject the login form into the app container
    app.innerHTML = `
        <div class="auth-container">
            <form id="loginForm" class="auth-form">
                <h2>Login</h2>
                
                <label>Email</label>
                <input type="email" name="email" required>

                <label>Password</label>
                <input type="password" name="password" required>

                <button type="submit">Log In</button>
                <button id="backHomeBtn">Back to Home</button>
            </form>
        </div>
    `;

    // Handle the "Back to Home" button
    document.getElementById('backHomeBtn').addEventListener('click', () => {
        navigateTo('/');
    });

    const form = document.getElementById('loginForm');

    // Handle login form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        // Attempt to fetch a user by email
        const users = await getUserByEmail(email);

        // Validate credentials
        if (users.length === 0 || users[0].password !== password) {
            // Show error alert using SweetAlert2
            Swal.fire({
                title: 'Login Failed',
                text: 'Invalid email or password.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Save session in localStorage
        setSession(users[0]);

        // Redirect to dashboard
        navigateTo('/dashboard');
    });
}
