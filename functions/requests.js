const pool = require("./mypool").pool

var nodemailer = require('nodemailer')
const servermail = 'lookinmeal@gmail.com'

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: servermail,
      pass: 'ebj74zr-ShXD3Gmf'
    }
});

const sendConfirmationSms = (request, response) => {
  const {phone, localcode} = request.body
  var code = Math.floor(Math.random() * 100000) + 1;
  client.messages
  .create({
     body: 'Your confirmation code is ' + code,
     from: '+15126400348',
     to: '+34654280943'
   })
  .then(message => console.log(message.sid));
  pool.query('INSERT INTO confirmations (localcode, code, codedate) VALUES ($1, $2, CURRENT_DATE)',
   [localcode, code], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Code created`)
  }) 
}

const reSendConfirmationSms = (request, response) => {
  const {phone, localcode} = request.body
  var code = Math.floor(Math.random() * 100000) + 1;
  client.messages
  .create({
     body: 'Your confirmation code is ' + code,
     from: '+15126400348',
     to: '+34654280943'
   })
  .then(message => console.log(message.sid));
  pool.query('UPDATE confirmations SET code = $2 where localcode = $1',
   [localcode, code], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Code resent`)
  }) 
}

const sendConfirmationCode = (request, response ,next) => {
    const {email, localcode} = request.body
    var code = Math.floor(Math.random() * 100000) + 1;
    var mailOptions = {
        from: servermail,
        to: "juantg1994@gmail.com",
        subject: 'Confirmation code FindEat',
        text: 'Your confirmation code is ' + code
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
    /*try{
      const msg = {
        to: "juantg1994@gmail.com",
        from: 'test@example.com',
        subject: 'Confirmation code FindEat',
        text: 'Your confirmation code is ' + code,
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg);
    }catch(e){
      next(e)
    }*/
    pool.query('INSERT INTO confirmations (localcode, code, codedate) VALUES ($1, $2, CURRENT_DATE)',
     [localcode, code], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Code created`)
    }) 
}

const reSendConfirmationCode = (request, response) => {
    const {email, localcode} = request.body
    var code = Math.floor(Math.random() * 100000) + 1;
    var mailOptions = {
        from: servermail,
        to: "juantg1994@gmail.com",
        subject: 'Confirmation code FindEat',
        text: 'Your confirmation code is ' + code
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
    pool.query('UPDATE confirmations SET code = $2 where localcode = $1',
     [localcode, code], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Code resent`)
    }) 
}

async function confirmCodes(request, response){
    const {code, localcode} = request.body
    select = await pool.query('SELECT * from confirmations where code = $1 and localcode = $2',[code, localcode])
    var results = select.rows
    count = 0
    for(var i in results) {
        count++;
    }
    if(count > 0){
        await pool.query('DELETE from confirmations where code = $1 and localcode = $2',[code, localcode])
        response.status(201).send(`match`)
    }
    else{
        response.status(201).send(`error`)  
    }
}

const createRequest = (request, response) => {
    const {restaurant_id, user_id, relation, confirmation, idfront, idback} = request.body
    pool.query('INSERT INTO requests (restaurant_id, user_id, relation, confirmation, idfront, idback) VALUES ($1, $2, $3, $4, $5, $6)',
     [restaurant_id, user_id, relation, confirmation, idfront, idback], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Request created`)
    })
}

const createRestaurantRequest = (request, response) => {
    const {user_id, relation, name, phone, website, address, email, city, country, latitude, longitude, image, types, currency} = request.body
    
    pool.query('INSERT INTO restaurantcreation (user_id, relation, name, phone, website, address, email, city, country, latitude, longitude,image, types, currency) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13, $14)',
    [user_id, relation, name, phone, website, address, email, city, country, latitude, longitude,image, types, currency], (error, results) => {
    if (error) {
        throw error
    }
    response.status(200).json(results.rows)
    })

  }

module.exports = {
    sendConfirmationCode,
    reSendConfirmationCode,
    confirmCodes,
    createRequest,
    createRestaurantRequest,
    sendConfirmationSms,
    reSendConfirmationSms
}