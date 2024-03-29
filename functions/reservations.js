const pool = require("./mypool").pool

const getTables = (request, response) => {
    const {restaurant_id} = request.headers;
    pool.query(
      `SELECT * from tables where restaurant_id = $1`,[restaurant_id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
}

const createTable = (request, response) => {
    const {restaurant_id, capmax, capmin, amount} = request.body
    pool.query('INSERT INTO tables (restaurant_id, capmax, capmin, amount) VALUES ($1, $2, $3, $4) RETURNING table_id',
     [restaurant_id, capmax, capmin, amount], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const updateTable = (request, response) => {
    const {id, capmax, capmin, amount} = request.body
    pool.query('UPDATE tables SET capmax = $2, capmin = $3, amount = $4 WHERE table_id = $1',
     [id, capmax, capmin, amount], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Table updated with id: ${id}`)
    })
}

const deleteTable = (request, response) => {
    const {id} = request.headers
  
    pool.query(
      `DELETE FROM tables WHERE table_id = $1`,[id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`Table deleted with id: ${id}`)
      }
    )
}

const getReservationsDay = (request, response) => {
    const {restaurant_id, reservationdate} = request.headers;
    pool.query(
      `SELECT r.*, u.name from reservation r left join users u on r.user_id = u.user_id where r.restaurant_id = $1 and r.reservationdate = $2`,[restaurant_id, reservationdate],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
}

const getReservationsUser = (request, response) => {
    const {user_id, reservationdate} = request.headers;
    pool.query(
      `SELECT e.*, r.name as restaurant_name from reservation e left join restaurant r on r.restaurant_id = e.restaurant_id where e.user_id = $1 and e.reservationdate >= $2::date`,[user_id, reservationdate],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
}


const createReservation = (request, response) => {
    const {restaurant_id, user_id, table_id, people, reservationdate, reservationtime} = request.body
    pool.query('INSERT INTO reservation (restaurant_id, user_id, table_id, people, reservationdate, reservationtime) VALUES ($1, $2, $3, $4, $5, $6)',
     [restaurant_id, user_id, table_id, people, reservationdate, reservationtime], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Reservation created in table: ${table_id}`)
    })
}

const deleteReservation = (request, response) => {
    const {table_id, reservationdate, reservationtime} = request.headers
    pool.query(
      `DELETE FROM reservation WHERE table_id = $1 and reservationdate = $2 and reservationtime = $3`,[table_id, reservationdate, reservationtime],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(`Reservation deleted in table: ${table_id}`)
      }
    )
}

const getExcluded = (request, response) => {
  const {restaurant_id} = request.headers;
  pool.query(
    `SELECT excludeddate from excludeddays where restaurant_id = $1`,[restaurant_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}


const addExcluded = (request, response) => {
  const {restaurant_id, excludeddate} = request.body
  pool.query('INSERT INTO excludeddays (restaurant_id, excludeddate) VALUES ($1, $2)',
   [restaurant_id, excludeddate], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Day added: ${excludeddate}`)
  })
}

const deleteExcluded = (request, response) => {
  const {restaurant_id, excludeddate} = request.headers
  pool.query(
    `DELETE FROM excludeddays WHERE restaurant_id = $1 and excludeddate = $2`,[restaurant_id, excludeddate],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Day deleted: ${excludeddate}`)
    }
  )
}



module.exports = {
    createTable,
    deleteTable,
    updateTable,
    createReservation,
    deleteReservation,
    getTables,
    getReservationsDay,
    getReservationsUser,
    addExcluded,
    deleteExcluded,
    getExcluded
}