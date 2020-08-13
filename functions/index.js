// /cloudsql/lookinmeal-dcf41:europe-west1:lookinmeal/.s.PGSQL.5432
// 104.155.57.239
//const functions = require('firebase-functions');
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const cluster = require('cluster')
const bodyParser = require('body-parser')

const dbu = require('./users')
const dbr = require('./restaurants')
const dbs = require('./search')
const port = 4000
const cCPUs   = require('os').cpus().length

if( cluster.isMaster ) {
  // Create a worker for each CPU
  for( var i = 0; i < cCPUs; i++ ) {
    cluster.fork();
  }
  cluster.on( 'online', function( worker ) {
    console.log( 'Worker ' + worker.process.pid + ' is online.' );
  });
  cluster.on( 'exit', function( worker, code, signal ) {
    console.log( 'worker ' + worker.process.pid + ' died.' );
    cluster.fork();
  });
}
else {
  const app = express()
  app.use(compression())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(
  bodyParser.urlencoded({
      extended: true,
    })
  )

  app.get('/users', dbu.getUserById)
  app.get('/allusers', dbu.getUsers)
  app.get('/userfavs', dbu.getUserFavorites)
  app.get('/allrestaurants', dbr.getRestaurants)
  app.get('/sections', dbr.getSections)
  app.get('/menus', dbr.getMenu)
  app.get('/rating', dbu.getRating)
  app.get('/allrating', dbu.getAllRatings)
  app.get('/restaurants', dbr.getRestaurantsFromDistance)
  app.get('/search', dbs.queryRestaurants)
  app.get('/searchentry', dbs.queryEntries)
  app.get('/square', dbr.getRestaurantsFromSquare)
  app.get('/daily', dbr.getDailyMenu)
  app.post('/users', dbu.createUser)
  app.post('/userfavs', dbu.addToUserFavorites)
  app.post('/restaurants', dbr.createRestaurant)
  app.post('/menus', dbr.addMenuEntry)
  app.post('/sections', dbr.addSection)
  app.post('/rating', dbu.addRate)
  app.put('/users', dbu.updateUser)
  app.put('/menus', dbr.updateMenuEntry)
  app.put('/sections', dbr.updateSections)
  app.put('/restaurantimages', dbr.updateImages)
  app.put('/restaurant', dbr.updateRestaurantData)
  app.put('/daily', dbr.updateDailyMenu)
  app.delete('/userfavs', dbu.deleteFromUserFavorites)
  app.delete('/rating', dbu.deleteRating)
  app.delete('/menus', dbr.deleteMenuEntry)

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })

}



//exports.app = functions.https.onRequest(app);
