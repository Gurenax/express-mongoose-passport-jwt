# Express Mongoose Passport JWT
1. Initialise repository  
`yarn init`

2. Initialise repository with express and body-parser  
`yarn add express body-parser`

3. Add nodemon module  
`yarn add nodemon --dev`

4. Create server.js
```javascript
const express = require('express')
const bodyParser = require('body-parser')

const server = express()

// Middleware Plugins
server.use(bodyParser.json())

// Routes
server.use('/', [
  // require('./routes/whatever')
])

// Start the server
server.listen(7000, error => {
  if (error) console.error('Error starting', error)
  else console.log('Started at http://localhost:7000')
})
```

5. Add scripts in `package.json`
```javascript
"scripts": {
  "dev": "nodemon server.js",
  "seed": "node models/seeds.js",
  "drop": "node models/drop.js",
  "reset": "npm run drop && npm run seed"
}
```

6. Add mongoose module  
`yarn add mongoose`

7. Add `models\init.js`
```javascript
const mongoose = require('mongoose')

// Use the Promise functionality built into Node.js
mongoose.Promise = global.Promise

// Connect to our local database
mongoose
  .connect('mongodb://localhost/secret-documents', { useMongoClient: true })
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch(error => {
    //   If there was an error connecting to the database
    if (error) console.log('Error connecting to MongoDB database', error)
  })

module.exports = mongoose
```

8. Create `models\Document.js`
```javascript
const mongoose = require('./init')

const Document = mongoose.model('Document', {
  title: String, // e.g. Sokovia Accords
  content: String // e.g. The Sokovia Accords. Approved by 117 countries, it states that the Avengers shall no longer be a private organization. Instead, they'll operate under the supervision of a United Nations panel, only when and if that panel deems it necessary.
})

module.exports = Document
```

9. Create `models\seeds.js`
```javascript
const Document = require('./Document')

Document.create([
  {
    title: 'Sokovia Accords',
    content:
      "The Sokovia Accords. Approved by 117 countries, it states that the Avengers shall no longer be a private organization. Instead, they'll operate under the supervision of a United Nations panel, only when and if that panel deems it necessary."
  },
  {
    title: 'Impact on S.H.I.E.L.D.',
    content:
      'I\'m here because the President sent me. The Sokovia Accords are the law of the land now and he\'s concerned you might have some undocumented "assets" working for you.'
  },
  {
    title: 'Regulations',
    content:
      'Any enhanced individuals who agree to sign must register with the United Nations and provide biometric data such as fingerprints and DNA samples.'
  }
])
  .then(documents => {
    console.log('Created documents', documents)
    process.exit()
  })
  .catch(error => {
    console.error('Error creating documents', error)
  })
```

10. Create `models\drop.js`
```javascript
const Document = require('./Document')

Document.deleteMany().then(() => {
  console.log('Deleted documents')
  process.exit()
})
```

11. Create `routes\document.js` using boilerplate  
(or run `Skafold Document` with Skafold app)

12. Add route for document in server.js
```javascript
// Routes
server.use('/', [
  require('./routes/document')
])
```

13. Create `check\1.http` and test the app
```
GET http://localhost:7000/document
```

14. Add passport middleware  
`yarn add passport passport-local passport-local-mongoose`

15. Add passport-jwt middleware  
`yarn add passport-jwt`

16. Add User model with Passport plugin (`models\User.js`)
```javascript
const mongoose = require('./init')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
})

// Add passport middleware to User Schema
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // Use email, not the default 'username'
  usernameLowerCase: true, // Ensure that all emails are lowercase
  session: false // Disable sessions as we'll use JWTs
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

17. Add helper for middleware `middleware\auth.js`  
```javascript
const passport = require('passport')
const JWT = require('jsonwebtoken')
const PassportJwt = require('passport-jwt')
const User = require('../models/User')

// These should be in .env
// secret (generated using `openssl rand -base64 48` from console)
const jwtSecret =
  'QOOC3nUVl9yTZiH2F0VYjOJhwm2ZkyBjWK7Mzo4bH54cNBBUQmp262S0Tx1eBBTT'
const jwtAlgorithm = 'HS256'
const jwtExpiresIn = '7 days'

passport.use(User.createStrategy())

function register(req, res, next) {
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  })
  // Create the user with the specified password
  User.register(user, req.body.password, (error, user) => {
    if (error) {
      // Our register middleware failed
      next(error)
      return
    }
    // Store user so we can access it in our handler
    req.user = user
    // Success!
    next()
  })
}

passport.use(
  new PassportJwt.Strategy(
    // Options
    {
      // Where will the JWT be passed in the HTTP request?
      // e.g. Authorization: Bearer xxxxxxxxxx
      jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      // What is the secret
      secretOrKey: jwtSecret,
      // What algorithm(s) were used to sign it?
      algorithms: [jwtAlgorithm]
    },
    // When we have a verified token
    (payload, done) => {
      // Find the real user from our database using the `id` in the JWT
      User.findById(payload.sub)
        .then(user => {
          // If user was found with this id
          if (user) {
            done(null, user)
          } else {
            // If not user was found
            done(null, false)
          }
        })
        .catch(error => {
          // If there was failure
          done(error, false)
        })
    }
  )
)

function signJWTForUser(req, res) {
  // Get the user (either just signed in or signed up)
  const user = req.user
  // Create a signed token
  const token = JWT.sign(
    // payload
    {
      email: user.email
    },
    // secret
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn,
      subject: user._id.toString()
    }
  )
  // Send the token
  res.json({ token })
}

module.exports = {
  initialize: passport.initialize(),
  register,
  signIn: passport.authenticate('local', { session: false }),
  requireJWT: passport.authenticate('jwt', { session: false }),
  signJWTForUser
}
```

18. Add route for auth (`routes\auth.js`)
```javascript
const express = require('express')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Register
router.post(
  '/auth/register',
  // middleware that handles the registration process
  authMiddleware.register,
  // json handler
  authMiddleware.signJWTForUser
)

// Sign in
router.post(
  '/auth',
  // middleware that handles the sign in process
  authMiddleware.signIn,
  // json handler
  authMiddleware.signJWTForUser
)

module.exports = router
```

19. Add route for auth in server.js
```javascript
// Routes
server.use('/', [
  require('./routes/auth'),
  require('./routes/document')
])
```

20. Update document route to use JWT middleware
```javascript
const authMiddleware = require('../middleware/auth')
```

21. Add `authMiddleware.requireJWT` as 2nd argument to every route (see example below)
```javascript
// GET - Read all document
router.get('/documents', authMiddleware.requireJWT, (req, res) => {
  Document.find()
  // Once it has loaded these documents
  .then(documents => {
    // Send them back as the response
    res.json(documents)
  })
  .catch(error => {
    res.status(400).json({ error: error.message })
  })
})
```