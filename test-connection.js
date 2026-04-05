const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  console.log('📡 Username: manjeetkatariya2000_db_user');
  console.log('🌐 Cluster: cluster0.gngpxso.mongodb.net');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Connection State:', mongoose.connection.readyState);
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
  } catch (error) {
    console.error('❌ FAILED to connect:');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.error('⚠️  Authentication failed - wrong username/password');
    } else if (error.message.includes('IP')) {
      console.error('⚠️  IP not whitelisted - but you have 0.0.0.0/0 set');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('⚠️  Cannot resolve DNS - check your internet connection');
    } else if (error.message.includes('timed out')) {
      console.error('⚠️  Connection timeout - check firewall or proxy settings');
    }
  }
}

testConnection();