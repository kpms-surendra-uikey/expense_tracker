import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { generateToken } from '../utils/index.js';

const router = express.Router();

// Define your routes here
router.post('/', async (req, res) => {
    const { username, password, emailId, phoneNumber } = req.body;
    
    if (!username || !password || !emailId || !phoneNumber) {
        return res.json({message: 'username, passowrd, emailId, phoneNumber is mandatory'});
    }

    const usernameValidation = await User.findOne({ username });
    if (usernameValidation) {
        return res.json({message: 'Username already being used.'})
    }

    const emailIdValidation = await User.findOne({ emailId });
    if (emailIdValidation) {
        return res.json({message: 'Email id already being used.'})
    }
    
    const phoneNumberValidation = await User.findOne({ phoneNumber });
    if (phoneNumberValidation) {
        return res.json({message: 'Phone number already being used.'})
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    
    const user = User({
        username: username,
        password: hashedPassword,
        emailId: emailId,
        phoneNumber: phoneNumber
    });

    try {
        user.save();
    } catch (error) {
        res.json({
            message: 'Error while creating the user.',
        })
    }

    res.json({
        message: 'User saved successfully.',
        username: user.username
    });
});

// Define your routes here
router.put('/update-password', async (req, res) => {
    const { emailId, password } = req.body;
    
    if (!emailId || !password) {
        return res.json({message: 'passowrd, emailId is mandatory'});
    }
    
    const user = await User.findOne({ emailId });
    
    if (!user) {
        return res.json({ message: 'User not found.' })
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const updatedUser = await User.updateOne({ emailId }, { password: hashedPassword });
    res.clearCookie('accessToken');

    const token = generateToken(updatedUser);

    res.cookie('accessToken', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });

    res.json({
        message: 'User saved successfully.',
        username: user.username
    });
});

router.post('/sign-in', async (req, res) => {
    const { password, emailId } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
        return res.json({ message: 'User not found.' })
    }

    const passwordMatched = bcrypt.compareSync(password, user.password)

    if(!passwordMatched) {
        return res.json({ message: 'Password incorrect.'})
    }

    const token = generateToken(user);

    res.cookie('accessToken', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });

    res.json({
        message: 'User signed in successfully.',
        username: user.username
    });
});

router.post('/logout', async (req, res) => {
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) {
        return res.json({
            message: 'User already logged out.'
        })
    }
    res.clearCookie('accessToken');

    res.json({
        message: 'User logged out successfully.'
    });
});

export default router;
