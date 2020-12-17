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
  var {latitude, longitude, valoration, query1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3} = request.headers;
    console.log(latitude)
    console.log(longitude)
    console.log(valoration)
    console.log(query1)
    console.log(query2)
    console.log(query3)
    console.log(rating1)
    console.log(rating2)
    console.log(rating3)
    console.log(price1)
    console.log(price2)
    console.log(price3)
    console.log(allergens1)
    console.log(allergens2)
    console.log(allergens3)
    if(rating1 == "0.0"){
      rating1 = ""
    }
    if(rating2 == "0.0"){
      rating2 = ""
    }
    if(rating3 == "0.0"){
      rating3 = ""
    }
    if(price1 == "0.0"){
      price1 = ""
    }
    if(price2 == "0.0"){
      price2 = ""
    }
    if(price3 == "0.0"){
      price3 = ""
    }
  if(query3 != ""){
    var statement = "select re.*, e.entry_id as id1, w.entry_id as id2, x.entry_id as id3, distance($1, $2, re.latitude, re.longitude) as distance from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join menuentry w on w.restaurant_id = e.restaurant_id left join menuentry x on x.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id left join rating v on v.entry_id = w.entry_id left join rating y on y.entry_id = x.entry_id where $6=$6 and $7=$7 and $8=$8 and to_tsvector('simple', e.name) @@ to_tsquery('simple', $3) and to_tsvector('simple', w.name) @@ to_tsquery('simple', $4) and to_tsvector('simple', x.name) @@ to_tsquery('simple', $5) and (e.allergens && $12::text[] == False) and (w.allergens && $13::text[] == False) and (x.allergens && $14::text[] == False) and e.price <= $9 and w.price <= $10 and x.price <= $11 group by e.entry_id, re.restaurant_id, w.entry_id, x.entry_id having AVG(r.rating) > $6 and AVG(v.rating) > $7 and AVG(y.rating) > $8 order by distance($1, $2, re.latitude, re.longitude) asc limit 12;"

    if(valoration == "Sort by price lower first"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by (e.price + w.price + x.price) asc")
    }
    else if(valoration == "Sort by relevance"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by (sum(r.rating) + sum(v.rating) + sum(y.rating)) desc")
    }

    if(rating1 == "" && rating2 == "" && rating3 == ""){
      statement = statement.replace("having AVG(r.rating) > $6 and AVG(v.rating) > $7 and AVG(y.rating) > $8", "")
    }
    if(rating1 == ""){
      statement = statement.replace("AVG(r.rating) > $6 and", "")
    }
    if(rating2 == ""){
      statement = statement.replace("AVG(v.rating) > $7 and", "")
    }
    if(rating3 == ""){
      statement = statement.replace("AVG(y.rating) > $8", "")
    }

    if(price1 == ""){
      statement = statement.replace("e.price <= $9 and", "$9=$9 and ")
    }
    if(price2 == ""){
      statement = statement.replace("w.price <= $10 and", "$10=$10 and ")
    }
    if(price3 == ""){
      statement = statement.replace("and x.price <= $11", " and $11=$11")
    }

    if(allergens1 == "{}"){
      statement = statement.replace("(e.allergens && $12::text[] == False) and", "$12=$12 and ")
    }
    if(allergens2 == "{}"){
      statement = statement.replace("(w.allergens && $12::text[] == False) and", "$13=$13 and ")
    }
    if(allergens3 == "{}"){
      statement = statement.replace("(x.allergens && $12::text[] == False) and", "$14=$14 and ")
    }
  }
  else if(query2 != ""){
    var statement = "select re.*, e.entry_id as id1, w.entry_id as id2, distance($1, $2, re.latitude, re.longitude) as distance from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join menuentry w on w.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id left join rating v on v.entry_id = w.entry_id where $6=$6 and $7=$7 and to_tsvector('simple', e.name) @@ to_tsquery('simple', $3) and to_tsvector('simple', w.name) @@ to_tsquery('simple', $4) and (e.allergens && $12::text[] == False) and (w.allergens && $13::text[] == False) and e.price <= $9 and w.price <= $10 and ($5=$5 and $8=$8 and $11=$11 and $14=$14) group by e.entry_id, re.restaurant_id, w.entry_id having AVG(r.rating) > $6 and AVG(v.rating) > $7 order by distance($1, $2, re.latitude, re.longitude) asc limit 12;"

    if(valoration == "Sort by price lower first"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by (e.price + w.price) asc")
    }
    else if(valoration == "Sort by relevance"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by (sum(r.rating) + sum(v.rating)) desc")
    } 

    if(rating1 == "" && rating2 == ""){
      statement = statement.replace("having AVG(r.rating) > $6 and AVG(v.rating) > $7 ", "")
    }
    if(rating1 == ""){
      statement = statement.replace("AVG(r.rating) > $6 and", "")
    }
    if(rating2 == ""){
      statement = statement.replace("AVG(v.rating) > $7", "")
    }

    if(price1 == ""){
      statement = statement.replace("e.price <= $9 and", "$9=$9 and ")
    }
    if(price2 == ""){
      statement = statement.replace("w.price <= $10 and", "$10=$10 and ")
    }

    if(allergens1 == "{}"){
      statement = statement.replace("(e.allergens && $12::text[] == False) and", "$12=$12 and ")
    }
    if(allergens2 == "{}"){
      statement = statement.replace("(w.allergens && $12::text[] == False) and", "$13=$13 and ")
    }
  }
  else{
    var statement = "select re.*, e.entry_id as id1, distance($1, $2, re.latitude, re.longitude) as distance from menuentry e left join restaurant re on re.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id where $6=$6 and to_tsvector('simple', e.name) @@ to_tsquery('simple', $3) and (e.allergens && $12::text[] == False) and e.price <= $9 and ($4=$4 and $5=$5 and $7=$7 and $8=$8 and $10=$10 and $11=$11 and $13=$13 and $14=$14) group by e.entry_id, re.restaurant_id having AVG(r.rating) > $6 order by distance($1, $2, re.latitude, re.longitude) asc limit 12;"

    if(valoration == "Sort by price lower first"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by e.price asc")
    }
    else if(valoration == "Sort by relevance"){
      statement = statement.replace("order by distance($1, $2, re.latitude, re.longitude) asc", "order by sum(r.rating) desc")
    } 

    if(rating1 == ""){
      statement = statement.replace("having AVG(r.rating) > $6", "")
    }
    if(price1 == ""){
      statement = statement.replace("e.price <= $9 and", "$9=$9 and ")
    }
    if(allergens1 == "{}"){
      statement = statement.replace("(e.allergens && $12::text[] == False) and", "$12=$12 and ")
    }
  }

  pool.query(statement,[latitude, longitude, query1, query2, query3, rating1 , rating2 , rating3 , price1, price2, price3, allergens1, allergens2, allergens3], (error, results) => {
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