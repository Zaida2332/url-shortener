const {createClient} =require('redis');
const redisClient = createClient();
redisClient.on('error',(err) =>console.error('redis error:',err));
(async () =>{
    await redisClient.connect();
}) ();
module.exports = redisClient;