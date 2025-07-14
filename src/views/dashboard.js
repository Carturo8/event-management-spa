import { getCurrentSession, clearSession } from '../utils/session.js';
import { navigateTo } from '../router/router.js';
import { renderEventList } from '../events/eventList.js';
import { renderEnrollmentList } from '../enrollments/enrollmentList.js';
import { renderMyEnrollments } from '../enrollments/myEnrollments.js';
import { renderAdminEnrollmentList } from '../enrollments/enrollmentAdmin.js';
import Swal from 'sweetalert2'; // Import SweetAlert2 for confirmation dialogs

// Render the dashboard view depending on the user role (admin or visitor)
export function renderDashboardView() {
    const app = document.getElementById('app');
    const session = getCurrentSession();

    // If the user is not authenticated, redirect to log in
    if (!session) {
        navigateTo('/login');
        return;
    }

    const { name, role } = session;

    // Base layout for the dashboard
    app.innerHTML = `
    <div class="dashboard-header">
        <h1>Welcome, ${name}</h1>
        <p>You are logged in as <strong>${role}</strong>.</p>
        <button id="logoutBtn" class="logout-btn">Log Out</button>
    </div>
    <div id="dashboardContent" class="dashboard-content"></div>
    `;

    // Handle logout with SweetAlert2 confirmation
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Swal.fire({
            title: 'Log Out?',
            text: 'Do you want to end your session?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                clearSession();
                navigateTo('/');
            }
        });
    });

    const content = document.getElementById('dashboardContent');

    // Render content based on a role
    if (role === 'Admin') {
        content.innerHTML = `
            <section id="eventListSection"></section>
            <section id="adminEnrollmentsSection"></section>
        `;

        const eventListSection = document.getElementById('eventListSection');
        const adminEnrollmentsSection = document.getElementById('adminEnrollmentsSection');

        renderEventList(eventListSection);
        renderAdminEnrollmentList(adminEnrollmentsSection);
    } else {
        content.innerHTML = `
            <section id="enrollmentSection"></section>
            <section id="myEnrollmentsSection"></section>
        `;

        const enrollmentSection = document.getElementById('enrollmentSection');
        const myEnrollmentsSection = document.getElementById('myEnrollmentsSection');

        renderEnrollmentList(enrollmentSection);
        renderMyEnrollments(myEnrollmentsSection);
    }
}
