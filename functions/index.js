// /cloudsql/lookinmeal-dcf41:europe-west1:lookinmeal/.s.PGSQL.5432
// 104.155.57.239
//const functions = require('firebase-functions');
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const cluster = require('cluster')
const bodyParser = require('body-parser')
const cors = require('cors');

const dbu = require('./users')
const dbr = require('./restaurants')
const dbs = require('./search')
const dbrt = require('./reservations')
const dbc = require('./codes')
const dbrq = require('./requests')

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
  app.use(cors());
  app.use(compression())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(
  bodyParser.urlencoded({
      extended: true,
    })
  )

  app.get('/users', dbu.getUserById)
  app.get('/username', dbu.getUserByUsername)
  app.get('/allusers', dbu.getUsers)
  app.get('/userfavs', dbu.getUserFavorites)
  app.get('/restbyid', dbr.getRestaurantsById)
  app.get('/sections', dbr.getSections)
  app.get('/menus', dbr.getMenu)
  app.get('/rating', dbu.getRating)
  app.get('/allrating', dbu.getAllRatings)
  app.get('/restaurants', dbr.getRestaurantsFromDistance)
  app.get('/search', dbs.queryRestaurants)
  app.get('/searchentry', dbs.queryEntries)
  app.get('/square', dbr.getRestaurantsFromSquare)
  app.get('/daily', dbr.getDailyMenu)
  app.get('/checkuser', dbu.checkUsername)
  app.get('/checkmail', dbu.checkMail)
  app.get('/recently', dbr.getRecently)
  app.get('/ratingshistory', dbu.getRatingsHistory)
  app.get('/popular', dbr.getPopular)
  app.get('/lists', dbu.getLists)
  app.get('/entriesbyid', dbr.getEntriesByIds)
  app.get('/comments', dbr.getEntryRatings)
  app.post('/users', dbu.createUser)
  app.post('/userfavs', dbu.addToUserFavorites)
  app.post('/restaurants', dbr.createRestaurant)
  app.post('/menus', dbr.addMenuEntry)
  app.post('/sections', dbr.addSection)
  app.post('/rating', dbu.addRate)
  app.post('/lists', dbu.createList)
  app.put('/users', dbu.updateUser)
  app.put('/menus', dbr.updateMenuEntry)
  app.put('/sections', dbr.updateSections)
  app.put('/restaurantimages', dbr.updateImages)
  app.put('/restaurant', dbr.updateRestaurantData)
  app.put('/daily', dbr.updateDailyMenu)
  app.put('/recently', dbr.updateRecently)
  app.put('/lists', dbu.updateList)
  app.put('/restaurantmeal', dbr.updateMealTime)
  app.delete('/userfavs', dbu.deleteFromUserFavorites)
  app.delete('/rating', dbu.deleteRating)
  app.delete('/menus', dbr.deleteMenuEntry)
  app.delete('/lists', dbu.deleteList)

  app.get('/tables', dbrt.getTables)
  app.get('/reservationsday', dbrt.getReservationsDay)
  app.get('/reservationsuser', dbrt.getReservationsUser)
  app.post('/table', dbrt.createTable)
  app.post('/reservation', dbrt.createReservation)
  app.put('/table', dbrt.updateTable)
  app.delete('/table', dbrt.deleteTable)
  app.delete('/reservation', dbrt.deleteReservation)

  app.get('/codes', dbc.getCodes)
  app.post('/codes', dbc.createCode)
  app.delete('/codes', dbc.deleteCode)

  app.get('/ownerres', dbu.getRestaurantOwners)
  app.post('/owner', dbu.createOwner)
  app.delete('/owner', dbu.deleteOwner)
  app.put('/owner', dbu.updateOwner)

  app.get('/followers', dbu.getFollowers)
  app.get('/following', dbu.getFollowing)
  app.get('/numfollowers', dbu.getNumFollowers)
  app.get('/numfollowing', dbu.getNumFollowing)
  app.post('/follower', dbu.addFollower)
  app.delete('/follower', dbu.deleteFollower)

  app.get('/owned', dbr.getOwned)

  app.post('/emailsend', dbrq.sendConfirmationCode)
  app.put('/emailresend', dbrq.reSendConfirmationCode)
  app.post('/confirmcodes', dbrq.confirmCodes)
  app.post('/request', dbrq.createRequest)
  app.post('/requestrestaurant', dbrq.createRestaurantRequest)

  app.post('/ticket', dbu.createTicket)

  app.get('/topentry', dbr.getTopEntries)
  app.get('/toprestaurant', dbr.getTopRestaurants)

  app.get('/excluded', dbrt.getExcluded)
  app.delete('/excluded', dbrt.deleteExcluded)
  app.post('/excluded', dbrt.addExcluded)

  app.get('/notifications', dbu.getNotifications)
  app.delete('/notifications', dbu.deleteNotification)
  app.post('/notifications', dbu.addNotification)

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })

}



//exports.app = functions.https.onRequest(app);
