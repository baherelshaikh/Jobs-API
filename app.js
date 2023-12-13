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

// extra packages
app.use(express.json());
app.use(helmet())
app.use(cros())
app.use(xss())

//swagger
const swaggerUI = require('swagger-ui-express')
const YAMAL = require('yamljs')
const swaggerDocument = YAMAL.load('./swagerAndYamal.yaml')

app.get('/',(req,res)=>{
  res.send(`<h1>Jobs API</h1><a href="/api-docs" style="align-items: center; 
  background-image: linear-gradient(144deg,#AF40FF, #5B42F3 50%,#00DDEB);
  border: 0;border-radius: 8px;box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;box-sizing: border-box;
  color: #FFFFFF;display: flex;font-family: Phantomsans, sans-serif;
  font-size: 20px;justify-content: center;line-height: 1em;max-width: 100%;min-width: 140px;padding: 19px 24px;text-decoration: none;
  user-select: none;-webkit-user-select: none;touch-action: manipulation;white-space: nowrap;cursor: pointer;">Documentation</a>`)
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument))

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

