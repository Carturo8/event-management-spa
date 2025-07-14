import { registerUser, getUserByEmail } from '../services/api.js';
import { navigateTo } from '../router/router.js';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Render the registration view and handle form submission
export function renderRegisterView() {
    const app = document.getElementById('app');

    // Inject the registration form into the app container
    app.innerHTML = `
        <div class="auth-container">
            <h1>Register</h1>
            <form id="registerForm" class="auth-form">
                <label>Full Name</label>
                <input type="text" name="name" required>

                <label>Email</label>
                <input type="email" name="email" required>

                <label>Password</label>
                <input type="password" name="password" required>
                
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" required>

                <label>Role:</label>
                <select name="role" required>
                    <option value="Visitor">Visitor</option>
                </select>

                <button type="submit">Register</button>
            </form>
            <button id="backHomeBtn" class="secondary-button">Back to Home</button>
        </div>
    `;

    // Handle "Back to Home" navigation
    document.getElementById('backHomeBtn').addEventListener('click', () => {
        navigateTo('/');
    });

    const form = document.getElementById('registerForm');

    // Handle registration form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form values into a user object
        const formData = new FormData(form);
        const user = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirm_password: formData.get('confirm_password'),
            role: formData.get('role')
        };

        // Check if passwords match
        if (user.password !== user.confirm_password) {
            // Show error with SweetAlert2
            Swal.fire({
                title: 'Registration Failed',
                text: 'Passwords do not match.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Check if a user with the same email already exists
        const existing = await getUserByEmail(user.email);
        if (existing.length > 0) {
            // Show warning with SweetAlert2
            Swal.fire({
                title: 'Registration Failed',
                text: 'A user with that email already exists.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Register the new user
        const newUser = await registerUser(user);

        // Save user session to localStorage
        localStorage.setItem('session', JSON.stringify(newUser));

        // Redirect to dashboard
        navigateTo('/dashboard');
    });
}
