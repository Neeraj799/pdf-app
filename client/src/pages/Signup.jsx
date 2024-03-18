import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './CSS/Signup.css'


const Signup = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const registerUser = async (e) => {
        e.preventDefault();

        const { name, email, password } = data

        try {
            const { data } = await axios.post('/register', {
                name, email, password
            })
            if (data.error) {
                toast.error(data.error)
            } else {
                setData({})
                toast.success('Login Succesful. Welcome!')
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='signup'>
            <form onSubmit={registerUser}>
                <h1>SIGNUP</h1>
                <div className='header'>
                    <label>Username</label>
                </div>

                <input type="text" name='name' placeholder='Enter your name' value={data.name} onChange={changeHandler} />
                <div className='header'>
                    <label>Email</label>
                </div>

                <input type="text" name='email' placeholder='Enter your email' value={data.email} onChange={changeHandler} />
                <div className='header'>
                    <label>Password</label>
                </div>

                <input type="password" name='password' placeholder='Enter your password' value={data.password} onChange={changeHandler} />
                <button>Submit</button>
            </form>

        </div>
    )
}

export default Signup
