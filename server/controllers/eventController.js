const Event = require('../models/Event'); 
const RSVP = require('../models/RSVP');   
const createEvent = async (req, res) => {
    const { name, date, location, description, organizer, createdBy } = req.body;
    if (!name || !date || !location || !description || !organizer || !createdBy) {
        return res.status(400).json({ message: 'Name, date, location, description, organizer, and createdBy are all required for event creation in this mode.' });
    }
    try {
        const event = new Event({
            name,
            date,
            location,
            organizer, 
            description,
            createdBy 
        });
        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ message: 'Error creating event', error: error.message });
    }
};
const getEvents = async (req, res) => {
    const { date, location } = req.query;
    let query = {};
    if (date) {
        const filterDate = new Date(date);
        filterDate.setHours(0, 0, 0, 0);
        query.date = { $gte: filterDate };
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query.date = { $gte: today };
    }
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }
    try {
        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error fetching events' });
    }
};
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ message: 'Server error fetching event details' });
    }
};
const updateEvent = async (req, res) => {
    const { name, date, location, description } = req.body;

    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            event.name = name || event.name;
            event.date = date || event.date;
            event.location = location || event.location;
            event.description = description || event.description;
            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error updating event' });
    }
};
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            await RSVP.deleteMany({ eventId: req.params.id });
            await event.deleteOne();
            res.json({ message: 'Event and associated RSVPs removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error deleting event' });
    }
};
const rsvpToEvent = async (req, res) => {
    const { name, email, userId } = req.body; 
    const eventId = req.params.id;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required for RSVP' });
    }
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const existingRSVP = await RSVP.findOne({ eventId, email });
        if (existingRSVP) {
            return res.status(409).json({ message: 'You have already RSVP\'d to this event with this email.' });
        }
        const rsvp = new RSVP({
            eventId,
            name,
            email,
            userId: userId || undefined 
        });
        const createdRSVP = await rsvp.save();
        res.status(201).json(createdRSVP);
    } catch (error) {
        console.error('Error creating RSVP:', error);
        if (error.code === 11000) {
             return res.status(409).json({ message: 'You have already RSVP\'d to this event with this email.' });
        }
        res.status(400).json({ message: 'Error creating RSVP', error: error.message });
    }
};
const getRsvpsForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const rsvps = await RSVP.find({ eventId });
        res.json(rsvps);
    } catch (error) {
        console.error('Error fetching RSVPs for event:', error);
        res.status(500).json({ message: 'Server error fetching RSVPs' });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    getRsvpsForEvent
};
