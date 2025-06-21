import React, { useState } from 'react';

const RegistrationForm = ({ onRegister, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim() || !role) {
            alert("Please fill in all fields");
            return;
        }

        onRegister({ name, email, password, role });
    };

    return (
        <div className="card margin-top-40 max-width-md mx-auto">
            <h2 className="text-center font-extrabold margin-bottom-20">Register New Account</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role" className="form-label">Register As</label>
                    <select
                        id="role"
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a role</option>
                        <option value="participant">Participant</option>
                        <option value="organizer">Organizer</option>
                    </select>
                </div>
                <div className="flex-between margin-top-40">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="button button-secondary">Cancel</button>
                    <button
                        type="submit"
                        className="button button-primary">Register</button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
