import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App'; 
const RSVPForm = ({ eventId, onSubmitRSVP, showNotification }) => {
    const { user } = useContext(AuthContext); 
    const [name, setName] = useState(user ? user.name : ''); 
    const [email, setEmail] = useState(user ? user.email : ''); 
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        } else {
            setName('');
            setEmail('');
        }
    }, [user]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email) {
            showNotification('Please enter your name and email to RSVP.', 'error');
            return;
        }     
        onSubmitRSVP(eventId, {
            name,
            email,
            userId: user ? user._id : undefined 
        });
    };
    return (
        <div className="card-sm">
            <h3 className="font-bold margin-bottom-20">RSVP for this Event</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="rsvpName" className="form-label">Your Name</label>
                    <input
                        type="text"
                        id="rsvpName"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rsvpEmail" className="form-label">Your Email</label>
                    <input
                        type="email"
                        id="rsvpEmail"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="button button-info button-full-width" 
                >
                    Confirm RSVP
                </button>
            </form>
        </div>
    );
};

export default RSVPForm;
