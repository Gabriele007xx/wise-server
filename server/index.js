import express from 'express';
import dotenv from 'dotenv';
import { routerUsers } from './routers/routerUsers/routerUsers.js';
import { initializeDatabase } from './database/dbInit.js';
import {routerAuth} from './routers/routerAuth/routerAuth.js';
import bodyParser from 'body-parser';
import {routerHoldings} from './routers/routerHoldings/routerHoldings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/users', routerUsers);
app.use('/api/auth', routerAuth);
app.use('/api/holdings', routerHoldings);

//decommentare questa linea per inizializzare il db!
//await initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});