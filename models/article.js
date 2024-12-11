const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content:{
      type: String,
      required:[true, 'Content is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'Author is required'],
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String },
        reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
        reviewContent:{type:String}
      }
    ]
   
  },
  { versionKey: false, timestamps: true } // Disables the __v field
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

