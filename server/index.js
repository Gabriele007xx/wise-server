import express from 'express';
import dotenv from 'dotenv';
import { routerUsers } from './routers/routerUsers/routerUsers.js';
import { initializeDatabase } from './database/dbInit.js';
import {routerAuth} from './routers/routerAuth/routerAuth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', routerUsers);
app.use('/api/auth', routerAuth);

//decommentare questa linea per inizializzare il db!
//await initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});