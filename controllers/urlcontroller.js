/*
const validUrl = require('valid-url');
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');

const generateUniqueCode = async () => {
let code;
let existing;
do {
    code = generateShortCode();
    existing = await Url.findOne({ code });
} while (existing);
return code;
};

exports.shortenUrl = async (req, res) => {
const { longUrl } = req.body;
const expireAfterDays = 30; 
const BASE_URL = process.env.BASE_URL;


if (!validUrl.isUri(longUrl)) return res.status(400).json({ error: 'Invalid URL' });

try {
    const now = new Date();
    const existing = await Url.findOne({
    longUrl,
    $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: now } }
    ]
    });

    if (existing) {
    return res.json({
        shortUrl: `${BASE_URL}/${existing.code}`,
        code: existing.code,
        longUrl: existing.longUrl
    });
    }

    const code = await generateUniqueCode();
    const expiryDate = new Date(now.getTime() + expireAfterDays * 24 * 60 * 60 * 1000);

    const newUrl = new Url({ longUrl, code, expiryDate }); 
    await newUrl.save();

    res.json({
    shortUrl:` ${BASE_URL}/${code}`,
    code,
    longUrl
    });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
};

exports.redirectUrl = async (req, res) => {
const { code } = req.params;

try {
    const url = await Url.findOne({ code });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    const now = new Date();
    if (url.expiryDate && url.expiryDate < now) {
    return res.status(410).json({ error: 'URL expired' });  
    }

    res.redirect(url.longUrl);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
 }
};*/
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');
const redisClient = require('../utils/redisClient');

exports.shortenUrl = async (req, res) => {
const { longUrl, expiryDays = 7 } = req.body;

if (!longUrl) return res.status(400).json({ error: 'URL is required' });

const code = generateShortCode();
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + expiryDays);


const existing = await Url.findOne({ longUrl });

if (existing && (!existing.expiryDate || existing.expiryDate > new Date())) {
    await redisClient.set(code, longUrl);
    return res.json({
    shortUrl:` http://localhost:8000/${existing.code}`,
    code: existing.code,
    longUrl: existing.longUrl
    });
}

const url = await Url.create({ code, longUrl, expiryDate });

await redisClient.set(code, longUrl);

res.json({
    shortUrl:` http://localhost:8000/${code}`,
    code,
    longUrl
});
};


exports.redirectUrl = async (req, res) => {
const { code } = req.params;

const cached = await redisClient.get(code);
if (cached) return res.redirect(cached);


const url = await Url.findOne({ code });

if (!url) return res.status(404).json({ error: 'URL not found' });

if (url.expiryDate && url.expiryDate < new Date()) {
    return res.status(410).json({ error: 'URL expired' });
}

await redisClient.set(code, url.longUrl);

res.redirect(url.longUrl);
};