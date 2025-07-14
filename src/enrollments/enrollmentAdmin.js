import { getAllEnrollments, getEventById, getUserById } from '../services/api.js';
import { getCurrentSession } from '../utils/session.js';

// Render all enrollments grouped by event, with search functionality
export async function renderAdminEnrollmentList(container) {
    const session = getCurrentSession();
    if (!session || session.role !== 'Admin') {
        container.innerHTML = '<p>You do not have permission to view this section.</p>';
        return;
    }

    container.innerHTML = `
        <h2>All Events Enrollments</h2>
        <input type="text" id="enrollmentSearchInput" placeholder="Search by event or user...">
        <div id="enrollmentResults"></div>
    `;

    const resultContainer = document.getElementById('enrollmentResults');
    const searchInput = document.getElementById('enrollmentSearchInput');

    try {
        const enrollments = await getAllEnrollments();
        if (enrollments.length === 0) {
            resultContainer.innerHTML = '<p>No enrollments were found.</p>';
            return;
        }

        // Group enrollments by eventId
        const grouped = {};
        for (const res of enrollments) {
            const eventId = String(res.eventId);
            if (!grouped[eventId]) grouped[eventId] = [];
            grouped[eventId].push(res.userId);
        }

        // Fetch all events and users in advance
        const eventCache = {};
        const userCache = {};

        for (const eventId of Object.keys(grouped)) {
            try {
                const event = await getEventById(eventId);
                eventCache[eventId] = event;

                const users = await Promise.allSettled(
                    grouped[eventId].map(userId => getUserById(userId))
                );

                userCache[eventId] = users
                    .filter(r => r.status === 'fulfilled')
                    .map(r => r.value);
            } catch (error) {
                console.error(`Error loading event or users for eventId=${eventId}`, error);
                eventCache[eventId] = null;
                userCache[eventId] = [];
            }
        }

        // Function to render filtered results
        function renderList(filterTerm = '') {
            const filteredItems = [];
            const lowerTerm = filterTerm.toLowerCase();

            for (const eventId in eventCache) {
                const event = eventCache[eventId];
                const users = userCache[eventId];

                if (!event) {
                    filteredItems.push(`<li><strong>Unknown Event (ID ${eventId})—</strong>Failed to load data</li>`);
                    continue;
                }

                const eventMatches = event.name.toLowerCase().includes(lowerTerm);
                const matchingUsers = users.filter(user =>
                    user.name.toLowerCase().includes(lowerTerm) ||
                    user.email.toLowerCase().includes(lowerTerm)
                );

                if (eventMatches) {
                    // Event matches — show all users
                    const userListHtml = users
                        .map(user => `<li>${user.name} (${user.email})</li>`)
                        .join('');
                    filteredItems.push(`
                        <li>
                            <strong>${event.name}</strong> (${event.capacity} copies)
                            <ul>${userListHtml}</ul>
                        </li>
                    `);
                } else if (matchingUsers.length > 0) {
                    // Only some users match
                    const userListHtml = matchingUsers
                        .map(user => `<li>${user.name} (${user.email})</li>`)
                        .join('');
                    filteredItems.push(`
                        <li>
                            <strong>${event.name}</strong> (${event.capacity} copies)
                            <ul>${userListHtml}</ul>
                        </li>
                    `);
                }
            }

            resultContainer.innerHTML = filteredItems.length
                ? `<ul>${filteredItems.join('')}</ul>`
                : `<p>No results were found.</p>`;
        }

        // Initial render
        renderList();

        // Live search listener
        searchInput.addEventListener('input', () => {
            renderList(searchInput.value);
        });

    } catch (error) {
        resultContainer.innerHTML = '<p>Error loading enrollments.</p>';
        console.error('Error fetching enrollments:', error);
    }
}
