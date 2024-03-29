const pool = require("./mypool").pool

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

const getUserByUsername = (request, response) => {
  const {username} = request.headers;
  const statement = `SELECT * FROM users WHERE username = $1 `
  pool.query(statement,[username], (error, results) => {
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
  const {id, name, email, service, image, country, username} = request.body
  pool.query('INSERT INTO users (user_id, name, email, service, image, country, username) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, name, email, service, image, country, username], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with id: ${id}`)
  })
}

const updateUser = (request, response) => {
  const {id, name, about, image, service, country, username} = request.body

  pool.query(
    'UPDATE users SET name = $2, about = $3, image = $4, service = $5, country = $6, username = $7 WHERE user_id = $1',
    [id, name, about, image, service, country, username],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User updated with id: ${id}`)
    }
  )
}

const checkUsername = (request, response) => {
  const {username} = request.headers;
  const statement = 'SELECT username FROM users WHERE username = $1'
  pool.query(statement,[username], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const checkMail = (request, response) => {
  const {email} = request.headers;
  const statement = 'SELECT email FROM users WHERE email = $1'
  pool.query(statement,[email], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const getUserFavorites = (request, response) => {
  const {latitude,longitude,id} = request.headers;

  pool.query(
    `SELECT *,distance($1, $2, latitude, longitude) as distance FROM restaurant r LEFT JOIN favorite f ON r.restaurant_id = f.restaurant_id WHERE f.user_id = $3 `,[latitude,longitude,id],
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
      response.status(201).send(`restaurant added in favs with id: ${restaurant_id}`)
    }
  )
}

const deleteFromUserFavorites = (request, response) => {
  const {user_id, restaurant_id} = request.headers

  pool.query(
    `DELETE FROM favorite WHERE user_id = $1 AND restaurant_id = $2`,[user_id, restaurant_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`restaurant deleted from favs with id: ${restaurant_id}`)
    }
  )
}

const addRate = (request, response) => {
  const {user_id, entry_id, rating, ratedate, comment} = request.body

  pool.query(
    'INSERT INTO rating (user_id, entry_id, rating, ratedate, comment) VALUES ($1, $2, $3, $4, $5)',
    [user_id, entry_id, rating, ratedate, comment],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`rated with: ${rating}`)
    }
  )
}

const getRating = (request, response) => {
  const {user_id, entry_id} = request.headers;

  pool.query(
    `SELECT * FROM rating WHERE user_id = $1 and entry_id = $2 `,[user_id, entry_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const deleteRating = (request, response) => {
  const {user_id, entry_id} = request.headers

  pool.query(
    `DELETE FROM rating WHERE user_id = $1 AND entry_id = $2`,[user_id, entry_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`rating deleted with entry id: ${entry_id}`)
    }
  )
}

const getAllRatings = (request, response) => {
  const {user_id} = request.headers;

  pool.query(
    `SELECT * FROM rating WHERE user_id = $1`,[user_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const getRatingsHistory = (request, response) => {
  const {user_id, ratings, limit, offset, latitude, longitude} = request.headers;

  pool.query(
    `select re.*, r.entry_id, distance($5, $6, re.latitude, re.longitude) as distance from restaurant re left join menuentry e on re.restaurant_id = e.restaurant_id left join rating r on r.entry_id = e.entry_id where r.entry_id = ANY($2::integer[]) and r.user_id = $1 order by r.ratedate desc limit $3 offset $4 rows;`,[user_id, ratings, limit, offset, latitude, longitude],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const createList = (request, response) => {
  const {user_id, name, image, type} = request.body

  pool.query(
    'INSERT INTO favoritelists(user_id, name, image, type, list) VALUES ($1, $2, $3, $4, array[]::text[]) RETURNING id',
    [user_id, name, image, type],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const getLists = (request, response) => {
  const {user_id} = request.headers
  pool.query(
    `select * from favoritelists where user_id = $1 `,[user_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const updateList = (request, response) => {
  const {id, name, image,  list} = request.body
  pool.query(
    'UPDATE favoritelists SET list = $2 WHERE id = $1',
    [id, list],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`List updated with id: ${id}`)
    }
  )
}

const deleteList = (request, response) => {
  const {id} = request.headers

  pool.query(
    `DELETE FROM favoritelists WHERE id = $1`,[id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`List deleted with entry id: ${id}`)
    }
  )
}

const createOwner = (request, response) => {
  const {user_id, restaurant_id, type} = request.body

  pool.query(
    'INSERT INTO owner(user_id, restaurant_id, type) VALUES ($1, $2, $3)',
    [user_id, restaurant_id, type],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}


const getRestaurantOwners = (request, response) => {
  const {restaurant_id} = request.headers
  pool.query(
    `select o.*, u.username, u.token from owner o, users u where o.restaurant_id = $1 and o.user_id = u.user_id`,[restaurant_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}


const deleteOwner = (request, response) => {
  const {user_id, restaurant_id} = request.headers

  pool.query(
    `DELETE FROM owner WHERE user_id = $1 and restaurant_id = $2`,[user_id, restaurant_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Owner deleted with entry id: ${user_id}`)
    }
  )
}

