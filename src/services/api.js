const BASE_URL = 'http://localhost:3000';

//
// USER API
//

// Fetch user by email
export async function getUserByEmail(email) {
    const response = await fetch(`${BASE_URL}/users?email=${email}`);
    return await response.json();
}

// Register a new user
export async function registerUser(userData) {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return await response.json();
}

// Get user by ID
export async function getUserById(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    return await response.json();
}

//
// EVENT API
//

// Get all events
export async function getAllEvents() {
    const response = await fetch(`${BASE_URL}/events`);
    return await response.json();
}

// Get event by ID
export async function getEventById(eventId) {
    const response = await fetch(`${BASE_URL}/events/${eventId}`);
    return await response.json();
}

// Create a new event
export async function createEvent(event) {
    const response = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    return await response.json();
}

// Update an existing event
export async function updateEvent(eventId, event) {
    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    return await response.json();
}

// Delete event by ID
export async function deleteEventById(eventId) {
    await fetch(`${BASE_URL}/events/${eventId}`, { method: 'DELETE' });
}

// Decrement capacity copies by 1
export async function decrementEventCapacity(eventId) {
    const event = await getEventById(eventId);
    if (!event || event.capacity <= 0) return;

    const updated = { ...event, capacity: event.capacity - 1 };

    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    });

    return await response.json();
}

// Increment capacity copies by 1
export async function incrementEventCapacity(eventId) {
    const event = await getEventById(eventId);
    if (!event) return;

    const updated = { ...event, capacity: event.capacity + 1 };

    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    });

    return await response.json();
}

//
// ENROLLMENT API
//

// Create a new enrollment
export async function createEnrollment(enrollment) {
    const response = await fetch(`${BASE_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment)
    });
    return await response.json();
}

// Get all enrollments
export async function getAllEnrollments() {
    const response = await fetch(`${BASE_URL}/enrollments`);
    return await response.json();
}

// Get enrollments by user ID
export async function getEnrollmentsByUser(userId) {
    const response = await fetch(`${BASE_URL}/enrollments?userId=${userId}`);
    return await response.json();
}

// Delete all enrollments for a specific event
export async function deleteEnrollmentsByEventId(eventId) {
    const response = await fetch(`${BASE_URL}/enrollments?eventId=${eventId}`);
    const enrollments = await response.json();

    for (const enrollment of enrollments) {
        await fetch(`${BASE_URL}/enrollments/${enrollment.id}`, {
            method: 'DELETE'
        });
    }
}

// Delete a single enrollment by userId and eventId
export async function deleteEnrollmentsByUserAndEvent(userId, eventId) {
    const response = await fetch(`${BASE_URL}/enrollments?userId=${userId}&eventId=${eventId}`);
    const enrollments = await response.json();

    if (enrollments.length === 0) return;

    // Assuming only one enrollment per user per event
    const enrollmentId = enrollments[0].id;

    await fetch(`${BASE_URL}/enrollments/${enrollmentId}`, {
        method: 'DELETE'
    });
}
