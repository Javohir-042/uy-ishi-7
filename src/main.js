import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import router from './routes/index.routes.js';
import cookieParser from 'cookie-parser';
import { golobalError } from './error/golobalError.js';


const app = express();
const PORT = config.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

await connectDB();

app.use('/api', router);
app.use(golobalError);

app.listen(PORT, ()=> console.log('Server running onn port', PORT));