import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './app/routes/authRoutes.js';

dotenv.config(

);
const app=express();
app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Hello World');
});



// app.use('/api/tasks',authRoutes);
app.use('/api/auth',authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
