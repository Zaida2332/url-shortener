const mongoose = require("mongoose");
const { type } = require("os");

const UrlSchema = new mongoose.Schema({
    code: String,
    longUrl: String,
    date: { type: Date, default: Date.now },
    clicks:{type:Number,default:0},
    expiresAt:{type:Date, default:null}
});

module.exports = mongoose.model("url", UrlSchema);