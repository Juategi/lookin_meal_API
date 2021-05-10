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
        payment_method: payment_intent.payment_method
    });
    response.status(200).json({customer: customer.id})
}

async function updateCustomer(request, response) {
    const {customerId, payment_intent_id} = request.body;
    const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
    const paymentMethod = await stripe.paymentMethods.attach(
        payment_intent.payment_method,
        {customer: customerId}
    );
    const customer = await stripe.customers.update(
        customerId,
        {invoice_settings:{
            default_payment_method: payment_intent.payment_method
     }});
    response.status(200).json({customer: customer})
}

async function getCustomer(request, response) {
    const {email} = request.headers;
    console.log(email)
    const customer = await stripe.customers.retrieve({
        email: email,
    });
    response.status(200).json({customer: customer.id})
}

async function createSubscription(request, response) {
    const {customerId, payment_intent_id, billing_cycle_anchor} = request.body;
    const payment_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
    var subscription
    console.log(billing_cycle_anchor)
    if(billing_cycle_anchor == -1){
        subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: 'price_1InoD6ASgVZXSVMBoRpkHTwk',
            }],
            //payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
            default_payment_method: payment_intent.payment_method
        });
    }
    else{
        subscription = await stripe.subscriptions.create({
            customer: customerId,
            trial_end : billing_cycle_anchor,
            items: [{
              price: 'price_1InoD6ASgVZXSVMBoRpkHTwk',
            }],
            //payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
            default_payment_method: payment_intent.payment_method
        });
    }
    response.status(200).json({subscriptionId: subscription.id})
}

async function cancelSubscription(request, response) {
    const {subscriptionId} = request.body;
    const deletedSubscription = await stripe.subscriptions.del(
        subscriptionId
    );
    response.status(200).json({subscription: deletedSubscription})
}

async function checkSubscription(request, response) {
    const {subscriptionid} = request.headers;
    const subscription = await stripe.subscriptions.retrieve(
        subscriptionid
    );
    response.status(200).json({subscription: subscription})
}

async function updateSubscription(request, response) {
    const {subscriptionId} = request.body;
    const subscription = await stripe.subscriptions.retrieve(
        subscriptionId
    );
    const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId, {
          //items: [{id: subscription.items.data[0].id,}],
          billing_cycle_anchor : "now"
        }
    );
    response.status(200).json({subscription: updatedSubscription})
}


module.exports = {
    createIntent,
    createCustomer,
    createSubscription,
    cancelSubscription,
    checkSubscription,
    updateCustomer
}


