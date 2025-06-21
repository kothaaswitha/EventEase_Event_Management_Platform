const mongoose = require('mongoose');
const RSVPSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', 
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true, 
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    rsvpAt: {
        type: Date,
        default: Date.now 
    }
});
RSVPSchema.index({ eventId: 1, email: 1 }, { unique: true });
module.exports = mongoose.model('RSVP', RSVPSchema);
