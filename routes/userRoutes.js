const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', userController.getUserData);
router.patch('/updatepassword', userController.updatePassword);
router.get('/admin/getAllUsers', userController.getAllUsers);
router.post('/createReview', userController.createReview);
router.get('/admin/allReviews', userController.getAllReviews);

module.exports = router;
