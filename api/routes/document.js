const express = require('express')
const Document = require('../models/Document')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

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

// GET - Read an individual document document
router.get('/documents/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  // Ask the model for the document with this id
  Document.findById(id)
    // Once it has loaded this document
    .then(document => {
      // If an document was found
      if(document) {
        res.json(document)
      }
      // If no document was foound
      else {
        res.status(404).json({ error: `Document not found with id: ${id}` })
      }
    })
    .catch(error => {
      // If there was an error, most likely with the format of the id
      res.status(400).json({ error: error.message })
    })
})

// POST - Create a new document document
router.post('/documents', authMiddleware.requireJWT, (req, res) => {
  const attributes = req.body
  Document.create(attributes)
    .then(document => {
      res.status(201).json(document)
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// PATCH - Update a document document
router.patch('/documents/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  const attributes = req.body
  Document.findByIdAndUpdate(id, attributes, { new: true, runValidators: true })
    .then(document => {
      // If an document was found and updated
      if(document) {
        res.status(200).json(document)
      }
      // If no document was found
      else {
        res.status(404).json({ error: `Document not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// DELETE - Destroy a document document
router.delete('/documents/:id', authMiddleware.requireJWT, (req, res) => {
  const id = req.params.id
  Document.findByIdAndRemove(id)
    .then(document => {
      // If an document was found and deleted
      if(document) {
        res.status(200).json(document)
      }
      // If no document was found
      else {
        res.status(404).json({ error: `Document not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

module.exports = router