import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css'

const LogoutButton = () => {
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            await axios.post('/logout');
            localStorage.removeItem('token');
            navigate('/register'); // Redirect to the login page
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='logoutButton'>
            <button onClick={logoutUser}>Logout</button>
        </div>

    );
};

export default LogoutButton;
