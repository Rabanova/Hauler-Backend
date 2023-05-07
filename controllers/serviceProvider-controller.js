const ServiceProviderData = require('../models/serviceProviderProfile')
const textflow = require("textflow.js")

textflow.useKey("JZI6ELhqXlkk40ILQx3hFueY0jZb62cfHyv65kWEBqL6uLVV5XhOVr1zO3by7McY");

//===================================== To register service provider =================================//
const createServiceProvider = async (req, res) => {
    console.log(req.body);
    try {
        const {
            uid,
            firstName,
            lastName,
            profilePicUrl,
            dateOfBirth,
            province,
            city,
            streetAddress,
            unitNumber,
            email,
            contactNumber,
            code,
            chequeDepositFormUrl,
            vehicle,
            driverLicenseUrl,
            driverLicenseExpiry,
            driverAbstractUrl,
            profileStatus,
            serviceProvided,
            serviceStatus,
            serviceLocation,
            locationStatus,
        } = req.body;

        let result = await textflow.verifyCode(contactNumber, code);

        if (!result.valid) {
            return res.status(400).json({ success: false });
        }

        const newServiceProvider = new ServiceProviderData({
            uid,
            firstName,
            lastName,
            profilePicUrl,
            dateOfBirth,
            province,
            city,
            streetAddress,
            unitNumber,
            email,
            contactNumber,
            code,
            chequeDepositFormUrl,
            vehicleType: {
                vehicle
            },
            driverLicenseUrl,
            driverLicenseExpiry,
            driverAbstractUrl,
            profileStatus,
            serviceProvided: {
                serviceProvided,
                serviceStatus,
                serviceLocations: {
                    serviceLocation,
                    locationStatus,
                }
            },
        });
        console.log('code', code);
        await newServiceProvider.save();
        res.status(201).json({ success: true, serviceProviderProfile: newServiceProvider });
    } catch (error) {
        console.log(error)
        res.status(404).json({ success: false, message: error.message });
    }
}
//================================ To verify service providers =====================================//
const verifyProvider = async (req, res) => {
    const { contactNumber } = req.body;
    let result = await textflow.sendVerificationSMS(contactNumber);
    console.log('result for sms', result);

    if (result.ok) //send sms here
        return res.status(200).json({ success: true });

    return res.status(400).json({ success: false });

}
//================================ To get all service providers =====================================//
const getServiceProvider = async (req, res) => {
    try {
        const serviceProviders = await ServiceProviderData.find();
        res.status(200).json(serviceProviders)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//================================= To get One service provider =====================================//
const getOneServiceProvider = async (req, res) => {
    try {
        const id = req.params.uid;
        let serviceProvider = await ServiceProviderData.findOne({ uid: id });
        res.status(200).json(serviceProvider)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//================================= To delete service provider ======================================//
const deleteOneServiceProvider = async (req, res) => {
    try {
        const id = req.params.uid;
        await ServiceProviderData.deleteOne({ _id: id });
        res.status(200).json('Service Proviser Deleted')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//================================ To edit servise provider profile =================================//
const updateOneServiceProvider = async (req, res) => {
    try {
        const id = req.params.uid;
        const {
            firstName,
            lastName,
            profilePicUrl,
            //dateOfBirth,
            province,
            city,
            streetAddress,
            unitNumber,
            contactNumber,
        } = req.body;
        await ServiceProviderData.findOneAndUpdate({ uid: id }, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                //dateOfBirth: dateOfBirth,
                province: province,
                city: city,
                streetAddress: streetAddress,
                unitNumber: unitNumber,
                contactNumber: contactNumber,
                profilePicUrl: profilePicUrl
            }
        });
        res.status(200).json('User Info updated')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
//=============================== Post user profile picture  =================================================//
const postProfilePic = async (req, res) => {
    try {
        const id = req.params.uid;
        const profilePicUrl = req.file.location;
        console.log({ profilePicUrl, id });

        // Find the user document by ID
        const user = await UserData.findById(id);

        // Set the profile picture URL
        user.profilePicUrl = profilePicUrl;

        // Save the updated user document
        await user.save();

        res.status(200).send('Profile picture updated successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

exports.getOneServiceProvider = getOneServiceProvider;
exports.getServiceProvider = getServiceProvider;
exports.createServiceProvider = createServiceProvider;
exports.deleteOneServiceProvider = deleteOneServiceProvider;
exports.updateOneServiceProvider = updateOneServiceProvider;
exports.postProfilePic = postProfilePic;
exports.verifyProvider = verifyProvider;
