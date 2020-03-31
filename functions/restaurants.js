const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '104.155.57.239',
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
      response.status(201).send(`Restaurant added with data: ${taid, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numrevta, images, types, schedule}`)
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

  module.exports = {
    createRestaurant,
    getRestaurants
  }