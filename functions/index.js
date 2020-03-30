const functions = require('firebase-functions');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()



app.get('/prueba', (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
  })


 exports.app = functions.https.onRequest(app);
