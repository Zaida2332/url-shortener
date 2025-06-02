
const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    code: {type:String,unique:true},
    longUrl: String,
    date: { type: Date, default: Date.now },
    expiryData:Date,

});

module.exports = mongoose.model('url', UrlSchema);