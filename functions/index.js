// /cloudsql/lookinmeal-dcf41:europe-west1:lookinmeal/.s.PGSQL.5432
// 104.155.57.239
const functions = require('firebase-functions');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dbu = require('./users')
const dbr = require('./restaurants')

app.get('/users', dbu.getUserById)
app.get('/allusers', dbu.getUsers)
app.get('/userfavs', dbu.getUserFavorites)
app.get('/allrestaurants', dbr.getRestaurants)
app.get('/menus', dbr.getMenu)
app.post('/users', dbu.createUser)
app.post('/userfavs', dbu.addToUserFavorites)
app.post('/restaurants', dbr.createRestaurant)
app.post('/menus', dbr.addMenuEntry)
app.put('/users', dbu.updateUser)
app.delete('/userfavs', dbu.deleteFromUserFavorites)

exports.app = functions.https.onRequest(app);
