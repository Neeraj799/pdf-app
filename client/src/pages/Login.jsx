import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;

        try {
            const response = await axios.post('/login', { email, password });
            const { token } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                toast.success('Logged in successfully');
                navigate('/');
            } else {
                toast.error(response.data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('An error occurred while logging in');
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={loginUser} className='login-form'>
                <h1>SIGN IN</h1>
                <div className='input-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='text'
                        id='email'
                        name='email'
                        placeholder='Enter your email'
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                </div>
                <div className='input-group'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter your password'
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default Login;
