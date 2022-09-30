const jwt = require("jsonwebtoken") ;

const User = require("../models/useSchema") ;



const Authenticate = async(req, res) => {

    try{

        const token = JSON.parse(localStorage.getItem("token")) ;

        const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN) ;

        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token" : token })

        if(!rootUser){
            throw new Error("user not found")
        }

        req.token = token;
        req.rootUser = rootUser ;
        req.userId = rootUser._id ;

        next()
    }
    catch(e) {
        console.log(e)
    }



}

module.exports = Authenticate ;