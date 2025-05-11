import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { forwardAuthenticated, ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Register page
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('users/register');
});

// Register user
router.post('/register', forwardAuthenticated, async (req, res) => {
  const { username, password, fullName, profession } = req.body;
  
  try {
    // Check if username exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.render('users/register', {
        error: 'Username already exists',
        username,
        fullName,
        profession
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      password,
      fullName,
      profession
    });
    
    await newUser.save();
    
    // Redirect to login
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('users/register', {
      error: 'Server error, please try again',
      username,
      fullName,
      profession
    });
  }
});

// Login page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('users/login');
});

// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: req.session.returnTo || '/projects',
    failureRedirect: '/login',
    failureFlash: false
  })(req, res, next);
  
  // Clean up the returnTo session variable
  delete req.session.returnTo;
});

// Logout
router.get('/logout', ensureAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Profile page
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('users/profile');
});

export default router;