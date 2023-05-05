const express = require('express');
const postController = require('../controllers/post-controller.js');
const router = express.Router();

router.delete('/', postController.deleteAll)
router.get('/', postController.getAll)
router.get('/all', postController.getAllPosts);
router.get('/location/:location', postController.getPostsByLocation)
router.get('/service/:service', postController.getPostsByService)
router.get('/one/:postId', postController.getOnePost);
router.get('/user/:uid', postController.getPostsByUid)
router.get('/user/location/:uid/:location', postController.getPostsByIdAndLocation)
router.get('/user/service/:uid/:service', postController.getPostsByIdAndService)
router.get('/serviceprovider/:serviceProviderId', postController.getPostsByServiceProviderId)
router.get('/serviceprovider/location/:serviceProviderId/:location', postController.getPostsByServiceProviderIdAndLocation)
router.get('/serviceprovider/service/:serviceProviderId/:service', postController.getPostsByServiceProviderAndService)
router.post('/', postController.createPost);
router.delete('/:postId', postController.deleteOnePost);
router.post('/:postId', postController.updateOnePost)
router.post('/one/:postId', postController.updatePostVisibility)
router.post('/serviceprovider/one/:postId', postController.changeJobStatusToDriving)
router.post('/serviceprovider/gps/:postId', postController.postGpsCordinates)
router.post('/serviceprovider/arrived/:postId', postController.markDriverArrival)
router.post('/serviceprovider/paid/:postId', postController.markJobPaid)
router.post('/complete/:postId', postController.markJobComplete)


router.post('/response/service-provider', postController.addServiceProviserResponse);
router.post('/response/user', postController.addUserResponse)
router.get('/response/service-provider/:serviceProviderId/:postId', postController.getResponseByServiseProviderId)
router.delete('/response/:responseId', postController.deleteResponse)

module.exports = router;

