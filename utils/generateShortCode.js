
const crypto =require('crypto');
function generateShortCode(){
    return crypto.randomBytes(3).toString('hex');

}
module.exports = generateShortCode;