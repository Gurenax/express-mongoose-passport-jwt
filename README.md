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
  .connect('mongodb://localhost/storms', { useMongoClient: true })
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch(error => {
    //   If there was an error connecting to the database
    if (error) console.log('Error connecting to MongoDB database', error)
  })

module.exports = mongoose
```

8. 