
const mongoose = require("mongoose") ;
const bcrypt = require("bcryptjs") ;
const jwt = require("jsonwebtoken") ;

const UserSchema = mongoose.Schema({
    name : {
        type : String ,
        require : true 
    },
    email : {
        type : String ,
        require : true 
    },
    phone : {
        type : Number ,
        require : true 
    },
    work : {
        type : String ,
        require : true 
    },
    password : {
        type : String ,
        require : true 
    }, 
    cpassword : {
        type : String ,
        require : true 
    },
    messages : [
        {
            name : {
                type : String ,
                require : true 
            },
            email : {
                type : String ,
                require : true 
            },
            phone : {
                type : Number ,
                require : true 
            },
            message : {
                type: String,
                require : true
            }
      }
    ],
    tokens : [
        {
            token : {
                type : String ,
                require : true 
            }
        }
    ]
})

UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12) ;
        this.cpassword = await bcrypt.hash(this.cpassword, 12) ;
    }
    next() ;
})

UserSchema.methods.generateAuthToken = async function() {
    try {
        let tokenCreate = jwt.sign({_id : this._id}, process.env.SECRET_TOKEN) ;
        this.tokens = this.tokens.concat({token : tokenCreate}) ;
        await this.save() ;
        return tokenCreate ;
        
    } catch (error) {
        console.log(error) ;
    }
} 

 UserSchema.methods.addMessage = async function(name, email, phone, message)  {
     try {

        this.messages = this.messages.concat({name:name, email:email, phone:phone, message:message })
        await this.save() ;
        return this.messages ;

        
     } catch (error) {
        console.log(error)
     }
 }

const User = mongoose.model("resister", UserSchema) ;

module.exports = User ;