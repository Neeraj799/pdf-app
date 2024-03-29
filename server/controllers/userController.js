const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

// GET endpoint for testing
const getUser = (req, res) => {
    res.json('test is working');
};

// Register endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if name was entered
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Check if password is valid
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password is required and should be at least 6 characters long' });
        }

        // Check if email already exists
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ error: 'Email is already taken' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create user in the database
        const user = await User.create({ name, email, password: hashedPassword });

        // Return the user object (without the password)
        return res.status(201).json({ user: { name: user.name, email: user.email, _id: user._id } });
    } catch (error) {
        // Handle any other errors
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Login endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'No user found with this email' });
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Generate and return a JWT token
        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', email: user.email, userId: user._id, name: user.name, token });
    } catch (error) {
        // Handle any other errors
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const logoutUser = (req, res) => {
    // Clear the JWT token from the client-side (local storage)
    res.json({ message: 'Logout successful' });
};

module.exports = { getUser, registerUser, loginUser, logoutUser };