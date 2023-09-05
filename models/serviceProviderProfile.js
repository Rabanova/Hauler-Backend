const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const serviceLocationSchema = new Schema({
    serviceLocation: { type: String, required: true },
    locationStatus: { type: Boolean, required: true },
})

const servicesProvidedSchema = new Schema({
    serviceProvided: { type: String, required: true },
    serviceStatus: { type: Boolean, required: true },
    serviceLocations: [serviceLocationSchema]
})

const vehicleTypeSchema = new Schema({
    vehicle: { type: String }
})

const serviceProviderProfileSchema = new Schema({
    uid: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicUrl: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    stars: { type: Number, required: true, default: 5 },
    timeStamp: { type: Date, required: true, default: Date.now },
    province: { type: String, required: true },
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
    unitNumber: { type: String, required: true, default: '' },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    // chequeDepositFormUrl: { type: String, required: true },
    vehicleType: [vehicleTypeSchema],
    licenseNumber: { type: String, required: true },
    frontImage: { type: String, required: true },
    backImage: { type: String, required: true },
    // driverLicenseExpiry: { type: String, required: true },
    // driverAbstractUrl: { type: String, required: true },
    profileStatus: { type: Boolean, required: true },
    stripeAcc: { type: String },
    serviceProvided: [servicesProvidedSchema],
    code: { type: String, required: true },
})

module.exports = mongoose.model('Service Provider Profile', serviceProviderProfileSchema);