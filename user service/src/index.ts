import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes.js';
import cors from 'cors';

dotenv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "Music",
    });
    console.log("Connected to MongoDB");
  }

  catch (err) {
    console.log(err);
  }

}

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/v1', userRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDb()
});

