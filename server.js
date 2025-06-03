const express =require('express');
const mongoose =require('mongoose');
const urlRouter = require('./routes/uri');
const cors = require("cors"); // 
const app =express();
const dotenv = require("dotenv")
dotenv.config()
console.log(process.env.BASE_URL)

app.use(express.json());
app.use(cors()) // 
mongoose.connect('mongodb://localhost/urlshortener').then(() =>console.log('mongodb connected'));
app.use( '/', urlRouter);
const PORT = 8000;
app.listen(PORT,()=>console.log(`server running on port${PORT}`));

