const shortid =require('shortid');
module.exports = () =>shortid.generate();
function generateShortCode(length=6){
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code ='';
    for (let i=0; i < chars.length ; i++ ){
        code += chars[Math.floor(Math.random()*chars.length)];
        
    }
    return code;
}
module.exports = generateShortCode;