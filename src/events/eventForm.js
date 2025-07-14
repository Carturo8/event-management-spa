import { getCurrentSession } from '../utils/session.js';
import { navigateTo } from '../router/router.js';
import { getEventById, createEvent, updateEvent } from '../services/api.js';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Render the event form for creating or editing an event (only for admins)
export async function renderEventForm(container) {
    const session = getCurrentSession();

    // Only admins can access the form
    if (!session || session.role !== 'Admin') {
        container.innerHTML = '<p>You do not have permission to access this page.</p>';
        return;
    }

    // Check if the form is in edit mode (event ID present in URL)
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    const isEditing = Boolean(eventId);

    // Default event data (used for create or pre-fill if editing)
    let eventData = {
        name: '',
        description: '',
        capacity: '',
        date: ''
    };

    // If editing, fetch the event data
    if (isEditing) {
        eventData = await getEventById(eventId);
        if (!eventData) {
            container.innerHTML = '<p>Event not found.</p>';
            return;
        }
    }

    // Render the form
    container.innerHTML = `
        <h2>${isEditing ? 'Edit Event' : 'Create Event'}</h2>
        <form id="eventForm" class="auth-form">
            <label>Name</label>
            <input type="text" name="name" value="${eventData.name}" required>

            <label>Description</label>
            <input type="text" name="description" value="${eventData.description}" required>

            <label>Capacity</label>
            <input type="number" name="capacity" value="${eventData.capacity}" min="0" required>
            
            <label>Date</label>
            <input type="date" name="date" value="${eventData.date}" required>
            
            <button type="submit">${isEditing ? 'Update' : 'Create'}</button>
            <button id="cancelBtn">Cancel</button>
        </form>
    `;

    // Handle cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        navigateTo('/dashboard');
    });

    const form = document.getElementById('eventForm');

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const event = {
            name: formData.get('name'),
            description: formData.get('description'),
            capacity: parseInt(formData.get('capacity'), 10),
            date: formData.get('date')
        };

        try {
            if (isEditing) {
                await updateEvent(eventId, event);
            } else {
                await createEvent(event);
            }

            // Show success alert
            await Swal.fire({
                title: 'Success!',
                text: `Event ${isEditing ? 'updated' : 'created'} successfully.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigateTo('/dashboard');
        } catch (error) {
            // Show error alert
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong while saving the event.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error(error);
        }
    });
}
