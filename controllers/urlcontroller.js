
const validUrl = require('valid-url');
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');
const BASE_URL = process.env.BASE_URL;

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
      return res.status(410).json({ error: 'URL expired' }); // 410 Gone
    }

    res.redirect(url.longUrl);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
 }
};