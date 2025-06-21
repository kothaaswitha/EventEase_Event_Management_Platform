
import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../api';


const EventList = ({ onViewDetails, showNotification }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (filterDate) filters.date = filterDate;
        if (filterLocation) filters.location = filterLocation;
        const data = await fetchEvents(filters);
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        showNotification(`Failed to load events: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterDate, filterLocation, showNotification]);


  
  return (
    <div className="card">
      <h2 className="event-list-header">Upcoming Events</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="form-group filter-group">
          <label htmlFor="filterDate" className="form-label">Filter by Date</label>
          <input
            type="date"
            id="filterDate"
            className="form-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="form-group filter-group">
          <label htmlFor="filterLocation" className="form-label">Filter by Location</label>
          <input
            type="text"
            id="filterLocation"
            placeholder="e.g., Hyderabad"
            className="form-input"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>
        <div className="flex-start">
          <button
            onClick={() => {
              setFilterDate('');
              setFilterLocation('');
            }}
            className="button button-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading && <p className="text-center loading-message">Loading events...</p>}
      {error && <p className="text-center error-message">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="text-center no-events-message">
          No upcoming events found. Check back later or create one!
        </p>
      )}

      <div className="event-grid">
        {events.map((evt) => (
          <div key={evt._id} className="event-card">
            <img
              src={evt.imageUrl || 'https://i.ibb.co/h162qrR/technical-resources-twitter-post.jpg'}
              alt={evt.name}
              className="event-card-image"
            />
            <div className="event-card-content">
              <h3 className="event-card-title" title={evt.name}>{evt.name}</h3>
              <p className="event-card-info"><strong>Date:</strong> {formatDate(evt.date)}</p>
              <p className="event-card-info"><strong>Location:</strong> {evt.location}</p>
              <p className="event-card-info"><strong>Organizer:</strong> {evt.organizer}</p>
            </div>
            <div className="event-card-button-wrapper">
              <button
                onClick={() => onViewDetails(evt._id)}
                className="button button-primary button-full-width"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;


