
// client/src/components/EventDetails.jsx (Plain CSS) - Updated with Edit Functionality
import React, { useState, useEffect, useContext } from 'react';
import { fetchEventById, rsvpToEvent, fetchRsvpsForEvent, deleteEvent, updateEvent } from '../api'; // Import API functions including updateEvent
import RSVPForm from './RSVPForm'; // Import the RSVP form component
import { AuthContext } from '../App'; // To get logged-in user info

const EventDetails = ({ eventId, onBackToList, showNotification }) => {
    const { user } = useContext(AuthContext); // Get user from context
    const [event, setEvent] = useState(null);
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRsvpConfirmed, setIsRsvpConfirmed] = useState(false); // Track if user has RSVP'd
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal
    const [isEditing, setIsEditing] = useState(false); // State for edit mode
    const [editForm, setEditForm] = useState({
        name: '',
        date: '',
        location: '',
        organizer: '',
        description: ''
    }); // Edit form data
    const [editLoading, setEditLoading] = useState(false); // Loading state for edit operation

    // Fetch event details and RSVPs
    useEffect(() => {
        const getEventData = async () => {
            setLoading(true);
            setError(null);
            try {
                const eventData = await fetchEventById(eventId);
                setEvent(eventData);

                // Initialize edit form with current event data
                setEditForm({
                    name: eventData.name || '',
                    date: eventData.date ? new Date(eventData.date).toISOString().slice(0, 16) : '',
                    location: eventData.location || '',
                    organizer: eventData.organizer || '',
                    description: eventData.description || ''
                });

                const rsvpData = await fetchRsvpsForEvent(eventId);
                setRsvps(rsvpData);

                // After fetching RSVPs, check if current user has RSVP'd
                if (user && rsvpData) {
                    const userRsvpd = rsvpData.some(rsvp => rsvp.email.toLowerCase() === user.email.toLowerCase());
                    setIsRsvpConfirmed(userRsvpd);
                }
            } catch (err) {
                console.error('Error fetching event data:', err);
                setError('Failed to load event details or RSVPs.');
                showNotification(`Failed to load event data: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            getEventData();
        }
    }, [eventId, user, showNotification]); // Re-run if eventId, user, or showNotification changes

    // Handle RSVP submission from RSVPForm
    const handleSubmitRSVP = async (id, rsvpData) => {
        try {
            const newRsvp = await rsvpToEvent(id, rsvpData);
            setRsvps((prevRsvps) => [...prevRsvps, newRsvp]); // Add new RSVP to list
            setIsRsvpConfirmed(true); // Set confirmed status
            showNotification('Successfully RSVP\'d to the event!', 'success');
        } catch (err) {
            console.error('Error submitting RSVP:', err);
            showNotification(`Failed to RSVP: ${err.message}`, 'error');
        }
    };

    // Handle event deletion
    const handleDeleteEvent = async () => {
        setShowDeleteConfirm(false); // Close the confirmation modal
        if (!event || !eventId) return;

        try {
            // In the current insecure backend, this is public.
            // In a secure setup, you'd only enable this button for the event creator/organizer.
            await deleteEvent(eventId);
            showNotification(`Event "${event.name}" deleted successfully!`, 'success');
            onBackToList(); // Navigate back to the event list after deletion
        } catch (err) {
            console.error('Error deleting event:', err);
            showNotification(`Failed to delete event: ${err.message}`, 'error');
        }
    };

    // Handle edit form input changes
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle edit form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!event || !eventId) return;

        // Basic validation
        if (!editForm.name.trim() || !editForm.date || !editForm.location.trim()) {
            showNotification('Please fill in all required fields (Name, Date, Location)', 'error');
            return;
        }

        setEditLoading(true);
        try {
            // Prepare the update data
            const updateData = {
                name: editForm.name.trim(),
                date: new Date(editForm.date).toISOString(),
                location: editForm.location.trim(),
                organizer: editForm.organizer.trim() || event.organizer,
                description: editForm.description.trim()
            };

            const updatedEvent = await updateEvent(eventId, updateData);
            setEvent(updatedEvent);
            setIsEditing(false);
            showNotification(`Event "${updatedEvent.name}" updated successfully!`, 'success');
        } catch (err) {
            console.error('Error updating event:', err);
            showNotification(`Failed to update event: ${err.message}`, 'error');
        } finally {
            setEditLoading(false);
        }
    };

    // Cancel edit mode and reset form
    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form to original event data
        setEditForm({
            name: event.name || '',
            date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
            location: event.location || '',
            organizer: event.organizer || '',
            description: event.description || ''
        });
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <p className="text-center loading-message margin-top-40">Loading event details...</p>;
    if (error) return <p className="text-center error-message margin-top-40">{error}</p>;
    if (!event) return <p className="text-center no-events-message margin-top-40">Event not found.</p>;

    // Determine if the edit and delete buttons should be shown (UI logic, not backend auth)
    // In the "no middleware" backend, anyone can edit/delete if they know the ID.
    // This is just for user experience.
    const showEditDeleteButtons = user && user.role === 'organizer';

    return (
        <div className="event-details-container">
            <div className="flex-between margin-bottom-30">
                <button
                    onClick={onBackToList}
                    className="back-button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Events
                </button>

                {showEditDeleteButtons && !isEditing && (
                    <div className="flex gap-10">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="button button-primary"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}>
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit Event
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="button button-danger"
                        >
                            Delete Event
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                // Edit Form
                <div className="event-edit-form card">
                    <h2 className="event-details-header margin-bottom-20">Edit Event</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="form-group margin-bottom-15">
                            <label htmlFor="edit-name" className="form-label">Event Name *</label>
                            <input
                                type="text"
                                id="edit-name"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditInputChange}
                                className="form-input"
                                required
                                disabled={editLoading}
                            />
                        </div>

                        <div className="form-group margin-bottom-15">
                            <label htmlFor="edit-date" className="form-label">Date & Time *</label>
                            <input
                                type="datetime-local"
                                id="edit-date"
                                name="date"
                                value={editForm.date}
                                onChange={handleEditInputChange}
                                className="form-input"
                                required
                                disabled={editLoading}
                            />
                        </div>

                        <div className="form-group margin-bottom-15">
                            <label htmlFor="edit-location" className="form-label">Location *</label>
                            <input
                                type="text"
                                id="edit-location"
                                name="location"
                                value={editForm.location}
                                onChange={handleEditInputChange}
                                className="form-input"
                                required
                                disabled={editLoading}
                            />
                        </div>

                        <div className="form-group margin-bottom-15">
                            <label htmlFor="edit-organizer" className="form-label">Organizer</label>
                            <input
                                type="text"
                                id="edit-organizer"
                                name="organizer"
                                value={editForm.organizer}
                                onChange={handleEditInputChange}
                                className="form-input"
                                disabled={editLoading}
                            />
                        </div>

                        <div className="form-group margin-bottom-20">
                            <label htmlFor="edit-description" className="form-label">Description</label>
                            <textarea
                                id="edit-description"
                                name="description"
                                value={editForm.description}
                                onChange={handleEditInputChange}
                                className="form-textarea"
                                rows="4"
                                disabled={editLoading}
                            />
                        </div>

                        <div className="flex-center gap-15">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="button button-secondary"
                                disabled={editLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button button-primary"
                                disabled={editLoading}
                            >
                                {editLoading ? 'Updating...' : 'Update Event'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // Display Mode
                <>
                    <h2 className="event-details-header">{event.name}</h2>
                    <div className="event-details-grid">
                        <div className="event-details-info">
                            <p><strong>Date:</strong> {formatDate(event.date)}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Organizer:</strong> {event.organizer}</p>
                            <p><strong>Description:</strong></p>
                            <div className="event-description-box">
                                <p>{event.description}</p>
                            </div>
                        </div>
                        <div>
                            {/* RSVP Form Section */}
                            {isRsvpConfirmed ? (
                                <div className="rsvp-section-confirmed card-sm">
                                    <p>🎉 You have already RSVP'd to this event!</p>
                                </div>
                            ) : (
                                <RSVPForm eventId={event._id} onSubmitRSVP={handleSubmitRSVP} showNotification={showNotification} />
                            )}

                            {/* Confirmed RSVPs List */}
                            <div className="rsvps-list-card">
                                <h3>Confirmed RSVPs ({rsvps.length})</h3>
                                {rsvps.length > 0 ? (
                                    <ul className="rsvps-list">
                                        {rsvps.map((rsvp) => (
                                            <li key={rsvp._id}>
                                                <span className="rsvps-name">{rsvp.name}</span>
                                                <span className="rsvps-email">{rsvp.email}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center">No RSVPs yet. Be the first to join!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <h3 className="text-center font-bold margin-bottom-20">Confirm Deletion</h3>
                        <p className="text-center margin-bottom-20">Are you sure you want to delete the event "{event.name}"? This action cannot be undone.</p>
                        <div className="flex-center gap-15">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="button button-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteEvent}
                                className="button button-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;

