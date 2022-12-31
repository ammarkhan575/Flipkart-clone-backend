import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import bodyParser from 'body-parser'

import Stripe from 'stripe';

import Connection from './database/db.js';
import DefaultData from './default.js'
import Router from './routes/route.js'

const app = express();
export const stripe = Stripe(process.env.STRIPE_KEY);

app.use(cors());
app.use(bodyParser.json({extended:true})); 
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',Router);

const PORT = process.env.PORT || 8000

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const URL = process.env.MONGODB_URI || `mongodb+srv://${USERNAME}:${PASSWORD}@ecommerce.ow4s0hg.mongodb.net/?retryWrites=true&w=majority`;

Connection(URL);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

DefaultData();
export const CLIENT_URL = process.env.CLIENT_URL