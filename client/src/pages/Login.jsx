import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './CSS/Login.css'

const Login = () => {
    const navigate = useNavigate()

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const loginUser = async (e) => {
        e.preventDefault()

        const { email, password } = data

        try {
            const { data } = await axios.post('/login', {
                email,
                password
            });
            if (data.error) {
                toast.error(data.error)
            } else {
                setData({});
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='login'>
            <form onSubmit={loginUser}>
                <h1>SIGN IN</h1>
                <div className='header'>
                    <label>Email</label>
                </div>
                <input type="text" placeholder='Enter your email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                <div className='header'>
                    <label>Password</label>
                </div>

                <input type="password" placeholder='Enter your password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default Login
