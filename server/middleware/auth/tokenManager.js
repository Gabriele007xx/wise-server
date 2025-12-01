import jwt from 'jsonwebtoken';

class TokenManager {

    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    }

    validateToken(token) {
        //TO DO
        jwt.verify(token, process.env.TOKEN_SECRET);
    }
}

export const tokenManager = new TokenManager();