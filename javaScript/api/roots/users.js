const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    createdEvents: [String],
    joinedEvents: [String]
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Create the model
const User = mongoose.model('User', userSchema);

// POST route to create a user
router.post('/', async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST route to check password match
router.post('/checkPassword', (req, res) => {
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    const match = password === confirmPassword;

    // Send response with match property
    res.json({ match });
});


// POST route to check password strength
router.post('/checkPasswordStrength', (req, res) => {
    const { password } = req.body;

    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    const isStrong = hasCapitalLetter && hasNumber && isLongEnough;

    res.json({ isStrong, hasCapitalLetter, hasNumber, isLongEnough });
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});









router.get('/profile/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT route to update user profile
router.put('/update', async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
