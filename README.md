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

11. Create `routes\document.js` using boilerplate (or run `Skafold Document` with Skafold app)

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

14. 