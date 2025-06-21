
import React, { useContext } from 'react';
import { AuthContext } from '../App'; 

const Navbar = ({ onCreateEvent, onViewEvents, onRegister, onLogin }) => {
    const { user, handleLogout } = useContext(AuthContext); 

    return (
        <nav className="navbar">
            {/* Brand/Logo */}
            <div className="navbar-brand" onClick={onViewEvents}>
                EventEase
            </div>

            {/* Navigation Links */}
            <div className="navbar-links">
                <button
                    onClick={onViewEvents}
                    className="navbar-link"
                >
                    Events
                </button>

                {/* Conditional rendering based on user login status and role */}
                {user ? (
                    <>
                        {user.role === 'organizer' && (
                            <button
                                onClick={onCreateEvent}
                                className="button button-primary"
                            >
                                Create Event
                            </button>
                        )}
                        <span className="navbar-user-info">
                            Hello, {user.name} ({user.role})
                        </span>
                        <button
                            onClick={handleLogout}
                            className="button button-danger"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={onLogin}
                            className="button button-success"
                        >
                            Login
                        </button>
                        <button
                            onClick={onRegister}
                            className="button button-info"
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
