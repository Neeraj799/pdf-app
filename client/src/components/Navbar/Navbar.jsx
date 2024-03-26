import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import LogoutButton from '../LogoutButton/LogoutButton'

const Navbar = () => {
    return (
        <header>
            <div className='container'>
                <Link to="/">
                    <h1>Workout Buddy</h1>
                </Link>
            </div>
            <LogoutButton />
        </header>
    )
}

export default Navbar
