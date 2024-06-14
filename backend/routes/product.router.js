const express = require('express');
const { createproducta, getproduct, updateproduct, deleteproduct, getsingleproduct, createrev } = require('../controllers/product.controller');
const { authrole, isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/createproduct').post(createproducta)//admin
router.route('/getallproducts').get(getproduct)
router.route('/updateproduct/:id').put(updateproduct)//admin
router.route('/deleteproduct/:id').delete(deleteproduct)//admin
router.route('/product/:id').get(getsingleproduct)
router.route('/review').put(isAuthenticated,createrev)

module.exports = router
