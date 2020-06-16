const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '88.15.140.153',
  //host: '/cloudsql/lookinmeal-dcf41:europe-west1:lookinmeal',
  database: 'postgres',
  password: 'qHeNfB1d5jNOrf8o',
  port: 5432,
})

const query = (request, response) => {
    const {query, locality, latitude, longitude} = request.headers;
    const statement = `select *, distance($3, $4, latitude, longitude) as distance from restaurant where city = $2 and name ILIKE $1 limit 10 `
    pool.query(statement,[query, locality, latitude, longitude], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  module.exports={
      query,
  }