import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';


import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
