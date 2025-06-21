import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; 
const EventForm = ({ onCreateEvent, onCancel, showNotification }) => {
    const { user } = useContext(AuthContext); 
    const [name, setName] = useState('');
    const [date, setDate] = useState(''); 
    const [time, setTime] = useState(''); 
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullDateTime = `${date}T${time}:00Z`; 
        const eventDate = new Date(fullDateTime);

        if (isNaN(eventDate.getTime())) {
            showNotification('Please enter a valid date and time.', 'error');
            return;
        }
        onCreateEvent({
            name,
            date: eventDate.toISOString(), 
            location,
            description,
            organizer: user ? user.name : 'Unknown Organizer', 
            createdBy: user ? user._id : '60c728b29f1d8e12a4b5c6d7' 
        });
    };

    return (
        <div className="card margin-top-40 max-width-xl mx-auto">
            <h2 className="text-center font-extrabold margin-bottom-20">Create New Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Event Name</label>
                    <input
                        type="text"
                        id="name"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group grid-two-cols"> {/* Using a custom class for grid */}
                    <div>
                        <label htmlFor="date" className="form-label">Date</label>
                        <input
                            type="date"
                            id="date"
                            className="form-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="time" className="form-label">Time</label>
                        <input
                            type="time"
                            id="time"
                            className="form-input"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                        type="text"
                        id="location"
                        className="form-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        rows="4"
                        className="form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="flex-between margin-top-40">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="button button-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="button button-primary"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
