import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/formRoutes.js';
import authRoutes from './routes/authRoutes.js';
import auth from './middleware/auth.js';

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World');
});

// ⚠️ Register & Login should NOT use auth middleware
app.use('/api/auth', authRoutes);    

// Protected Routes
app.use('/api/forms', auth, formRoutes); 

mongoose.connect(`${process.env.MONGO_URI}/formData`)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch(err => console.log('DB connection error:', err));
