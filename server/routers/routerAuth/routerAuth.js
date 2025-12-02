import Router from 'express';
import {tokenManager} from '../../middleware/auth/tokenManager.js';
import { getDb } from '../../database/db.js';
import bcrypt from 'bcrypt';

const routerAuth = Router();

routerAuth.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' }).appendHeader("Allow-Control-Allow-Origin", "*");
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
        return res.status(401).json({ error: 'Invalid email.' }).appendHeader("Allow-Control-Allow-Origin", "*");
    }
    const authVerify = await db.get('SELECT * FROM auth WHERE userId = ?', [user.id]);
    if(authVerify)
    {
        return res.status(409).json({ error: 'User already logged in.' }).appendHeader("Allow-Control-Allow-Origin", "*");
    }
    const match = await bcrypt.compare(password, user.password);
    

    if(match)
    {
        console.log(user.id);
        const token = tokenManager.generateToken(user.id);
        console.log(token);
        await db.run('INSERT INTO auth(userId, token) VALUES(?, ?)', [parseInt(user.id), token]);
        return res.status(200).json({ message: "Login avvenuto", token }).appendHeader("Allow-Control-Allow-Origin", "*");
    }
    return res.status(401).json({ error: 'Invalid password.' }).appendHeader("Allow-Control-Allow-Origin", "*");
});

routerAuth.get('/logout', async (req, res) => {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: 'Token is required.' });
    }
    const db = await getDb();
    const auth = await db.get('SELECT * FROM auth WHERE token = ?', [token]);
    if (!auth) {
        return res.status(401).json({ error: 'Invalid token.' });
    }

    await db.run('DELETE FROM auth WHERE token = ?', [token]);
    return res.status(200).json({ message: 'Logout successful.' });
});

export { routerAuth };