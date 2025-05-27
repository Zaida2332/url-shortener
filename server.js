const express =require('express');
const mongoose =require('mongoose');
const urlRouter = require('./routes/uri');
const app =express();
app.use(express.json());
mongoose.connect('mongodb://localhost/urlshortener').then(() =>console.log('mongodb connected'));
app.use( '/', urlRouter);
const PORT = 8000;
app.listen(PORT,()=>console.log(`server running on port${PORT}`));

