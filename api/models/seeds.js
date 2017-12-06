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
