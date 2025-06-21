const API_BASE_URL = 'http://localhost:5000/api'; 
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return response.text(); 
    }
};
export const fetchEvents = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const url = `${API_BASE_URL}/events?${params.toString()}`;
    const response = await fetch(url);
    return handleResponse(response);
};
export const fetchEventById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return handleResponse(response);
};
export const createEvent = async (eventData) => { 
    const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
};
export const rsvpToEvent = async (eventId, rsvpData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData),
    });
    return handleResponse(response);
};
export const fetchRsvpsForEvent = async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvps`);
    return handleResponse(response);
};

export const deleteEvent = async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};
export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};
// Update an existing event
export const updateEvent = async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
};

