import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//this is for handeling the token , a token is send when user login and expires in 1h, that token is used to acces the user info for security issues 

dotenv.config();
const verify_token = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Get token from headers

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = decoded;  // Attach user info to the request
        next(); 
    });
};

export default verify_token;
