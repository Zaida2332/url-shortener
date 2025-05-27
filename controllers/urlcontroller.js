const validUrl = require('valid-url');
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');

const baseUrl = 'http://localhost:3000';

exports.shortenUrl = async (req, res) => {
const { longUrl } = req.body;

if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
}

try {
    let url = await Url.findOne({ longUrl });

    if (url) {
    return res.json({
        shortUrl: `${baseUrl}/${url.code}`,
        code: url.code,
        longUrl: url.longUrl,
        expiresAt:url.expiresAt
    });
    }

    const code = generateShortCode();
    const shortUrl = `${baseUrl}/${code}`;

    url = new Url({ code, longUrl,expiresAt:expiresAt ? new Date(expiresAt):null });
    await url.save();

    res.json({ shortUrl, code, longUrl });
} catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
};
}


exports.redirect = async (req, res) => {
try {
    const url = await Url.findOne({ code: req.params.code });

    if (url) {
        url.clicks ++;
        await url.save();
    return res.redirect(url.longUrl);
    } else {
return res.status(404).json('No URL found');
    }
} catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
}
};