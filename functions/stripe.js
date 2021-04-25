const stripe = require('stripe')('sk_test_51IhExDASgVZXSVMBTma1Z0UGtw2tGSselr2FirXAik9h3myp3TbluO7PHyIoYyGIlpFfOnWjx7OJvILCcv7puxTL002EjT8qhu');


async function createIntent(request, response) {
    const {amount} = request.body;
    console.log(amount) 
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'eur',
        payment_method_types: ['card'],
    });
    console.log(paymentIntent.client_secret) 
    response.status(200).json({client_secret: paymentIntent.client_secret})
}


module.exports = {
    createIntent
}


