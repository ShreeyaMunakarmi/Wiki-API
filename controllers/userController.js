const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Article = require("../models/article");
const Review = require("../models/review");

const JWT_SECRET = '3sIueX5FbB9B1G4vX9+OwI7zFt/P9FPW3sLd0R9MxHQ=';
exports.register = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  try {
     if (role !== 'user' && role !== 'admin') {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
      
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);    
    res.status(400).json({ error: 'User registration failed!' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials!' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ error: 'Login failed!' });
    console.error('Login error:', error);
  }
};

exports.getUserData = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.status(200).json({
      name: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(401).json({ error: 'Unauthorized!' });
  }
};

exports.updatePassword = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const { currentPassword, newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect!' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid or expired token!' });
      }
      console.error('Update Password Error:', error);
      res.status(500).json({ error: 'Failed to update password!' });
    }
  };

  exports.getAllUsers = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }
  
      
      if (user.role === 'admin') {
        
        const allUsers = await User.find({}, '-password'); 
        res.status(200).json({ totalUsers: allUsers.length, users: allUsers });
      } else {
        res.status(403).json({ error: 'Access denied. Admins only.' });
      }
    } catch (error) {
      console.error('Get All Users Error:', error);
      res.status(500).json({ error: 'Failed to retrieve users!' });
    }
  };
  
exports.createReview = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const { articleId, rating, comment } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

   
    const user = await User.findById(userId);
    const article = await Article.findById(articleId);

    if (!user || !article) {
      return res.status(404).json({ error: 'User or article not found!' });
    }

    
    const review = await Review.create({
      articleId,
      userId,
      rating,
      comment
    });

    
    user.reviews.push({
      articleId: article._id,
      articleTitle: article.title,
      review: review._id,
      reviewContent: review.comment
    });
    await user.save();

    
    article.reviews.push({
      userId: user._id,
      username: user.username,
      reviewId: review._id,
      reviewContent: review.comment
    });
    await article.save();

    res.status(201).json({ message: 'Review added successfully!', review });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(400).json({ error: 'Failed to create review!' });
  }
};

exports.getAllReviews = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    if (user.role === 'admin') {
      const allReviews = await Review.find();
      res.status(200).json({ totalReviews: allReviews.length, Reviews: allReviews });
    } else {
      res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  } catch (error) {
    console.error('Get All Reviews Error:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews!' });
  }
};




  