import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
// Express service
import express, { urlencoded, static as _static, json } from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
// General
const port = process.env.PORT || 8000;
import path from 'path';
// Bridge variables from commonjs to esm
import { __dirname } from './helpers/commonjsBridgeVariables.js';
// Init DB connection (mongoose)
import initDbConnection from './db/config.js';
// Routes import
import {
  AnnouncementRoutes,
  AuthRoutes,
  CommentRoutes,
  UserRoutes,
} from './routes/index.js';

// Middlewares
app.use(urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(_static(path.join(__dirname(import.meta), 'public')));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      // add production url to allow access from client
    ],
  })
);

// Format responses and requests to json and update limit upload size to 50mb
app.use(json({ limit: '50mb' }));

// Default route to make sure the server is running
app.get('/', (req, res) => {
  res.send(`
  <h1 style="text-align: center; font: 32px 'Lucida Grande', Arial, sans-serif;"> Up and Running </h1>
  <img src="/images/google_analytics.png" alt="Up and Running"></img>
  `);
});

// routes registration
app.use('/api/announcements', AnnouncementRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/users', UserRoutes);

app.listen(port, () => {
  initDbConnection()
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      console.error(err);
    });
  console.log(`Server running on port ${port}`);
});