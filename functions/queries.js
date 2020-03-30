const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '104.155.57.239',
  database: 'postgres',
  password: 'qHeNfB1d5jNOrf8o',
  port: 5432,
})

const getUserById = (request, response) => {
  const {id} = request.body;
  const statement = `SELECT * FROM users WHERE user_id = '${id}' `
  pool.query(statement, (error, results) => {
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
    response.status(201).send(`User added with data: ${id, name, email, service, image}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}


module.exports = {
  getUserById,
  createUser,
  updateUser,
  getUsers
}