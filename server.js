const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const bodyParser = require("body-parser");
const stripe = require('stripe')('sk_test_51M23WVAZXbnAuaLLJktMTrL2oSSQKCpqvjDDHkAK1PaYlJMFtLevnKFM9qUTjl6PjS9O3F4jGv7LsX9Yp1XUcRbR00G8JLajvz');

require('dotenv').config();
const app = express();
const port = process.env.PORT || "3000";


//importing routes
const postRoutes = require('./routes/post-routes.js');
const serviceProvidersRoutes = require('./routes/serviceProvider-router.js');
const userRoutes = require('./routes/user-router.js');
const stripeRoutes = require('./routes/stripe-routes.js')

//importing middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ extended: true }));

//defining restApi's
app.use('/api/posts', postRoutes);
app.use('/api/service-providers', serviceProvidersRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes)


//connecting to MongoAtlas
const uri = process.env.MONGO_URI;
pipeline = [
    {
        $match: {
            "updateDescription.updatedFields": {
                "status": "Complete"
            }
        }
    }];
const options = { fullDocument: "updateLookup" };
const PostModel = require('./models/posts')
const postChangeEventEmitter = PostModel.watch(pipeline, options)
postChangeEventEmitter.on('change', (change) => {

    paymentIntent = change.fullDocument.paymentIntent
    console.log('change.fullDocument.paymentIntent', change.fullDocument.paymentIntent)

    amountToCapture = change.fullDocument.acceptedPrice * 100;

    stripe.paymentIntents.capture(paymentIntent, {
        amount_to_capture: amountToCapture,
    })
        .then(console.log("successssssssss"))
})

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.set("port", port);
        app.listen(port, () =>
            console.log(`App running successfully on port http://localhost:${port}`)
        );
    })
    .catch(err => {
        console.log(err)
    });