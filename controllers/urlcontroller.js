const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');
const dotenv = require("dotenv");
const baseUrl = process.env.BASE_URL;

const EXPIRY_DAYS = 7;

exports.shortenUrl = async (req, res) => {
const { longUrl } = req.body;
if (!longUrl) return res.status(400).json({ error: 'Long URL is required' });

try {
    const existing = await Url.findOne({ longUrl });

    if (existing && (!existing.expiryDate || existing.expiryDate > new Date())) {
    
    return res.json({
        shortUrl: `${baseUrl}/${existing.code}`,
        code: existing.code,
        longUrl: existing.longUrl
    });
    }


    let code;
    let isUnique = false;

    while (!isUnique) {
    code = generateShortCode();
    const exists = await Url.findOne({ code });
    if (!exists) isUnique = true;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);

    const newUrl = new Url({
    code,
    longUrl,
    expiryDate
    });

    await newUrl.save();

    res.json({
    shortUrl: `${baseUrl}/${code}`,
    code,
    longUrl
    });

} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
}
};

exports.redirect = async (req, res) => {
const code = req.params.code;

try {
    const url = await Url.findOne({ code });

    if (!url) return res.status(404).json({ error: 'URL not found' });

    
    if (url.expiryDate && url.expiryDate < new Date()) {
    return res.status(410).json({ error: 'URL has expired' }); 
    }

    return res.redirect(302, url.longUrl);

} catch (error) {
    res.status(500).json({ error: 'Server error' });
}}