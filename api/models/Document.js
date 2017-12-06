const mongoose = require('./init')

const Document = mongoose.model('Document', {
  title: String, // e.g. Sokovia Accords
  content: String // e.g. The Sokovia Accords. Approved by 117 countries, it states that the Avengers shall no longer be a private organization. Instead, they'll operate under the supervision of a United Nations panel, only when and if that panel deems it necessary.
})

module.exports = Document