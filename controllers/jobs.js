const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const createJob = async (req,res)=>{
    req.body.createdBy = req.user._id
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getAllJobs = async (req,res)=>{
    const jobs = await Job.find({createdBy: req.user._id})

    if (!jobs) throw new NotFoundError('No jobs with this id')
    res.status(StatusCodes.OK).json({jobs})
}

const getSingleJob = async (req,res)=>{
    // Get (_id) property from (user) object which is in (req) object and 
    // give it an alias of (userId)
    const {user:{_id:userId},params:{id:jobId}} = req 

    const job = await Job.findOne({_id:jobId,createdBy:userId})

    if(!job) throw new NotFoundError('No job with this id')
    res.status(StatusCodes.OK).json({job})
}


const updateJob = async (req,res)=>{
    const {
        body: {company, position},
        user:{_id:userId},
        params:{id:jobId} } = req 

        if(!company || !position) 
        throw new BadRequestError('Company & position fields cannot be empty')
    
    const job = await Job.findOneAndUpdate(
        {_id:jobId,createdBy:userId},
        req.body,
        {new:true, runValidators: true}) // testing ... !!!
        
    if(!job) throw new NotFoundError('No job with this id to be updated')

    res.status(StatusCodes.OK).json(job) 
}

const deleteJob = async (req,res)=>{
    const {
        user:{_id:userId},
        params:{id:jobId} } = req 
    
    const deletedJob = await Job.findOneAndDelete({_id:jobId,createdBy:userId})

    if(!deletedJob) 
        throw new NotFoundError('No job with this id to be deleted')

    res.status(StatusCodes.OK).json(deletedJob)
}


module.exports = {
    getAllJobs,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob
}