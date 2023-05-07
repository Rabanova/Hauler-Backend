const UserData = require('../models/userProfile.js')
const textflow = require("textflow.js")

textflow.useKey("JZI6ELhqXlkk40ILQx3hFueY0jZb62cfHyv65kWEBqL6uLVV5XhOVr1zO3by7McY");

//================================== To register new user =========================================//
const createUser = async (req, res) => {
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
        } = req.body;

        let result = await textflow.verifyCode(contactNumber, code);

        if (!result.valid) {
            return res.status(400).json({ success: false });
        }

        const newUser = new UserData({
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
        });
        console.log('newUser', newUser);
        console.log('code', code);

        await newUser.save();
        res.status(201).json({ success: true, userProfile: newUser });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
}

const verifyUser = async (req, res) => {
    const { contactNumber } = req.body;
    let result = await textflow.sendVerificationSMS(contactNumber);
    console.log('result for sms', result);

    if (result.ok) //send sms here
        return res.status(200).json({ success: true });

    return res.status(400).json({ success: false });

}

//==================================== Get All users ================================================//
const getUser = async (req, res) => {
    try {
        const users = await UserData.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//===================================== Get One user ================================================//
const getOneUser = async (req, res) => {
    try {
        const id = req.params.uid;
        console.log('id get one user', id);
        let user = await UserData.findOne({ uid: id });
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//====================================== Delete One User =============================================//
const deleteOneUser = async (req, res) => {
    try {
        const id = req.params.uid;
        await UserData.deleteOne({ uid: id });
        res.status(200).json("user deleted")
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//=============================== Edit user Profile =================================================//
const updateOneUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const {
            firstName,
            lastName,
            profilePicUrl,
            dateOfBirth,
            province,
            city,
            streetAddress,
            unitNumber,
            contactNumber
        } = req.body;
        await UserData.findOneAndUpdate(
            { uid: id },
            {
                $set: {
                    firstName,
                    lastName,
                    profilePicUrl,
                    dateOfBirth,
                    province,
                    city,
                    streetAddress,
                    unitNumber,
                    contactNumber
                }
            },
            { useFindAndModify: false } // Add this option to prevent deprecation warning
        );
        res.status(200).json("User Info updated")
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


exports.getOneUser = getOneUser;
exports.getUser = getUser;
exports.createUser = createUser;
exports.deleteOneUser = deleteOneUser;
exports.updateOneUser = updateOneUser;
exports.postProfilePic = postProfilePic;
exports.verifyUser = verifyUser;

