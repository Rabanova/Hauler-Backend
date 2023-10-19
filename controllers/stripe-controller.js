const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.LIVE_KEY);
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
  const applicationFee = amount * 0.15;
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
    publishableKey: 'pk_live_51M23WVAZXbnAuaLLORDCDNocKJwip4jGxe1RTV4yFuWc2raPhUfSExoC49SM5snfftreL2ULPTrctX5avo5HHM5I006pZPKCyH'
  });
};

exports.createStripeAccount = createStripeAccount;
exports.createStripeAccountLink = createStripeAccountLink
exports.createPaymentIntent = createPaymentIntent