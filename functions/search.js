const pool = require("./mypool").pool

const queryRestaurants = (request, response) => {
    const {query, distance, latitude, longitude, valoration, offset, types} = request.headers;
    var statement = ""
    console.log(query)
    console.log(distance)
    console.log(latitude)
    console.log(longitude)
    console.log(valoration)
    console.log(offset)
    console.log(types)

    if(valoration != "Sort by relevance"){
        statement = "select *, distance($1, $2, latitude, longitude) as distance from restaurant where distance($1, $2, latitude, longitude) <= $3 and to_tsvector('simple', name) @@ to_tsquery('simple', $5) and types && $6::text[] order by distance asc limit 10 offset $4 rows;"
    }
    else{
        statement = "select r.*, distance($1, $2, r.latitude, r.longitude) as distance, COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($1, $2, r.latitude, r.longitude) <= $3  and r.types && $6::text[] and to_tsvector('simple', r.name) @@ to_tsquery('simple', $5) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset $4 rows;"
    }
    if(types == "{}"){
      statement = statement.replace("and r.types && $6::text[]", "and $6=$6")
      statement = statement.replace("and types && $6::text[]", "and $6=$6")
    }
    if(query == ":*"){
      statement = statement.replace("and to_tsvector('simple', r.name) @@ to_tsquery('simple', $5)", "and $5=$5")
      statement = statement.replace("and to_tsvector('simple', name) @@ to_tsquery('simple', $5)", "and $5=$5")
    }
    console.log(statement)
    pool.query(statement,[latitude, longitude, distance, offset,query, types], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
    /*
    if(valoration != "Sort by relevance"){
      if(types == "{}"){
        console.log('aaaaa')
        statement = "select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) order by distance asc limit 10 offset $5 rows;"
      }
      else{
        console.log('eeee')
        statement = "select *, distance($2, $3, latitude, longitude) as distance from restaurant where distance($2, $3, latitude, longitude) <= $4 and to_tsvector('simple', name) @@ to_tsquery('simple', $1) and types && $6::text[] order by distance asc limit 10 offset $5 rows;"
      }
    }
    else{
      if(types == "{}"){
        console.log('iiii')
        statement = "select r.*, distance($2, $3, r.latitude, r.longitude) as distance,  COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= $4  and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset $5 rows;"
      }
      else{
        console.log('oooo')
        statement = "select r.*, distance($2, $3, r.latitude, r.longitude) as distance, COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) from restaurant r LEFT OUTER join menuentry m on m.restaurant_id = r.restaurant_id LEFT OUTER join rating ra on ra.entry_id = m.entry_id where distance($2, $3, r.latitude, r.longitude) <= $4  and r.types && $6::text[] and to_tsvector('simple', r.name) @@ to_tsquery('simple', $1) group by r.restaurant_id order by COALESCE((sum(ra.rating)*0.5/count(ra) + count(ra)*0.0025),0 ) desc limit 10 offset $5 rows;"
      }
    }
    if(types == "{}"){
      pool.query(statement,[query, latitude, longitude, distance, offset], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
    else{
      pool.query(statement,[query, latitude, longitude, distance, offset, types], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
    */
  }

  
const queryEntries = (request, response) => {
  const {query, locality, latitude, longitude, valoration, price} = request.headers;
  var statement = ""
  var price2 = price
  if(price == "0.0"){
    price2 = "Infinity"
  }
  if(valoration == "false"){
    statement = `SELECT m.*, m.name as mname, AVG(r.rating) as mrating, COUNT(r) as numreviews, re.*, distance($2, $3, re.latitude, re.longitude) as distance FROM restaurant re, menuentry m left join rating r on m.entry_id=r.entry_id WHERE re.restaurant_id = m.restaurant_id and m.name ILIKE $1 and m.price <= $4 group by m.entry_id, re.restaurant_id order by m.price asc limit 15`
  }
  else{
    statement = `SELECT m.*, m.name as mname, AVG(r.rating) as mrating, COUNT(r) as numreviews, re.*, distance($2, $3, re.latitude, re.longitude) as distance FROM restaurant re, menuentry m left join rating r on m.entry_id=r.entry_id WHERE re.restaurant_id = m.restaurant_id and m.name ILIKE $1 and m.price <= $4  group by m.entry_id, re.restaurant_id order by mrating desc limit 15`
  }
   
  pool.query(statement,[query, latitude, longitude, price2], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


  module.exports={
      queryRestaurants,
      queryEntries
  }