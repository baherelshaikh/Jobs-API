const {UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req,res,next)=>{
    // checking the header 
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')) 
        throw new UnauthenticatedError('Authentication invalid')

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
            // getting user using the model
        req.user = await User.findById(payload.userId).select('-password')

            // another way 
        // req.user = {userId:payload.userId, name:payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth