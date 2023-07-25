const express = require('express')
const app = express()
const mongoose = require('mongoose');
const fs = require('fs');

// Define the Mongoose schema for the image model
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String
});

// Create a Mongoose model based on the schema
const Image = mongoose.model('Image', imageSchema);

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://kdholakiya73:YgRqWP1dGDUxsvcM@cluster0.oamubfk.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Read the image file as binary data
    // const imageData = fs.readFileSync('path/to/image.jpg');

    // Create a new instance of the Image model
    const newImage = new Image({
      name: 'My Image',
      data: imageData,
      contentType: 'image/jpeg' // Replace with the appropriate content type of your image
    });

    // Save the image to MongoDB
    newImage.save()
      .then(() => {
        console.log('Image saved to MongoDB');
        // Do something after the image is saved
      })
      .catch(error => {
        console.error('Error saving image:', error);
      })
      .finally(() => {
        // Close the MongoDB connection
        mongoose.connection.close();
      });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
app.listen(3000)