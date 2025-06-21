import React, { useEffect, useState } from 'react';

const Notification = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
                onClose(); 
            }
        }, 4000); 
        return () => clearTimeout(timer);
    }, [message, type, onClose]); 
    if (!isVisible) return null;
    return (
        <div className={`notification ${type}`}>
            <p className="notification-message">{message}</p>
            <button
                onClick={() => { setIsVisible(false); if (onClose) onClose(); }}
                className="notification-close-button"
                aria-label="Close notification"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    );
};
export default Notification;
