const express = require('express');
const serviceProviderController = require('../controllers/serviceProvider-controller')
const router = express.Router();

router.get('/', serviceProviderController.getServiceProvider);
router.get('/:uid', serviceProviderController.getOneServiceProvider);
router.post('/', serviceProviderController.createServiceProvider);
router.delete('/:uid', serviceProviderController.deleteOneServiceProvider);
router.post('/:uid', serviceProviderController.updateOneServiceProvider)

module.exports = router;

