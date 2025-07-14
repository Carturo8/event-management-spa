import {
    getAllEvents,
    deleteEventById,
    deleteEnrollmentsByEventId
} from '../services/api.js';
import { getCurrentSession } from '../utils/session.js';
import { navigateTo } from '../router/router.js';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Render the event list for admins
export async function renderEventList(container) {
    const session = getCurrentSession();

    // Only admins can access this section
    if (!session || session.role !== 'Admin') {
        container.innerHTML = '<p>You do not have permission to view this content.</p>';
        return;
    }

    // Fetch all events from the API
    const events = await getAllEvents();

    // Show a "No events" message if the list is empty
    if (events.length === 0) {
        container.innerHTML = `
            <h2>Event Catalog</h2>
            <button id="createEventBtn">Add New Event</button>
            <p>No events available.</p>
        `;

        // Handle "Add New Event" navigation
        document.getElementById('createEventBtn').addEventListener('click', () => {
            window.history.pushState({}, '', '/dashboard/events/create');
            window.dispatchEvent(new PopStateEvent('popstate'));
        });

        return;
    }

    // Build the table of events
    const tableRows = events
        .map(
            (event) => `
            <tr>
                <td>${event.name}</td>
                <td>${event.description}</td>
                <td>${event.capacity}</td>
                <td>${event.date}</td>
                <td>
                <button data-id="${event.id}" class="editEventBtn">🖉</button>
                <button data-id="${event.id}" class="deleteEventBtn">🗑️</button>
                </td>
            </tr>
        `
        )
        .join('');

    // Render the full event table
    container.innerHTML = `
        <h2>Event Catalog</h2>
        <button id="createEventBtn">Add New Event</button>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Capacity</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    // Handle "Add New Event" navigation
    document.getElementById('createEventBtn').addEventListener('click', () => {
        window.history.pushState({}, '', '/dashboard/events/create');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });

    // Handle Edit buttons
    document.querySelectorAll('.editEventBtn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.dataset.id;
            window.history.pushState({}, '', `/dashboard/events/edit?id=${eventId}`);
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
    });

    // Handle Delete buttons with SweetAlert2 confirmation
    document.querySelectorAll('.deleteEventBtn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const eventId = e.target.dataset.id;

            // Confirm deletion with SweetAlert2
            const result = await Swal.fire({
                title: 'Delete Event?',
                text: 'Are you sure you want to delete this event and all its enrollments?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it',
                cancelButtonText: 'Cancel'
            });

            if (!result.isConfirmed) return;

            try {
                // Delete the event and its enrollments
                await deleteEventById(eventId);
                await deleteEnrollmentsByEventId(eventId);

                // Show success alert
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Event and its enrollments were deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                // Reload the dashboard to refresh the list
                navigateTo('/dashboard');
            } catch (error) {
                // Show an error if something fails
                Swal.fire({
                    title: 'Error',
                    text: 'Something went wrong while deleting the event.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error(error);
            }
        });
    });
}
