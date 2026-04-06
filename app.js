import express from 'express';
const app=express();
import {PORT} from './config/env.js';
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import transactionRouter from './routes/transactions.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use(errorMiddleware);
app.get('/',(req,res)=>
{
  res.send('Welcome to Fin_tech Dashboard');
});
app.listen(PORT,async()=>
{
  console.log(`Server started listening on port: ${PORT}`);

  await connectToDatabase();
})
export default app;