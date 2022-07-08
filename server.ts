import express, { Express, Request, Response } from 'express';
import { routes } from "./src/Routes/Routes"
import helmet from 'helmet';
import { useCors } from './src/middlewares/cors.middleware';
import dotenv from 'dotenv';
import { httpLogger } from './src/middlewares/logging.middleware';
import { checkDbConnection } from './src/middlewares/db.middleware';
import { initateDB } from './src/database/database';

const app: Express = express();
dotenv.config();
// const port = process.env.PORT;
const port = 8000

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(httpLogger);
app.use(helmet());
app.use(useCors);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

initateDB();
app.use(checkDbConnection)

app.use("/api", routes);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});