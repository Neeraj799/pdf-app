import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './CSS/Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const registerUser = async (e) => {
        e.preventDefault();

        const { name, email, password } = data;

        try {
            const { data } = await axios.post('/register', {
                name,
                email,
                password,
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                setData({});
                toast.success('Signup Successful. Welcome!');
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='signup-container'>
            <form onSubmit={registerUser} className='signup-form'>
                <h1>SIGNUP</h1>
                <div className='input-group'>
                    <label htmlFor='name'>Username</label>
                    <input type='text' id='name' name='name' placeholder='Enter your name' value={data.name} onChange={changeHandler} />
                </div>
                <div className='input-group'>
                    <label htmlFor='email'>Email</label>
                    <input type='text' id='email' name='email' placeholder='Enter your email' value={data.email} onChange={changeHandler} />
                </div>
                <div className='input-group'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' name='password' placeholder='Enter your password' value={data.password} onChange={changeHandler} />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default Signup;
