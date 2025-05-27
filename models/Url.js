const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    code: String,
    longUrl: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("url", UrlSchema);