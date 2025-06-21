const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});
EventSchema.index({ date: 1 });
module.exports = mongoose.model('Event', EventSchema);
