const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    getRsvpsForEvent
} = require('../controllers/eventController'); 
router.post('/', createEvent); 
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/:id/rsvp', rsvpToEvent); 
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id/rsvps', getRsvpsForEvent);

module.exports = router;
