const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Article = require("../models/article");

const JWT_SECRET = '3sIueX5FbB9B1G4vX9+OwI7zFt/P9FPW3sLd0R9MxHQ=';


exports.getAllArticles = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const foundArticles = await Article.find({ author: decoded.id });

    res.status(200).json(foundArticles);
  } catch (error) {
    console.error("Get Article Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.createArticle = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const { title, content } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    
    const article = await Article.create({
      title,
      content,
      author: user._id, 
      publishedDate: Date.now(),
      isPublished: false,
    });

    
    user.articles.push({ articleId: article._id, title: article.title });
    await user.save(); 

    res.status(201).json({ message: 'Article created successfully!', article });
  } catch (error) {
    console.error("Create Article Error:", error);
    res.status(400).json({ error: 'Failed to create article!' });
  }
};


exports.deleteAllArticles = async (req, res) => {
  const token= req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded= jwt.verify(token,JWT_SECRET);
    
    await Article.deleteMany({ author: decoded.id});
    res.status(200).json({ message: "Successfully deleted all articles." });
  } catch (error) {
    console.error('Delete all articles error:', error);
    res.status(500).json({ message:'Failed to delete articles' + error.message });
  }
};

exports.getArticle = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const { articleTitle } = req.params;
  const { mine } = req.query; 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const query = { title: articleTitle };

    if (mine === 'true') {
      query.author = decoded.id;
    }

    const foundArticle = await Article.findOne(query);

    if (foundArticle) {
      res.status(200).json(foundArticle);
    } else {
      res.status(404).json({ message: "No article found with that title." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.updateArticle = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const { articleTitle } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const result = await Article.updateOne(
      { title: articleTitle, author: decoded.id }, 
      { title: req.body.title, content: req.body.content },
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Successfully updated the selected article." });
    } else {
      res.status(404).json({ message: "No article found with that title for the logged-in user to update." });
    }
  } catch (err) {
    console.error("Update Article Error:", err);
    res.status(500).json({ message: "Failed to update article. " + err.message });
  }
};


exports.patchArticle = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const { articleTitle } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    
    const result = await Article.updateOne(
      { title: articleTitle, author: decoded.id }, 
      { $set: req.body } 
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Successfully updated the article." });
    } else {
      res.status(404).json({ message: "No article found with that title for the logged-in user to update." });
    }
  } catch (err) {
    console.error("Patch Article Error:", err);
    res.status(500).json({ message: "Failed to update article. " + err.message });
  }
};


exports.deleteArticle = async (req, res) => {
  const token= req.header('Authorization').replace('Bearer ', '');
  const { articleTitle } = req.params;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    
    const result = await Article.deleteOne({ title: articleTitle, author: decoded.id });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Successfully deleted the article." });
    } else {
      res.status(404).json({ message: "No article that you've written was found with that title to delete." });
    }
  } catch (err) {
    console.error("Delete Article Error:", err);
    res.status(500).json({ message: "Failed to delete article. " + err.message });
  }
};

exports.getArticlesForAdmin = async(req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
  
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }
  
      
      if (user.role === 'admin') {
        const allArticles = await Article.find(); 
        res.status(200).json({ totalArticles: allArticles.length, articles: allArticles });
      } else {
        res.status(403).json({ error: 'Access denied. Admins only.' });
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid or expired token!' });
      }
      console.error('Get All Articles Error:', error);
      res.status(500).json({ error: 'Failed to retrieve all articles!' });
    }
}
