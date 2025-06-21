const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
dotenv.config();
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const app = express();
app.use(cors()); 
app.use(express.json()); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,     
            useUnifiedTopology: true  
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};
connectDB();

app.use('/api/auth', authRoutes);    
app.use('/api/events', eventRoutes); 
app.get('/', (req, res) => {
    res.send('EventEase API is running...');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
