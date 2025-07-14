import {
    getEnrollmentsByUser,
    getEventById,
    deleteEnrollmentsByUserAndEvent,
    incrementEventCapacity
} from '../services/api.js';
import { getCurrentSession } from '../utils/session.js';
import { renderEnrollmentList } from './enrollmentList.js';
import Swal from 'sweetalert2';

// Render the list of enrollments for the current visitor
export async function renderMyEnrollments(container) {
    const session = getCurrentSession();
    if (!session || session.role !== 'Visitor') return;

    const enrollments = await getEnrollmentsByUser(session.id);
    container.innerHTML = '';

    if (enrollments.length === 0) {
        container.innerHTML = `
            <h2>My Enrollments</h2>
            <p>You have no enrollments yet.</p>
        `;
        return;
    }

    // Get event info for each enrollment
    const eventPromises = enrollments.map((r) => getEventById(r.eventId));
    const results = await Promise.allSettled(eventPromises);

    const events = results
        .map((result, i) => ({
            status: result.status,
            event: result.status === 'fulfilled' ? result.value : null,
            eventId: enrollments[i].eventId
        }))
        .filter(entry => entry.status === 'fulfilled');

    const tableRows = events.map(({ event, eventId }) => {
        return `
            <tr>
                <td>${event.name}</td>
                <td>${event.description}</td>
                <td>${event.date}</td>
                <td>
                <button class="cancelEnrollmentBtn" data-event-id="${eventId}">Cancel</button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <h2>My Enrollments</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    // Handle cancellation for each enrollment
    document.querySelectorAll('.cancelEnrollmentBtn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const eventId = e.target.dataset.eventId;

            const confirm = await Swal.fire({
                title: 'Cancel Enrollment?',
                text: 'Are you sure you want to cancel this enrollment?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, cancel it',
                cancelButtonText: 'No, keep it'
            });

            if (!confirm.isConfirmed) return;

            try {
                await deleteEnrollmentsByUserAndEvent(session.id, eventId);
                await incrementEventCapacity(eventId);

                await Swal.fire('Cancelled!', 'Your enrollment was cancelled.', 'success');

                // Refresh the personal enrollments list
                renderMyEnrollments(container);

                // Also refresh the list of available events, if visible
                const enrollmentListContainer = document.getElementById('enrollmentSection');
                if (enrollmentListContainer) {
                    renderEnrollmentList(enrollmentListContainer);
                }

            } catch (error) {
                console.error('Failed to cancel enrollment:', error);
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        });
    });
}
