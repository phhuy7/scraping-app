// server.js
const mongoose = require('mongoose');
const app = require('./app'); // Import the app from app.js
require('dotenv').config(); // Load environment variables from .env file

// MongoDB connection URI from .env
const mongoUri = process.env.MONGO_URI; 
console.log('MongoDB URI:', mongoUri); // Confirm that the URI is loaded

// Connect to MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
    // Start the server after a successful MongoDB connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
.catch(err => console.error("MongoDB connection error:", err));
