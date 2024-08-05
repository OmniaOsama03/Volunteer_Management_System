const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String, // This will store the encrypted password
    createdEvents: [String],
    joinedEvents: [String],
    isSignedIn : Boolean
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
        const isSignedIn = true; //automatic sign-in happens with account creation
        
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'An Account with this Email Already Exists!' });
        }

        // Encrypt the password before saving
        const encryptedPassword = encrypt(password, secretKey);
        const newUser = new User({ firstName, lastName, email, password: encryptedPassword, isSignedIn });
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

        //updating the isSignedin variable if login is successful
        User.updateOne({ email }, { $set: { isSignedIn: true } })
                .then(() => {
                    res.json({ message: 'Login successful' });
                })
                .catch(err => {
                    res.status(500).json({ error: 'Error updating user status' });
                });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET route to fetch the currently logged-in user
router.get('/getLoggedInUser', async (req, res) => {
    try {
        const user = await User.findOne({ isSignedIn: true });
        
        if (!user) {
            return res.status(404).json({ error: 'No user currently logged in' });
        }

        res.status(200).json({ email: user.email });
    } catch (error) {
        console.error('Error fetching logged-in user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST route for user logout
router.post('/logout', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Set isSignedIn to false
        user.isSignedIn = false;
        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Server error' });
    }
});





// GET route to fetch the currently signed-in user's information
router.get('/profile', async (req, res) => {
    try {
        // Find the user who is signed in
        const user = await User.findOne({ isSignedIn: true });

        if (!user) {
            return res.status(404).json({ error: 'No user is currently signed in' });
        }

        // Send user data
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdEvents: user.createdEvents,
            joinedEvents: user.joinedEvents,
            isSignedIn: user.isSignedIn
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// PATCH route for updating user profile
router.patch('/update', async (req, res) => {
    const { email, newFirstName, newLastName, newEmail } = req.body;

    // Fetch the user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Validate newEmail to ensure it contains both '@' and '.'
    if (newEmail) {
        let hasAt = false;
        let hasDot = false;
        for (let i = 0; i < newEmail.length; i++) {
            if (newEmail[i] === '@') hasAt = true;
            if (newEmail[i] === '.') hasDot = true;
        }
        if (!hasAt || !hasDot) {
            return res.status(400).json({ error: 'Email must contain both "@" and "."' });
        }
        user.email = newEmail;
    }

    // Update user information
    if (newFirstName) user.firstName = newFirstName;
    if (newLastName) user.lastName = newLastName;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
});





// POST route to verify user's password
router.post('/verifyPassword', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Fetch user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Decrypt stored password
        const decryptedPassword = decrypt(user.password);

        // Check if passwords match
        const isMatch = password === decryptedPassword;
        res.json({ isMatch:isMatch });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});








module.exports = router; 

router.patch('/updatePassword', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    // Check for missing fields
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Decrypt the stored password
        const decryptedPassword = decrypt(user.password);
        if (currentPassword !== decryptedPassword) {
            return res.status(400).json({ error: 'Current password is incorrect.' });
        }

        // Encrypt the new password
        const encryptedNewPassword = encrypt(newPassword);

        // Update the user's password
        user.password = encryptedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/checkEmail', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.patch('/updateInfo', async (req, res) => {
    const { newFirstName, newLastName, newEmail } = req.body;

    try {
        // Find the currently signed-in user
        const user = await User.findOne({ isSignedIn: true });

        if (!user) {
            return res.status(404).json({ message: 'No user currently signed in' });
        }

        // Update user information
        if (newFirstName) user.firstName = newFirstName;
        if (newLastName) user.lastName = newLastName;
        if (newEmail) user.email = newEmail;

        // Save updated user information
        await user.save();
        res.json({ message: 'Information updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating information' });
    }
});
