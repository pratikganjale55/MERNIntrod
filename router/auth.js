const express = require("express") ;
const bcrypt = require("bcryptjs") ;
const jwt = require("jsonwebtoken") ;
const router = express.Router() ;

const authenticate =  require("../middleware/Authentic") ;
const User = require("../models/useSchema")
router.get("/", (req, res) => {
    
    res.send("home page")
})


router.post("/register",async(req, res) => {
    const {name , email, phone, work, password, cpassword} = req.body ;
   
   if(!name|| !email || !phone || !work || !password || !cpassword){
       return res.status(422).send({massage : "please filled fiels property"})
   }
  
   //check email is present or not
  await User.findOne({email : email})
   .then((userExit) => {
    
            if(userExit){
                res.status(422).json({massage : "Email already Exist"}) ;
            }
            // password and cpassword are not same
            else if(password !== cpassword){
                 res.status(422).send({massage : "password not same"})
            }
            else {
               
                //post data to database
             const user =new User({name , email, phone, work, password, cpassword}) ;

                user.save().then(() => {
                    res.status(201).send({massage : "Resister successful"})
                }).catch((err) => res.status(500).send({massage : "Failed to resister"})) 
       }
   }) .catch((e) => console.log(e))

   

}) ;

//Login //
router.post("/login", async(req, res) => {

try {
        const {email, password} = req.body ;
        console.log(email, password)

        if(!email || !password){
            res.status(400).send({massage : "please fill credentials"})
        }

    const userDetails = await User.findOne({email : email})  ;
        //   userData from database

    if(userDetails){

        // compare current pass and resister pass
          const passMatch = await bcrypt.compare(password, userDetails.password) ;
          // get token //
          let token = await userDetails.generateAuthToken() ;
        //   console.log(token) ;
         let _id = userDetails._id
        res.cookie("jwttoken", token ,{
            expires : new Date(Date.now() + 25892000000) ,
             httpOnly : true 
        })
          if(!passMatch){
              res.send({massage  : "wrong Credientals"})
          }else {
                res.status(400).send({massage : "Login Succesful", token, id: _id }) ;
          }

    }else {
        res.status(400).send({massage : "Invalid Credientals"})
    }
    
}
catch(e){
    console.log(e)
}
})


router.get("/about/:userId", async(req, res) => {
    
    const userId = req.params.userId ;
    // console.log(JSON.stringify(userId))
    const data = await User.findOne({_id : userId}) ;
    res.send(data)
   
})

router.post("/contact", async(req, res) => {
      const {name, email, phone, message, _id} = req.body ;
      console.log(_id)
    if(!name || !email || !phone || !message || !_id) {
        res.send({massage : "Fill Contact Information"})
    }

    const userContactData =await User.findOne({_id : _id}) ;

    if(userContactData) {
        const userMessage = await userContactData.addMessage(name, email, phone, message) ;
        // console.log(userMessage)
        await userContactData.save() ;

        res.status(200).send({message : "Message send to server"})
    }

})


module.exports = router ;
