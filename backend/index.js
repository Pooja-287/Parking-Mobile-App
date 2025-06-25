// index.js
import express from 'express';
import APIRouter from './routes/APIRouter.js';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;


// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', APIRouter);

// Database Connection
const ConnectDB = async () =>{
  try{ 
    const connect =  await mongoose.connect(process.env.MONGODB_URI)
    console.log("success");
    
}
  catch(error) {
    console.log('Error connecting to database');
    console.log(error);
    process.exit(1)
  }
}
ConnectDB()
app.listen(PORT, ()=>{
    console.log("running on ",PORT)

})
