const mongoose = require('mongoose');
const User = require('../models/User');
const VerificationToken = require('../models/verificationToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/email.services');

const generateSixDigitPin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const validateSignup = (email, password, phoneNumber) => {
    
    if (!email || !password || !phoneNumber){
        return 'Email, password, and phone number are required';
    }

    if (password.length < 8){
        return 'Password must be at least 8 characters long'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        return 'Invalid email format';
    }

    return null;
}

exports.signup = async (req, res) => {
    console.log('--- Signup Attempt ---'); 
    console.log('Received Body:', req.body);
    const { email, password, phoneNumber } = req.body;

    const validationError = validateSignup(email, password, phoneNumber);
    if (validationError){
        return res.status(400).json({message : validationError});
    }

    try {
        const emailLower = email.toLowerCase();
        const existingUser = await User.findOne({ email : emailLower});

        if (existingUser) {
            if (existingUser.status === 'inactive'){
                return res.status(409).json({ message : 'User exists but is not active. Please check your email for the verification link.'});
            }
            return res.status(409).json({ message : 'User with this email already exists.'});
        }

        const stringToHash = `${password}:${emailLower}`;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(stringToHash, saltRounds);

        const newUser = new User({
            email: emailLower,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            balance: new mongoose.Types.Decimal128("500.00"),
        });

        await newUser.save();
    
        const sixDigitPin = generateSixDigitPin();

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '5m'}
        );

        const verificationEntry = new VerificationToken({
            userId: newUser._id,
            sixDigitPin: sixDigitPin,
        });
        await verificationEntry.save();

        const verificationURL = `http://localhost:5000/bank_app/api/v1/auth?token=${token}&pin=${sixDigitPin}`;

        await sendVerificationEmail(newUser.email, verificationURL);

        res.status(201).json({ 
            message: 'User registered successfully. Verification link sent to your email.',
            user: {
                id: newUser._id,
                email: newUser.email,
                status: newUser.status
            },
            DEBUG_INFO: {
                verificationURL: verificationURL,
                pin: sixDigitPin
            }
        });

    } catch (error) {
        console.error('Signup Error', error);
        res.status(500).json({ message: 'Server error during registration.'});
    }
    
}

exports.verifyAccount = async (req, res) => {
    const { token, pin } = req.query;

    if ( !token || !pin ){
        return res.status(400).json({ message : 'Missing verification token on PIN.'});
    }

    try {
        let decoded;

        try {
            // check token expiry
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError){
            if (jwtError.name === 'TokenExpiredError'){
                return res.status(401).json({ message : 'Verification link expired. Please sign up again or request a new link.'});
            } 
            return res.status(401).json({ message : 'Invalid verification token.'});
        }

        const userId = decoded.userId;

        const verificationRecord = await VerificationToken.findOne({
            userId: userId,
            sixDigitPin: pin
        });

        if (!verificationRecord){
            return res.status(404).json({ message : 'Invalid PIN or token/PIN combination not found.'});
        }

        const user = await User.findById(userId);

        if (!user){
            return res.status(404).json({ message : 'User not found.'});
        }

        if (user.status === 'active'){
            return res.status(200).json({ message : 'Account already active. You can now log in.'});
        }

        user.status = 'active';
        await user.save();

        await VerificationToken.deleteOne({ _id: verificationRecord._id });

        res.status(200).json({
            message: 'Account successfully activated! You can log in.',
            user: {
                id: user._id,
                email: user.email,
                balance: user.balance
            }
        });

    } catch (error){
        console.error('Verification Error:', error);
        res.status(500).json({ message: 'Server error during account verification'});
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password ){
        return res.status(400).json({ message: 'Email and Password are required'});
    }

    try {
        const emailToLower = email.toLowerCase();

        const user = await User.findOne({ email: emailToLower });

        if (!user){
            return res.status(401).json({ message: 'Invalid email'});
        }

        if (user.status === 'inactive' ){
            return res.status(401).json({ message: 'Account not yet verified. Please check your email.' });
        }

        const stringToCompare = `${password}:${emailToLower}`;
        const isMatch = await bcrypt.compare(stringToCompare, user.password);

        if (!isMatch){
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            {
                userId : user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                balance: user.balance
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during account login'});
    }
};

exports.clearDatabase = async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ message: 'Database clearing is only allowed in development environment.' });
    }

    try {
        await User.deleteMany({});
        await VerificationToken.deleteMany({});

        console.log('Database cleared');

        res.status(200).json({ message : 'Database successfully cleared'});
    } catch (error){
        console.error('Database Clearing Error:', error);
        res.status(500).json({ message: 'Failed to clear the database.' });
    }
};