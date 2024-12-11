const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        username: {
          type: String,
          required: [true, 'Username is required'],
          unique: true,
          trim: true,
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          trim: true,
          lowercase: true,
          match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
          },
        password: {
          type: String,
          required: [true, 'Password is required'],
          minlength: 6,
        },
        articles:[
          {
            articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
            title: { type: String }
          }
        ],
        reviews: [
          {
            articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
            articleTitle: {type: String},
            review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
            reviewContent: {type: String}
          }
        ]
      },
      { timestamps: true }
    );
    
    const User = mongoose.model('User', userSchema);
    
    module.exports = User;