//db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
MONGODB_URI="mongodb+srv://alledcss:Ww1234@cluster0.oc4ph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
