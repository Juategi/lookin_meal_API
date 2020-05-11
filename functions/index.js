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
app.get('/sections', dbr.getSections)
app.get('/menus', dbr.getMenu)
app.get('/rating', dbu.getRating)
app.get('/allrating', dbu.getAllRatings)
app.post('/users', dbu.createUser)
app.post('/userfavs', dbu.addToUserFavorites)
app.post('/restaurants', dbr.createRestaurant)
app.post('/menus', dbr.addMenuEntry)
app.post('/sections', dbr.addSection)
app.post('/rating', dbu.addRate)
app.put('/users', dbu.updateUser)
app.put('/menus', dbr.updateMenuEntry)
app.put('/sections', dbr.updateSections)
app.delete('/userfavs', dbu.deleteFromUserFavorites)
app.delete('/rating', dbu.deleteRating)
app.delete('/menus', dbr.deleteMenuEntry)

exports.app = functions.https.onRequest(app);
