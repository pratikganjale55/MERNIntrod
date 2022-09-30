const mongoose = require("mongoose") ;
const db = process.env.DATABASE ;

const connection = mongoose.connect(db).then(() => {

    console.log("db connection success")
}).catch((e) => console.log("db srror"))


module.exports = connection ;