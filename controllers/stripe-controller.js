const stripe = require('stripe')('sk_test_51M23WVAZXbnAuaLLJktMTrL2oSSQKCpqvjDDHkAK1PaYlJMFtLevnKFM9qUTjl6PjS9O3F4jGv7LsX9Yp1XUcRbR00G8JLajvz');
const ServiceProviderData = require('../models/serviceProviderProfile')
const PostData = require('../models/posts')

const createStripeAccount = async (req, res) => {
  const serviceProviderID = req.body.serviceProviderID;
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'CA',
      email: req.body.email,
      capabilities: {
        transfers: { requested: true },
      },
      // requested_capabilities: ['card_payment', 'transfers'],
    });

    const updateWithStripe = await ServiceProviderData.findOneAndUpdate({ uid: serviceProviderID }, { stripeAcc: account.id });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `http://${req.body.appUrl}`,
      return_url: `http://${req.body.appUrl}`,
      type: 'account_onboarding',
    });
    res.send(accountLink.url)
  } catch (err) {
    console.log(err)
  }

}

const createStripeAccountLink = async (req, res) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: req.body.accountId,
      refresh_url: `http://${req.body.appUrl}`,
      return_url: `http://${req.body.appUrl}`,
      type: 'account_onboarding',
    });
    console.log(accountLink)
  } catch (err) {
    console.log(err)
  }
}

// generate payment intent
const createPaymentIntent = async (req, res) => {
  console.log(req.body)
  const amount = req.body.amount * 100;
  const applicationFee = amount * 0.13;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'cad',
    automatic_payment_methods: {
      enabled: true,
    },
    capture_method: 'manual',
    application_fee_amount: applicationFee,
    transfer_data: {
      destination: req.body.serviceProviderAccount,
    },
  });

  console.log(paymentIntent.client_secret)

  await PostData.findOneAndUpdate({ _id: req.body.postId },
    {
      $set: {
        paymentIntent: paymentIntent.id
      }
    },
    { useFindAndModify: false }
  );

  res.json({
    paymentIntent: paymentIntent.client_secret,
    publishableKey: 'pk_test_51M23WVAZXbnAuaLLQ0DTyBlLUIlAiEfXDMG08JJnObkdAfPcWosN99cklgD4fmgsnfqAt8ZDFYzCpjAyXwxwRid00007njU21F'
  });
};

exports.createStripeAccount = createStripeAccount;
exports.createStripeAccountLink = createStripeAccountLink
exports.createPaymentIntent = createPaymentIntent