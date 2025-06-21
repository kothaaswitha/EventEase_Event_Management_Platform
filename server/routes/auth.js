const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile, 
    updateUserProfile, 
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/authController'); 
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
