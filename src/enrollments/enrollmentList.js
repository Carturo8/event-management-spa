import {
    getAllEvents,
    createEnrollment,
    getEnrollmentsByUser,
    decrementEventCapacity
} from '../services/api.js';
import { getCurrentSession } from '../utils/session.js';
import { renderMyEnrollments } from './myEnrollments.js';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Render the list of available events for visitors to enroll
export async function renderEnrollmentList(container) {
    const session = getCurrentSession();

    // Only visitors can access the enrollment list
    if (!session || session.role !== 'Visitor') {
        container.innerHTML = '<p>You do not have permission to view this section.</p>';
        return;
    }

    // Fetch all events and the user's existing enrollments in parallel
    const [events, enrollments] = await Promise.all([
        getAllEvents(),
        getEnrollmentsByUser(session.id)
    ]);

    // Get a list of event IDs the user has already enrolled
    const enrolledEventIds = enrollments.map((r) => String(r.eventId));

    // Build the table of events with conditional buttons/messages
    const tableRows = events.map((event) => {
        const alreadyEnrolled = enrolledEventIds.includes(String(event.id));
        const isAvailable = event.capacity > 0;

        return `
            <tr>
                <td>${event.name}</td>
                <td>${event.description}</td>
                <td>${event.capacity}</td>
                <td>${event.date}</td>
                <td>
                ${
            alreadyEnrolled
                ? `<em>Already enrolled</em>`
                : isAvailable
                    ? `<button data-id="${event.id}" class="enrollEventBtn">Enroll</button>`
                    : `<em>Sold Out</em>`
        }
                </td>
            </tr>
        `;
    }).join('');

    // Inject HTML into the container
    container.innerHTML = `
        <h2>Events Catalog</h2>
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

    // Handle Enroll button clicks
    document.querySelectorAll('.enrollEventBtn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const eventId = e.target.dataset.id;

            try {
                // Create an enrollment and update event availability
                await createEnrollment({ userId: session.id, eventId });
                await decrementEventCapacity(eventId);

                // Show success alert
                await Swal.fire({
                    title: 'Success!',
                    text: 'Event enrolled successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } catch (error) {
                // Show error alert
                Swal.fire({
                    title: 'Error',
                    text: 'Error while enrolling the event.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error(error);
            }

            // Re-render both enrollment sections
            renderEnrollmentList(container);
            renderMyEnrollments(document.getElementById('myEnrollmentsSection'));
        });
    });
}
