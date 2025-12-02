import { Router } from "express";
import { getDb } from "../../database/db.js";

const routerHoldings = Router();

routerHoldings.post('/add/:id', async (req, res) => {
    const { currencyID, quantity } = req.body;
    const userID = req.params.id;

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        logger.warn('Nessun header di autorizzazione presente');
        return res.status(401).json({ message: 'Autorizzazione mancante' });
    }
    const token = authHeader && authHeader.split(" ")[1];

    let db = await getDb();
    const auth = await db.get('SELECT * FROM auth WHERE token = ?', [token]);
    if (!auth) {
        return res.status(403).json({ message: 'Token non valido' });
    }
    if (parseInt(userID) !== auth.userId) {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
    }

    try {
        const existingHolding = await db.get(
            'SELECT * FROM currencyHold WHERE userId = ? AND currency = ?',
            [userID, currencyID]
        );
        if (existingHolding) {
            return res.status(409).json({ message: 'La valuta è già presente nelle tuo patrimonio.' });
        }

        await db.run(
            'INSERT INTO currencyHold (userId, currency, quantity) VALUES (?, ?, ?)',
            [userID, currencyID, quantity]
        );
        return res.status(201).json({ message: 'Valuta aggiunta al patrimonio con successo.' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta della valuta al patrimonio:', error);
        return res.status(500).json({ message: 'Errore del server durante l\'aggiunta della valuta al patrimonio.' });
    }




});

routerHoldings.get('/:id', async (req, res) => {
    const userID = req.params.id;
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    let db = await getDb();
    const auth = await db.get('SELECT * FROM auth WHERE token = ?', [token]);
    if (!auth) {    
        return res.status(403).json({ message: 'Token non valido' });
    }
    if (parseInt(userID) !== auth.userId) {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
    try {
        const holdings = await db.all(
            'SELECT * FROM currencyHold WHERE userId = ?',
            [userID]
        );
        return res.status(200).json(holdings);
    } catch (error) {
        console.error('Errore durante il recupero del patrimonio:', error);
        return res.status(500).json({ message: 'Errore del server durante il recupero del patrimonio.' });
    }


});

routerHoldings.post('/update/:id', async (req, res) => {
    const { currencyID, quantity } = req.body;
    const userID = req.params.id;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    let db = await getDb();
    const auth = await db.get('SELECT * FROM auth WHERE token = ?', [token]);   
    if (!auth) {
        return res.status(403).json({ message: 'Token non valido' });
    }
    if (parseInt(userID) !== auth.userId) {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
    try {
        await db.run(
            'UPDATE currencyHold SET quantity = ? WHERE userId = ? AND currency = ?',
            [quantity, userID, currencyID]
        );
        return res.status(200).json({ message: 'Quantità aggiornata con successo.' });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della quantità:', error);
        return res.status(500).json({ message: 'Errore del server durante l\'aggiornamento della quantità.' });
    }
});

export { routerHoldings };