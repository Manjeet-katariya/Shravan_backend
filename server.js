const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middleware
const allowedOrigins = [
  'http://93.127.194.6',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin denied: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple MongoDB connection for local database (no SSL options needed)
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully to local database');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
  console.log('📍 Host:', mongoose.connection.host);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('⚠️  Please make sure MongoDB is running locally');
  console.log('💡 To start MongoDB: net start MongoDB');
});

// Routes
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'Architecture Backend API is running',
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'Not connected'
    },
    timestamp: new Date().toISOString()
  });
});


const emailTestRoutes = require('./routes/emailTest');
app.use('/api/email', emailTestRoutes);
// Import routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const teamRoutes = require('./routes/team');
app.use('/api/team', teamRoutes);

const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Contact and Estimate Routes
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

const contactDetailsRoutes = require('./routes/contactDetails');
app.use('/api/contact-details', contactDetailsRoutes);

const estimateRoutes = require('./routes/estimate');
app.use('/api/estimate', estimateRoutes);

const socialRoutes = require('./routes/social');
app.use('/api/social', socialRoutes);

const socialIconsRoutes = require('./routes/socialIcons');
app.use('/api/social-icons', socialIconsRoutes);

const founderRoutes = require('./routes/founder');
app.use('/api/founder', founderRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`👥 Team API: http://localhost:${PORT}/api/team`);
  console.log(`🏗️  Projects API: http://localhost:${PORT}/api/projects`);
  console.log(`📣 Social API: http://localhost:${PORT}/api/social`);  console.log(`🔗 Social Icons API: http://localhost:${PORT}/api/social-icons`);  console.log(`� Founder API: http://localhost:${PORT}/api/founder`);
  console.log(`�📤 Upload API: http://localhost:${PORT}/api/upload (CLOUDINARY)`);
  console.log(`📁 Uploads served at: http://localhost:${PORT}/uploads/`);
});