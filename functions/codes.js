const pool = require("./mypool").pool

const getCodes = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query(
      `SELECT * from codes where restaurant_id = $1`,[restaurant_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
}

const createCode = (request, response) => {
    const {restaurant_id, code_id, link} = request.body
    pool.query('INSERT INTO code (restaurant_id, code_id, link) VALUES ($1, $2, $3)',
     [restaurant_id, code_id, link], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Code created with id: ${code_id}`)
    })
}


const deleteCode = (request, response) => {
    const {restaurant_id, code_id} = request.headers
  
    pool.query(
      `DELETE FROM code WHERE restaurant_id = $1 and code_id = $2`,[restaurant_id, code_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`Code deleted with id: ${code_id}`)
      }
    )
}

module.exports = {
    getCodes,
    createCode,
    deleteCode
}