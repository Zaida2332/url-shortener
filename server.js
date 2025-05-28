const express =require('express');
const mongoose =require('mongoose');
const urlRouter = require('./routes/uri');
const cors = require("cors"); // Delete this
const app =express();

app.use(express.json());
app.use(cors()) // Delete this
mongoose.connect('mongodb://localhost/urlshortener').then(() =>console.log('mongodb connected'));
app.use( '/', urlRouter);
const PORT = 8000;
app.listen(PORT,()=>console.log(`server running on port${PORT}`));

