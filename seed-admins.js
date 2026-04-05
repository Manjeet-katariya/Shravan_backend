/**
 * Database Seed Script - Initialize Admin Accounts
 * Run this once after database setup
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);

    // Create Superadmin
    const superadminExists = await User.findOne({ email: 'superadmin@architecture.com' });
    if (!superadminExists) {
      const superadmin = new User({
        name: 'Super Administrator',
        email: 'superadmin@architecture.com',
        password: 'superadmin123', // In production, use bcrypt
        role: 'superadmin',
        isActive: true
      });
      await superadmin.save();
      console.log('✅ Superadmin created: superadmin@architecture.com');
    } else {
      console.log('ℹ️  Superadmin already exists');
    }

    // Create Admin
    const adminExists = await User.findOne({ email: 'admin@architecture.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Administrator',
        email: 'admin@architecture.com',
        password: 'admin123', // In production, use bcrypt
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Admin created: admin@architecture.com');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    console.log('\n📊 All accounts initialized successfully!');
    console.log('\n🔐 Test Credentials:');
    console.log('   Superadmin: superadmin@architecture.com / superadmin123');
    console.log('   Admin: admin@architecture.com / admin123');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedAdmins();
