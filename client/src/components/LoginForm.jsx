

import React, { useState } from 'react';

const LoginForm = ({ onLogin, onCancel }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            alert("Please enter both email and password");
            return;
        }
        onLogin({ email, password });
    };

    return (
        <div className="card margin-top-40 max-width-md mx-auto">
            <h2 className="text-center font-extrabold margin-bottom-20">Login to EventEase</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
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
                <div className="flex-between margin-top-40">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="button button-secondary">Cancel</button>
                    <button
                        type="submit"
                        className="button button-primary">Login</button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;