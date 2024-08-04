const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String, // This will store the encrypted password
    createdEvents: [String],
    joinedEvents: [String]
});

// Create the model
const User = mongoose.model('User', userSchema);


const CryptoJS = require('crypto-js');

const secretKey = 'my$trong$ecretK3y!';

// Encryption function
function encrypt(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Decryption function
function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}



// POST route to create a user
router.post('/', async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'An Account with this Email Already Exists!' });
        }

        // Encrypt the password before saving
        const encryptedPassword = encrypt(password, secretKey);
        const newUser = new User({ firstName, lastName, email, password: encryptedPassword });
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

    // Function to check if the password contains at least one capital letter
    function hasCapitalLetter(password) {
        for (let i = 0; i < password.length; i++) {
            if (password[i] >= 'A' && password[i] <= 'Z') {
                return true;
            }}
        return false;}
    // Function to check if the password contains at least one number
    function hasNumber(password) {
        for (let i = 0; i < password.length; i++) {
            if (password[i] >= '0' && password[i] <= '9') {
                return true;
            }
        }
        return false;}
    // Function to check if the password length is at least 8 characters
    function isLongEnough(password) {
        return password.length >= 8;
    }
    // Check password criteria
    const hasCapital = hasCapitalLetter(password);
    const hasNum = hasNumber(password);
    const longEnough = isLongEnough(password);

    // Determine if the password is strong
    const isStrong = hasCapital && hasNum && longEnough;

    // Send the result as JSON response
    res.json({ isStrong, hasCapital, hasNum, longEnough });
});


// POST route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Decrypt the stored password and compare
        const decryptedPassword = decrypt(user.password);
        const isMatch = password === decryptedPassword;
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;