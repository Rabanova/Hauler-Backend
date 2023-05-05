const PostData = require('../models/posts')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//================================ Create new post on user app =====================================//
const createPost = async (req, res) => {
    try {
        const {
            userId,
            service,
            postHeading,
            postDescription,
            loadWeight,
            numberOfItems,
            imageUrl,
            price,
            totalOffers,
            status,
            pickUpAddress,
            // pickUpProvince,
            pickUpCity,
            // pickUpStreetAddress,
            // pickUpZipCode,
            pickUpAddressLat,
            pickUpAddressLng,
            pickUpContactPerson,
            pickUpContactNumber,
            pickUpSpecialInstruction,
            // dropOffProvince,
            dropOffAddress,
            dropOffCity,
            // dropOffStreetAddress,
            // dropOffZipCode,
            dropOffAddressLat,
            dropOffAddressLng,
            dropOffContactPerson,
            dropOffContactNumber,
            dropOffSpecialInstruction,
            distance,
            serviceProviderId,
            responseStatus,
            notificationOnServiceProvider,
            notificationOnUser,
            serviceProviderActionButtons,
            userActionButtons,
            serviceProviderResponse,
            serviceProviderActionPrice,
            userResponse,
            userResponsePrice,
        } = req.body;

        const newPost = new PostData({
            userId,
            service,
            postHeading,
            postDescription,
            loadWeight,
            numberOfItems,
            loadImages: [
                { imageUrl }
            ],
            price,
            totalOffers,
            status,
            pickUpAddress,
            // pickUpProvince,
            pickUpCity,
            // pickUpStreetAddress,
            // pickUpZipCode,
            pickUpAddressLat,
            pickUpAddressLng,
            pickUpContactPerson,
            pickUpContactNumber,
            pickUpSpecialInstruction,
            // dropOffProvince,
            dropOffAddress,
            dropOffCity,
            // dropOffStreetAddress,
            // dropOffZipCode,
            dropOffAddressLat,
            dropOffAddressLng,
            dropOffContactPerson,
            dropOffContactNumber,
            dropOffSpecialInstruction,
            distance,
            response: [{
                serviceProviderId,
                responseStatus,
                notificationOnServiceProvider,
                notificationOnUser,
                serviceProviderActionButtons,
                userActionButtons,
                serviceProviderResponseSchema: [{
                    serviceProviderResponse,
                    serviceProviderActionPrice
                }],
                userResponseSchema: [{
                    userResponse,
                    userResponsePrice
                }]
            }]
        });
        await newPost.save();
        res.status(201).json({ posts: newPost });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//=============================get all posts for testing ===========================================//
const getAll = async (req, res) => {
    try {
        const posts = await PostData.find();
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//=============================delete all posts for testing ===========================================//
const deleteAll = async (req, res) => {
    try {
        const posts = await PostData.deleteMany();
        res.status(200).json('all posts deleted')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//=========================== To get all posts posted by user on user app ==========================//
const getPostsByUid = async (req, res) => {
    const id = req.params.uid;
    try {
        const posts = await PostData.find({ userId: id });
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//========================== To get user's posts by location on user app ===========================//
const getPostsByIdAndLocation = async (req, res) => {
    const id = req.params.uid;
    const location = req.params.location;
    try {
        const posts = await PostData.find({ userId: id, pickUpCity: location });
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//========================= To get user's posts by service on user app ==============================//
const getPostsByIdAndService = async (req, res) => {
    const id = req.params.uid;
    const service = req.params.service;
    try {
        const posts = await PostData.find({ userId: id, service: service });
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//================================= Delete post on user app =========================================// 
const deleteOnePost = async (req, res) => {
    try {
        const id = req.params.postId;
        console.log('delete post id', id)
        let activePost = await PostData.findOne({ _id: id, status: { $in: ['Available', 'Negotiating'] } })
        if (!!activePost) {
            await PostData.deleteOne({ _id: id });
            res.status(200).json("Post deleted")
        } else {
            res.status(200).json("This post is already accepted. You cannot delete it!")
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//==================================== Edit post on user app ========================================//
const updateOnePost = async (req, res) => {
    try {
        const id = req.params.postId;
        let activePost = await PostData.findOne({ _id: id, status: { $in: ['Available', 'Negotiating'] } })
        if (!!activePost) {
            const {
                // service,
                postHeading,
                postDescription,
                loadWeight,
                numberOfItems,
                // imageUrl,
                price,
                pickUpAddress,
                pickUpCity,
                pickUpAddressLat,
                pickUpAddressLng,
                pickUpContactPerson,
                pickUpContactNumber,
                pickUpSpecialInstruction,
                dropOffAddress,
                dropOffCity,
                dropOffAddressLat,
                dropOffAddressLng,
                dropOffContactPerson,
                dropOffContactNumber,
                dropOffSpecialInstruction,
                distance
            } = req.body;
            await PostData.findOneAndUpdate({ _id: id },
                {
                    $set: {
                        // service: service,
                        postHeading: postHeading,
                        postDescription: postDescription,
                        loadWeight: loadWeight,
                        numberOfItems: numberOfItems,
                        // imageUrl: imageUrl,
                        price: price,
                        pickUpAddress: pickUpAddress,
                        pickUpCity: pickUpCity,
                        pickUpAddressLat: pickUpAddressLat,
                        pickUpAddressLng: pickUpAddressLng,
                        pickUpContactPerson: pickUpContactPerson,
                        pickUpContactNumber: pickUpContactNumber,
                        pickUpSpecialInstruction: pickUpSpecialInstruction,
                        dropOffAddress: dropOffAddress,
                        dropOffCity: dropOffCity,
                        dropOffAddressLat: dropOffAddressLat,
                        dropOffAddressLng: dropOffAddressLng,
                        dropOffContactPerson: dropOffContactPerson,
                        dropOffContactNumber: dropOffContactNumber,
                        dropOffSpecialInstruction: dropOffSpecialInstruction,
                        distance: distance
                    }
                });
            res.status(200).json('Post updated')
        } else {
            res.status(200).json("This post is already accepted. You cannot edit it!")
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//SK - to change job status to "in progress" once driver is en route
const changeJobStatusToDriving = async (req, res) => {
    try {
        const id = req.params.postId;
        await PostData.findOneAndUpdate({ _id: id },
            {
                $set: {
                    status: "In Progress"
                }
            });
        res.status(200).json('Status updated to driving')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//================================ To change post visibilty on both apps =============================//
// generate accepted price and service provider id
const updatePostVisibility = async (req, res) => {
    try {
        const id = req.params.postId;
        const {
            price,
            serviceProviderId
        } = req.body;
        await PostData.findOneAndUpdate({ _id: id },
            {
                $set: {
                    show: false,
                    status: "Awaiting Payment",
                    acceptedPrice: price,
                    acceptedServiceProvider: serviceProviderId
                }
            });
        res.status(200).json('Visibility updated')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//============================= To get single post by post Id on both apps ==========================//
const getOnePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await PostData.findOne({ _id: postId });
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//======================== To get all Active posts on service provider app ==========================//
const getAllPosts = async (req, res) => {
    try {
        const posts = await PostData.find({ show: true });
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//======================= To get Active posts by location on service provider app ====================//
const getPostsByLocation = async (req, res) => {
    const location = req.params.location;
    try {
        const posts = await PostData.find({ show: true, pickUpCity: location });
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//======================= To get Active Jobs by service on service provider app ======================//
const getPostsByService = async (req, res) => {
    const service = req.params.service;
    try {
        const posts = await PostData.find({ show: true, service: service });
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//=========================== To get all post by serviceProviderId ===================================//
const getPostsByServiceProviderId = async (req, res) => {
    try {
        const serviceProviderId = req.params.serviceProviderId;
        posts = await PostData.find({ 'response.serviceProviderId': serviceProviderId })
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//=================== To get all post by serviceProviderId and service ==============================//
const getPostsByServiceProviderAndService = async (req, res) => {
    try {
        const service = req.params.service
        const serviceProviderId = req.params.serviceProviderId;
        posts = await PostData.find({ 'response.serviceProviderId': serviceProviderId, service: service })
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//=================== To get all post by serviceProviderId and location ==============================//
const getPostsByServiceProviderIdAndLocation = async (req, res) => {
    try {
        const location = req.params.location
        const serviceProviderId = req.params.serviceProviderId;
        posts = await PostData.find({ 'response.serviceProviderId': serviceProviderId, pickUpCity: location })
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//==================== To add service provider response on service provider app ======================//

const addServiceProviserResponse = async (req, res) => {

    const {
        status,
        postId,
        serviceProviderId,
        responseStatus,
        // notificationOnServiceProvider,
        // notificationOnUser,
        serviceProviderActionButtons,
        serviceProviderResponse,
        serviceProviderActionPrice,
        userActionButtons
    } = req.body;


    let activePost = await PostData.findOne({ _id: postId, status: { $in: ['Available', 'Negotiating'] } })
    if (!!activePost) {//finds offers this service provider has already made on this post
        let existedResponse = await PostData.aggregate([
            { $match: { _id: ObjectId(postId), } },
            { $unwind: "$response" },
            { $replaceRoot: { newRoot: "$response" } },
            { $match: { serviceProviderId: serviceProviderId } },
        ]);
        const incrementValue = status === 'Declined' ? -1 : existedResponse.length > 0 ? 0 : 1
        //if this service provider has alread made an offer on this post
        if (existedResponse.length > 0) {
            try {
                const updatedResponse = await PostData.updateOne(
                    { _id: postId, 'response.serviceProviderId': serviceProviderId }, {
                    $push: {
                        'response.$.serviceProviderResponseSchema': [{
                            serviceProviderResponse,
                            serviceProviderActionPrice
                        }
                        ]
                    },
                    $set: {
                        'status': status,
                        'response.$.responseStatus': responseStatus,
                        'response.$.serviceProviderActionButtons': serviceProviderActionButtons,
                        'response.$.notificationOnServiceProvider': 'none',
                        'response.$.notificationOnUser': 'flex',
                        'response.$.userActionButtons': userActionButtons
                    },
                    $inc: {
                        totalOffers: incrementValue
                    }
                }
                )
                res.status(200).json("Response sent");
            } catch (error) {
                res.status(404).json({ message: error.message });
            }
        }
        //iff service provider has not made an offer on this post before
        else {
            try {
                const newResponse = await PostData.updateOne({ _id: postId },
                    {
                        $push: {
                            response:
                                [{
                                    serviceProviderId: serviceProviderId,
                                    responseStatus: responseStatus,
                                    notificationOnServiceProvider: 'none',
                                    notificationOnUser: 'flex',
                                    serviceProviderActionButtons: serviceProviderActionButtons,
                                    userActionButtons: userActionButtons,
                                    serviceProviderResponseSchema: [{
                                        serviceProviderResponse: serviceProviderResponse,
                                        serviceProviderActionPrice: serviceProviderActionPrice,
                                    }],
                                }]
                        },
                        $inc: {
                            totalOffers: incrementValue
                        },
                        $set: {
                            'status': status
                        }
                    })
                res.status(200).json("Response sent")
            } catch (error) {
                res.status(404).json({ message: error.message });
            }
        }
    } else {
        res.status(200).json("This post is not available")
    }
};

//================================= To add user response on user app ================================//
const addUserResponse = async (req, res) => {
    const {
        status,
        postId,
        serviceProviderId,
        responseStatus,
        // notificationOnServiceProvider,
        // notificationOnUser,
        serviceProviderActionButtons,
        userResponse,
        userResponsePrice,
        userActionButtons
    } = req.body
    //only need to change number of offers for user if they are declining a service provider offer - users cannot initiate offers
    const incrementValue = status === 'Declined' ? -1 : 0
    let activePost = await PostData.findOne({ _id: postId, status: { $in: ['Available', 'Negotiating'] } })
    if (!!activePost) {
        try {
            const updatedResponse = await PostData.updateOne(
                { _id: postId, 'response.serviceProviderId': serviceProviderId }, {
                $push: {
                    'response.$.userResponseSchema': [{
                        userResponse,
                        userResponsePrice
                    }
                    ]
                },
                $set: {
                    'status': status,
                    'response.$.responseStatus': responseStatus,
                    'response.$.serviceProviderActionButtons': serviceProviderActionButtons,
                    'response.$.notificationOnServiceProvider': 'flex',
                    'response.$.notificationOnUser': 'none',
                    'response.$.userActionButtons': userActionButtons
                },
                $inc: {
                    totalOffers: incrementValue
                }
            }
            )
            res.status(200).json(updatedResponse);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    } else {
        res.status(200).json("This post is not available")
    }
}

//=================== To get respone by serviceProviderId on serviceProvider App =====================//
const getResponseByServiseProviderId = async (req, res) => {
    try {
        const id = req.params.postId;
        const serviceProviderId = req.params.serviceProviderId;
        let newResponse = await PostData.aggregate([
            { $match: { _id: ObjectId(id), } },
            { $unwind: "$response" },
            { $replaceRoot: { newRoot: "$response" } },
            { $match: { serviceProviderId: serviceProviderId } },
        ]);
        res.status(200).json(newResponse)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//================================= To Delete Response on both apps====================================//
const deleteResponse = async (req, res, next) => {
    try {
        const responseId = req.params.responseId;
        await PostData.update({}, { $pull: { response: { _id: ObjectId(responseId) } } }, { multi: true })
        res.status(201).json({ "item deleted": 1 })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Neeraj  - send live gps cordinates to database
const postGpsCordinates = async (req, res) => {
    try {
        const id = req.params.postId;
        const { latitude, longitude } = req.body

        console.log("called the server")
        console.log(req.body)
        await PostData.findOneAndUpdate({ _id: id },
            {
                driverLat: latitude,
                driverLong: longitude
            }
        ), { upsert: true };
        res.status(200).json('Gps Data Posted Sucessfully')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Neeraj  - Update post status on Driver arrival

const markDriverArrival = async (req, res) => {
    try {
        const id = req.params.postId;

        await PostData.findOneAndUpdate({ _id: id },
            {
                $set: {
                    status: "Driver Arrived"
                }
            });
        res.status(200).json('Status Updated Sucesssfully')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
//============================== To mark job as paid==============================
const markJobPaid = async (req, res) => {
    try {
        const id = req.params.postId;

        await PostData.findOneAndUpdate({ _id: id },
            {
                $set: {
                    status: "Paid"
                }
            });
        res.status(200).json('Status Updated Sucesssfully')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Neeraj  - Update post status on Driver arrival

const markJobComplete = async (req, res) => {
    try {
        const id = req.params.postId;

        await PostData.findOneAndUpdate({ _id: id },
            {
                $set: {
                    status: "Complete"
                }
            });
        res.status(200).json('Status Updated Sucesssfully')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//===================================================================================================//
exports.getAllPosts = getAllPosts;
exports.getPostsByUid = getPostsByUid;
exports.getOnePost = getOnePost;
exports.createPost = createPost;
exports.deleteOnePost = deleteOnePost;
exports.updateOnePost = updateOnePost;
exports.updatePostVisibility = updatePostVisibility;
exports.getPostsByService = getPostsByService;
exports.getPostsByLocation = getPostsByLocation;
exports.getPostsByIdAndService = getPostsByIdAndService;
exports.getPostsByIdAndLocation = getPostsByIdAndLocation;
exports.addServiceProviserResponse = addServiceProviserResponse;
exports.addUserResponse = addUserResponse;
exports.getResponseByServiseProviderId = getResponseByServiseProviderId;
exports.deleteResponse = deleteResponse;
exports.getPostsByServiceProviderId = getPostsByServiceProviderId;
exports.getPostsByServiceProviderAndService = getPostsByServiceProviderAndService;
exports.getPostsByServiceProviderIdAndLocation = getPostsByServiceProviderIdAndLocation;
exports.getAll = getAll;
exports.deleteAll = deleteAll;
exports.changeJobStatusToDriving = changeJobStatusToDriving;
exports.postGpsCordinates = postGpsCordinates;
exports.markDriverArrival = markDriverArrival;
exports.markJobPaid = markJobPaid;
exports.markJobComplete = markJobComplete;