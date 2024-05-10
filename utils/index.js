import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const token = jwt.sign({
        userId: user._id,
        username: user.username,
        emailId: user.emailId
    }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
    return token;
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};


export { generateToken, verifyToken }