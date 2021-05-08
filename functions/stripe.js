const stripe = require('stripe')('sk_test_51IhExDASgVZXSVMBTma1Z0UGtw2tGSselr2FirXAik9h3myp3TbluO7PHyIoYyGIlpFfOnWjx7OJvILCcv7puxTL002EjT8qhu');


async function createIntent(request, response) {
    const {amount} = request.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'eur',
        payment_method_types: ['card'],
        setup_future_usage: 'off_session'
    });
    response.status(200).json({client_secret: paymentIntent.client_secret})
}

async function createCustomer(request, response) {
    const {email, payment_intent_id} = request.body;
    const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
    const customer = await stripe.customers.create({
        email: email,
        payment_method:payment_intent.payment_method
    });
    response.status(200).json({customer: customer.id})
}

async function getCustomer(request, response) {
    const {email} = request.headers;
    const customer = await stripe.customers.retrieve({
        email: email,
    });
    response.status(200).json({customer: customer.id})
}

async function createSubscription(request, response) {
    const {customerId, payment_intent_id} = request.body;
    const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: 'price_1InoD6ASgVZXSVMBoRpkHTwk',
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        default_payment_method: payment_intent.payment_method
    });
    response.status(200).json({subscriptionId: subscription.id})
}

async function cancelSubscription(request, response) {
    const {subscriptionId} = request.body;
    const deletedSubscription = await stripe.subscriptions.del(
        subscriptionId
    );
    response.status(200).json({subscription: deletedSubscription})
}

async function updateSubscription(request, response) {
    const {subscriptionId} = request.body;
    const subscription = await stripe.subscriptions.retrieve(
        subscriptionId
    );
    const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId, {
          items: [{
            id: subscription.items.data[0].id,
          }],
        }
    );
    response.status(200).json({subscription: deletedSubscription})
}


module.exports = {
    createIntent,
    createCustomer,
    createSubscription,
    cancelSubscription,
    getCustomer
}


