require('dotenv').config();
require('express-async-errors');

//security packages
const helmet = require('helmet')
const xss = require('xss-clean')
const cros = require('cors')
const ratelimiter = require('express-rate-limit')

const userAuthentication = require('./middleware/authentication')
const express = require('express');
const app = express();

// connectdb
const connectdb = require('./db/connect')

//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1) //(Heroku, Bluemix, AWS ELB, Ngins)
app.use(ratelimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 request per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cros())
app.use(xss())

app.get('/',(req,res)=>{
  res.send('Jobs api')
})

// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',userAuthentication,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