const updateOwner = (request, response) => {
  const {user_id, type, restaurant_id} = request.body
  pool.query(
    'UPDATE owner SET type = $2, WHERE user_id = $1 and restaurant_id = $3',
    [user_id, type, restaurant_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Owner updated with id: ${user_id}`)
    }
  )
}


const addFollower = (request, response) => {
  const {userid, followerid} = request.body
    pool.query('INSERT INTO followers (user_id,followerid) VALUES ($1,$2)', [userid,followerid], (error, results) => {
      if (error) {
        response.status(400).send(error)
      }
      else{
        response.status(201).send(`Follower added with id: ${followerid}`)
      }
    })
}

const deleteFollower = (request, response) => {
  const {userid,followerid} = request.headers
    pool.query('DELETE FROM followers WHERE user_id = $1 and followerid = $2', [userid,followerid], (error, results) => {
      if (error) {
        response.status(400).send(error)
      }
      else{
        response.status(201).send(`Follower deleted with id: ${followerid}`)
      }
    })
}

const getNumFollowing = (request, response) => {
  const {userid} = request.headers;
  const statement = 'SELECT count(f.followerid) as num FROM followers f, users u WHERE f.user_id = $1 and u.user_id = f.followerid'
  pool.query(statement,[userid], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const getNumFollowers = (request, response) => {
  const {userid} = request.headers;
  const statement = 'SELECT count(f.user_id) as num FROM followers f, users u WHERE f.followerid = $1 and u.user_id = f.user_id'
  pool.query(statement,[userid], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const getFollowing = (request, response) => {
  const {userid} = request.headers;
  const statement = 'SELECT f.followerid FROM followers f, users u WHERE f.user_id = $1 and u.user_id = f.followerid'
  pool.query(statement,[userid], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const getFollowers = (request, response) => {
  const {userid} = request.headers;
  const statement = 'SELECT f.user_id FROM followers f, users u WHERE f.followerid = $1 and u.user_id = f.user_id'
  pool.query(statement,[userid], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const createTicket = (request, response) => {
  const {userid, ticket, type} = request.body
    pool.query('INSERT INTO ticket (user_id, ticket, type) VALUES ($1,$2,$3)', [userid, ticket, type], (error, results) => {
      if (error) {
        response.status(400).send(error)
      }
      else{
        response.status(201).send(`Ticket created for user: ${userid}`)
      }
    })
}



const addNotification = (request, response) => {
  const {user_id, restaurant_id, body, type} = request.body
    pool.query('INSERT INTO notifications (user_id, restaurant_id, body, type) VALUES ($1,$2, $3, $4)', [user_id, restaurant_id, body, type], (error, results) => {
      if (error) {
        response.status(400).send(error)
      }
      else{
        response.status(201).send(`Notification added with id: ${user_id}`)
      }
    })
}

const deleteNotification = (request, response) => {
  const {id} = request.headers
    pool.query('DELETE FROM notifications WHERE id = $1', [id], (error, results) => {
      if (error) {
        response.status(400).send(error)
      }
      else{
        response.status(201).send(`Notification deleted with id: ${id}`)
      }
    })
}

const getNotifications = (request, response) => {
  const {user_id} = request.headers;
  const statement = 'SELECT n.*, r.name FROM notifications n, restaurant r WHERE user_id = $1 and r.restaurant_id = n.restaurant_id'
  pool.query(statement,[user_id], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const updateToken = (request, response) => {
  const {user_id, token} = request.body
  pool.query(
    'UPDATE users SET token = $2 WHERE user_id = $1',
    [user_id, token],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Token updated with id: ${user_id}`)
    }
  )
}

const getUsersFeed = (request, response) => {
  const {user_id, latitude, longitude} = request.headers;
  const statement = 'SELECT u.* FROM users u WHERE not u.user_id =ANY(array(select distinct followerid from followers where user_id = $1)) and not u.user_id = $1 and distance($2, $3, (select re.latitude from restaurant re left join menuentry e on e.restaurant_id = re.restaurant_id left join rating r on r.entry_id = e.entry_id where r.user_id = u.user_id order by r.ratedate desc limit 1) , (select re.longitude from restaurant re left join menuentry e on e.restaurant_id = re.restaurant_id left join rating r on r.entry_id = e.entry_id where r.user_id = u.user_id order by r.ratedate desc limit 1)) < 10 order by (select count(*) from followers where followerid = u.user_id) desc limit 30;'
  pool.query(statement,[user_id, latitude, longitude], (error, results) => {
    if (error) {
      response.status(400).send(error)
    }
    else{
      response.status(200).json(results.rows)
    }
  })
}

const searchUsers = (request, response) => {
  const {user_id, query} = request.headers;
  pool.query(
    `SELECT u.* FROM users u WHERE not u.user_id = $1 and ( (to_tsvector('simple', u.name) @@ to_tsquery('simple', $2)) or (to_tsvector('simple', u.username) @@ to_tsquery('simple', $2)) ) limit 30;`, [user_id, query],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
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
  deleteFromUserFavorites,
  addRate,
  getRating,
  getAllRatings,
  deleteRating,
  checkMail,
  checkUsername,
  getRatingsHistory,
  getLists,
  createList,
  updateList,
  deleteList,
  createOwner,
  getRestaurantOwners,
  deleteOwner,
  addFollower,
  deleteFollower,
  getNumFollowers,
  getNumFollowing,
  getFollowers,
  getFollowing,
  getUserByUsername,
  updateOwner,
  createTicket,
  addNotification, 
  deleteNotification,
  getNotifications,
  updateToken,
  getUsersFeed,
  searchUsers
}