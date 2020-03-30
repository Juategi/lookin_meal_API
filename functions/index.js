const functions = require('firebase-functions');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')


/*app.get('/prueba', (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
  })*/

app.get('/users', db.getUserById)
app.get('/allusers', db.getUsers)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)

exports.app = functions.https.onRequest(app);
