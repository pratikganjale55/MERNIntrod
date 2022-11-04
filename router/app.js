const dotenv = require("dotenv") ;

const express = require("express") ;
const cors = require("cors") ;
const app = express() ;
app.use(express.json())


dotenv.config({path : "./config.env"}) ;
const connection = require("./db/dbconnection") ;
const User = require("./models/useSchema") ;
const PORT = process.env.PORT ;


app.use(cors()) ;
app.use(require("./router/auth"))

app.listen(PORT, ()=> {
    console.log(`server start ${PORT}`)
})

