/*
* Author: digitkhrisnaa
*/

//Define constant variable here
module.exports = {
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/tinder_clone', //Write name of database
    port: process.env.port || 8080, //Port
    secret: 'Insert with your custom secret', //Secret for JWT
    server_key_fcm: 'Insert with your server key token', //Get your server key from firebase console
}