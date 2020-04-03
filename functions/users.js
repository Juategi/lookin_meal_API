const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '/cloudsql/lookinmeal-dcf41:europe-west1:lookinmeal',
  database: 'postgres',
  password: 'qHeNfB1d5jNOrf8o',
  port: 5432,
})

const getUserById = (request, response) => {
  const {id} = request.headers;
  const statement = `SELECT * FROM users WHERE user_id = $1 `
  pool.query(statement,[id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const {id, name, email, service, image} = request.body
  pool.query('INSERT INTO users (user_id, name, email, service, image) VALUES ($1, $2, $3, $4, $5)', [id, name, email, service, image], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with id: ${id}`)
  })
}

const updateUser = (request, response) => {
  const {id, name, email, image} = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2, image = $3 WHERE user_id = $3',
    [name, email, image, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with id: ${id}`)
    }
  )
}

const getUserFavorites = (request, response) => {
  const {id} = request.headers;

  pool.query(
    `SELECT * FROM restaurant WHERE favorite.user_id = $1 and restaurant.restauran_id = favorite.restaurant_id`,[user_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const addToUserFavorites = (request, response) => {
  const {user_id, restaurant_id} = request.body

  pool.query(
    'INSERT INTO favorite (user_id, restaurant_id) VALUES ($1, $2)',
    [user_id, restaurant_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`restaurant added with id: ${restaurant_id}`)
    }
  )
}

const deleteFromUserFavorites = (request, response) => {
  const {user_id, restaurant_id} = request.headers

  pool.query(
    `DELETE FROM favorite WHERE user_id = $1, restaurant_id = $2`,[user_id, restaurant_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`restaurant deleted from favs with id: ${restaurant_id}`)
    }
  )
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
  getUsers,
  getUserFavorites,
  addToUserFavorites,
  deleteFromUserFavorites
}