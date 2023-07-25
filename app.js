const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const Schema = mongoose.Schema;

// Connect to MongoDB
mongoose.connect('mongodb+srv://kdholakiya73:YgRqWP1dGDUxsvcM@cluster0.oamubfk.mongodb.net/contact-details?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new image schema
const ImageSchema = new Schema({
  _id : mongoose.Schema.Types.ObjectId,
  image: {
    type: Buffer,
    required: true,
  },
});

// Create a model based on the image schema
const Image = mongoose.model('Image', ImageSchema);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create the Express app
const app = express();

// Set up the POST route for uploading an image
app.post('/upload', upload.single('image'), (req, res, next) => {
  try {
    // Read the uploaded image file
    const imageBytes = fs.readFileSync(req.file.path);

    // Create a new image document
    const newImage = new Image({
      _id : new mongoose.Types.ObjectId(),
      image: imageBytes,
    });

    // Save the image to the database
    newImage.save()
      .then((data) => {
        res.status(200).json({ message: 'Image saved successfully.' , id : data.id});
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error saving image.' });
      })
      .finally(() => {
        // Delete the temporary uploaded file
        fs.unlinkSync(req.file.path);
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error uploading image.' });
  }
});

// Set up the GET route for retrieving an image
// Set up the GET route for retrieving an image
app.get('/image/:id', (req, res, next) => {
  // Fetch the image from the database
  Image.findOne({_id: req.params.id})
    .then(image => {
      if (!image) {
        return res.status(404).json({ message: 'Image not found.' });
      }

      // Set the content type and send the image as the response
      res.contentType('image/jpg');
      res.send(image.image);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error retrieving image.' });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
