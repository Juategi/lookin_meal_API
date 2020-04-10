const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '/cloudsql/lookinmeal-dcf41:europe-west1:lookinmeal',
  database: 'postgres',
  password: 'qHeNfB1d5jNOrf8o',
  port: 5432,
})


const createRestaurant = (request, response) => {
    const {taid, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule, sections, currency} = request.body
    pool.query('INSERT INTO restaurant (ta_id, name, phone, website, webUrl, address, email, city, country, latitude, longitude, rating, numrevta, images, types, schedule, sections, currency) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
     [taid, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule, sections, currency], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Restaurant added with name: ${name}`)
    })
  }

  const getRestaurants = (request, response) => {
    pool.query('SELECT * FROM restaurant', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const addMenuEntry = (request, response) => {
    const {restaurant_id, name, section, rating, numReviews, price} = request.body
    pool.query('INSERT INTO menuentry (entry_id, restaurant_id, name, section, rating, numReviews, price) VALUES ($1, $2, $3, $4, $5, $6)',
     [restaurant_id, name, section, rating, numReviews, price], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Menu entry added with name: ${name}`)
    })
  }

  const getMenu = (request, response) => {
    const {restaurant_id} = request.headers;

    pool.query(
      `SELECT * FROM menuentry WHERE restaurant_id = $1 `,[id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  }

  module.exports = {
    createRestaurant,
    getRestaurants,
    addMenuEntry,
    getMenu
  }

