import React, { useState, useEffect, createContext, useContext } from 'react';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import { fetchEvents, fetchEventById, createEvent, rsvpToEvent, registerUser, loginUser, fetchRsvpsForEvent } from './api';
export const AuthContext = createContext(null);
const App = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [notification, setNotification] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); 
    // Effect to check local storage for user info on app load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Function to show a notification message
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null); // Clear notification after 5 seconds
        }, 5000);
    };

    // --- Navigation Functions ---
    const navigateToEventList = () => {
        setCurrentView('list');
        setSelectedEventId(null);
    };

    const navigateToEventDetails = (eventId) => {
        setSelectedEventId(eventId);
        setCurrentView('details');
    };

    const navigateToCreateEvent = () => {
        setCurrentView('create');
    };

    const navigateToRegister = () => {
        setCurrentView('register');
    };

    const navigateToLogin = () => {
        setCurrentView('login');
    };

    // --- Authentication Handlers ---
    const handleRegister = async (userData) => {
        try {
            const data = await registerUser(userData);
            showNotification('Registration successful! You can now log in.', 'success');
            console.log('Registered user:', data);
            navigateToLogin(); // After registration, redirect to login
        } catch (error) {
            showNotification(`Registration failed: ${error.message || 'Server error'}`, 'error');
            console.error('Registration error:', error);
        }
    };

    const handleLogin = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            if (data && data._id) { // Assuming _id exists in response for successful login
                setToken(data.token); // Store token (even if not used for auth)
                setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
                localStorage.setItem('token', data.token); // Store token
                localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role })); // Store user info
                showNotification(`Welcome, ${data.name}!`, 'success');
                navigateToEventList(); // Redirect to event list after login
            } else {
                showNotification('Login failed: Invalid response from server.', 'error');
            }
        } catch (error) {
            showNotification(`Login failed: ${error.message || 'Invalid credentials'}`, 'error');
            console.error('Login error:', error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showNotification('Logged out successfully!', 'success');
        navigateToEventList(); 
    };
    const handleCreateEvent = async (eventData) => {
        try {
            const finalEventData = {
                ...eventData,
                createdBy: user ? user._id : '60c728b29f1d8e12a4b5c6d7', 
                organizer: user ? user.name : eventData.organizer || 'Guest Organizer'
            };
            const newEvent = await createEvent(finalEventData);
            showNotification(`Event "${newEvent.name}" created successfully!`, 'success');
            navigateToEventList();
        } catch (error) {
            showNotification(`Failed to create event: ${error.message || 'Server error'}`, 'error');
            console.error('Create event error:', error);
        }
    };
    const renderContent = () => {
        switch (currentView) {
            case 'list':
                return <EventList
                            onViewDetails={navigateToEventDetails}
                            showNotification={showNotification}
                        />;
            case 'details':
                return <EventDetails
                            eventId={selectedEventId}
                            onBackToList={navigateToEventList}
                            showNotification={showNotification}
                            user={user} 
                        />;
            case 'create':
                if (user && user.role === 'organizer') {
                    return <EventForm
                                onCreateEvent={handleCreateEvent}
                                onCancel={navigateToEventList}
                                showNotification={showNotification}
                            />;
                } else {
                    return (
                        <div className="access-denied-message card">
                            <h2 className="error-message">Access Denied</h2>
                            <p>Only organizers can create events. Please log in as an organizer.</p>
                            <button
                                onClick={navigateToLogin}
                                className="button button-primary"
                            >
                                Go to Login
                            </button>
                        </div>
                    );
                }
            case 'register':
                return <RegistrationForm onRegister={handleRegister} onCancel={navigateToLogin} />;
            case 'login':
                return <LoginForm onLogin={handleLogin} onCancel={navigateToEventList} />;
            default:
                return <EventList onViewDetails={navigateToEventDetails} showNotification={showNotification} />;
        }
    };
    return (
        <AuthContext.Provider value={{ user, token, handleLogout }}>
            <div className="app-container">
                <Navbar
                    user={user}
                    onLogout={handleLogout}
                    onCreateEvent={navigateToCreateEvent}
                    onViewEvents={navigateToEventList}
                    onRegister={navigateToRegister}
                    onLogin={navigateToLogin}
                />
                {/* Notification bar for success/error messages */}
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
                <main className="container margin-top-40">
                    {renderContent()}
                </main>
            </div>
        </AuthContext.Provider>
    );
};

export default App;
