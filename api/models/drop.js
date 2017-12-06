const Document = require('./Document')

Document.deleteMany().then(() => {
  console.log('Deleted documents')
  process.exit()
})
