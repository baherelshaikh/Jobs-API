const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {UnauthenticatedError, BadRequestError} = require('../errors')
// const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')

const register = async (req,res)=>{

    // // hashing password (we mustn't make password a string) << implementation in controller >>
    //     // number of rounds (random byts) "more byts more secure more processing power"
    //     const salt = await bcrypt.genSalt(10) 
    //     // hashing password
    //     const hashedPassword = await bcrypt.hash(password,salt)

    // const temp = {name, email, password:hashedPassword}

    const user = await User.create({...req.body})
    // //making jwt in controller 
    // const token = jwt.sign({userId:user._id, name:user.name},'jwtsecret',{expiresIn:"30d"})

    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({token})

}

const login = async (req,res)=>{

    const {email,password} = req.body
    if(!email || !password) throw new BadRequestError('Please provide valid info')

    const user = await User.findOne({email})

    if (!user) throw new UnauthenticatedError('Invalid Credentials')

    // compare passwords 
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials')
    
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name: user.name}, token})
}
module.exports = {
    login,
    register
}