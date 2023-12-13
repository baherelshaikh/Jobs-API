const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required: [true,'Please provide name'],
        minlength: 5,
        maxlength: 50
    },
    email : {
        type : String,
        required: [true,'Please provide email'],
        minlength: 5,
        maxlength: 50,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide a valid email'],
        unique: true,
    },
    password : {
        type : String,
        required: [true,'Please provide password'],
        minlength: 8,
    },  
})

// mongoose midleware
userSchema.pre('save', async function () {

        // hashing password (we mustn't make password a string) << implementation using moongoose >>
        // number of rounds (random byts) "more byts more secure more processing power"
        const salt = await bcrypt.genSalt(10) 
        // hashing password
        this.password = await bcrypt.hash(this.password,salt)
})

// mongoose instance methods
    // making jwt using mongoose
userSchema.methods.createJWT = function() {
    return jwt.sign({userId: this._id, name: this.name},process.env.JWT_SECRET,{expiresIn: process.env.JWT_LIFETIME})
}
    //compare passwords "hashed passwords"
userSchema.methods.comparePassword = async function(canditatepassword){
    const isMatch = await bcrypt.compare(canditatepassword,this.password)
    return isMatch
}

module.exports = mongoose.model('User',userSchema)