import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth';
import mongoose from 'mongoose';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL as string).then(() => {
  console.log("Connected to MONGODB Database");
}).catch((error: any) => {
  console.log("Unable to connect to database:", error);
})

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/api/auth/', authRoute);

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
