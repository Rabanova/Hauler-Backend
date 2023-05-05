const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
    default:
      "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
  },
});

const serviceProviderResponseSchema = new Schema({
  serviceProviderResponse: { type: String },
  serviceProviderActionPrice: { type: Number },
  timeStamp: { type: Date, required: true, default: Date.now },
});

const userResponseSchema = new Schema({
  userResponse: { type: String },
  userResponsePrice: { type: Number },
  timeStamp: { type: Date, default: Date.now },
});

const responseSchema = new Schema({
  serviceProviderId: { type: String },
  responseStatus: { type: String },
  notificationOnServiceProvider: { type: String, default: "none" },
  notificationOnUser: { type: String, default: "none" },
  serviceProviderActionButtons: { type: Boolean, default: false },
  userActionButtons: { type: Boolean, default: false },
  serviceProviderResponseSchema: [serviceProviderResponseSchema],
  userResponseSchema: [userResponseSchema],
});

const postSchema = new Schema([
  {
    userId: { type: String, required: true },
    service: { type: String, required: true },
    postHeading: { type: String, required: true },
    postDescription: { type: String },
    loadWeight: { type: String },
    numberOfItems: { type: Number },
    loadImages: [imageSchema],
    price: { type: Number, default: 50 },
    timeStamp: { type: Date, required: true, default: Date.now },
    totalOffers: { type: Number, default: 0 },
    show: { type: Boolean, default: true },
    status: { type: String, default: "Available" },
    acceptedPrice: { type: Number },
    acceptedServiceProvider: { type: String },
    pickUpAddress: { type: String, required: true },
    // pickUpProvince: { type: String, required: true },
    pickUpCity: { type: String, required: true },
    // pickUpStreetAddress: { type: String, required: true },
    // pickUpZipCode: { type: String, required: true },
    pickUpAddressLat: { type: Number, required: true },
    pickUpAddressLng: { type: Number, required: true },
    pickUpContactPerson: { type: String },
    pickUpContactNumber: { type: String, required: true },
    pickUpSpecialInstruction: { type: String },
    dropOffProvince: { type: String },
    dropOffAddress: { type: String },
    dropOffCity: { type: String },
    dropOffStreetAddress: { type: String },
    dropOffZipCode: { type: String },
    dropOffAddressLat: { type: Number },
    dropOffAddressLng: { type: Number },
    dropOffContactPerson: { type: String },
    dropOffContactNumber: { type: String },
    dropOffSpecialInstruction: { type: String },
    distance: { type: Number },
    response: [responseSchema],
    driverLat:{type:Number,default: 49.198913},
    driverLong:{type:Number,default:-122.865984},
    paymentIntent:{type:String}
  },
]);

module.exports = mongoose.model("Post", postSchema);
