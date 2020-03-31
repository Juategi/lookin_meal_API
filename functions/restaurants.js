const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '104.155.57.239',
  database: 'postgres',
  password: 'qHeNfB1d5jNOrf8o',
  port: 5432,
})


const createRestaurant = (request, response) => {
    const {id, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numberViews, images, types, schedule} = request.body
    pool.query('INSERT INTO restaurant (restaurant_id, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numberViews, images, types, schedule) VALUES ($1, $2, $3, $4, $5)',
     [id, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numberViews, images, types, schedule], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Restaurant added with data: ${id, name, phone, website, webUrl, address, email, city, country, latitude, longitude,rating, numberViews, images, types, schedule}`)
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