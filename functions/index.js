const functions = require('firebase-functions');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dbu = require('./users')
const dbr = require('./restaurants')

app.get('/users', dbu.getUserById)
app.get('/allusers', dbu.getUsers)
app.get('/allrestaurants', dbr.getRestaurants)
app.post('/users', dbu.createUser)
app.post('/restaurants', dbr.createRestaurant)
app.put('/users', dbu.updateUser)

exports.app = functions.https.onRequest(app);
