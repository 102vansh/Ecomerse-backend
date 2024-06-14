const express = require('express');
const { createorder, getsingleorder, myorders, allorders, updateorder, deleteorder } = require('../controllers/order.controller');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.route('/createorder').post(isAuthenticated,createorder)
router.route('/singleorder/:id').get(isAuthenticated,getsingleorder)
router.route('/myorders').get(isAuthenticated,myorders)
router.route('/allorders').get(isAuthenticated,allorders)
router.route('/updateorder/:id').put(isAuthenticated,updateorder)
router.route('/deleteorder/:id').delete(isAuthenticated,deleteorder)
module.exports = router;