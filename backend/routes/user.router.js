const express = require('express');
const { loginuser, registeruser, logoutuser, getallusers, getuser, updatepassword, updateuser, deleteuser, forgotpassword, mydetails } = require('../controllers/user.controller');
const { isAuthenticated, authrole } = require('../middleware/auth');
const router = express.Router();
router.route('/register').post(registeruser)
router.route('/login').post(loginuser)
router.route('/logout').get(isAuthenticated, logoutuser)
router.route('/getallusers').get(isAuthenticated , getallusers)//admin
router.route('/getuser/:id').get(isAuthenticated, getuser)// admin
router.route('/updatepassword/:id').put(isAuthenticated, updatepassword)//user&admin
router.route('/updateuser/:id').put(isAuthenticated, updateuser)
router.route('/deleteuser/:id').delete(isAuthenticated,deleteuser)//admin
router.route('/forgot').post(isAuthenticated,forgotpassword)
router.route('/mydetail').get(isAuthenticated,mydetails)

module.exports = router;