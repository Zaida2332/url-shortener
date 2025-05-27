const express =require("express");
const router =express.Router();
const {shortenUrl,redirect} =require('../controllers/urlcontroller');
router.post('/api/shorten',shortenUrl);
router.get('/:code',redirect);
module.exports =router;

