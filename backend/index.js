import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { default as connectDB } from './database/db.js';
import userRouter from './routes/UserRouter.js';
import workshopRouter from './routes/WorkShopRouter.js';
import transactionRouter from './routes/Transaction.js';
const app = express();
configDotenv();
const PORT = process.env.PORT || 5000;
connectDB()
const origins = [
    'http://localhost:3000',
    'https://mind-chain-dusky.vercel.app',
];
app.use(cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

app.use("/user", userRouter);
app.use("/workshop", workshopRouter);
app.use("/transaction", transactionRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




