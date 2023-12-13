#### Setup

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors // if user doesn't provide any of the value
- Duplicate (Email) // when email is unique
- Cast Error        // when Id doesn't match any one in db

#### Security

- helmet // this package sets various http headers to              prevent numerous possible attacks 

- cors (cross-origin resource sharing) // ensures that our api is accessible from different domain (allow or restrict requested resources on a web server depending on where the http request was initiated), we can make our api accessible to the public using it

- xss-clean // sanitizes the user input in req.body, req.query and req.params and as a result protects us from cross-site scripting attacks where the attacker tries to inject some malicious code

- express-rate-limit // limit the amount of requests the user can make using this package

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```
