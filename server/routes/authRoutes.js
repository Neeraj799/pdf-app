const express = require('express')
const router = express.Router()
const { getUser, registerUser, loginUser } = require('../controllers/userController')

router.get('/', getUser);
router.post('/register', registerUser)
router.post('/login', loginUser)


module.exports = router