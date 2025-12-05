const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const profileRoutes = require('./routes/profileRoutes');
const badgeRoutes = require('./routes/badgeRoutes');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/todos', todoRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/badges', badgeRoutes);

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

