const User = require('../models/User');

// @desc    Create a new user
// @route   POST /users
// @access  Public
const createUser = async (req, res) => {
    try {
        const { name, phone, addresses } = req.body;

        const userExists = await User.findOne({ phone });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            phone,
            addresses
        });

        if (user) {
            res.status(201).json(user);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            res.json(user); // Returns user object including addresses array
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getUserById
};
