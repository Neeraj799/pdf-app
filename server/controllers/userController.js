const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');

const getUser = (req, res) => {
    res.json('test is working')
}

//Register endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Check if name was entered
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        };

        //Check is password is good
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be atleast 6 characters long'
            })
        };

        //Check email
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'Email is taken already'
            })
        }

        const hashedPassword = await hashPassword(password)

        // Create user in database

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        return res.json(user)

    } catch (error) {
        console.log(error)
    }
}

// Login endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'No user found'
            })
        }

        //Check if passwords match
        const match = await comparePassword(password, user.password)

        if (!match) {
            res.json({
                error: "Passwords do not match"
            })
        }
        // Generate and return a JWT token
        const token = jwt.sign({

            userId: user._id
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "1hr"
            });
        return res.json({ token })
    } catch (error) {
        console.log(error);
    }

}




const logoutUser = (req, res) => {
    // Clear the JWT token from the client-side (local storage)
    res.json({ message: 'Logout successful' });
};





module.exports = {
    getUser,
    registerUser,
    loginUser,
    logoutUser

}