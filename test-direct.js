// Direct Team Creation Test - Bypass potential middleware issues
require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./models/Team');

async function directTeamTest() {
  try {
    console.log('🔥 Direct team creation test...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create team member directly
    const teamMember = new Team({
      name: 'John Doe',
      position: 'Senior Architect',
      bio: 'Experienced architect with 10+ years in commercial design.',
      image: 'http://localhost:5000/uploads/image-1775284508246-270115651.png',
      email: 'john@example.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      order: 1,
      isActive: true
    });
    
    const savedMember = await teamMember.save();
    console.log('✅ Team member created successfully!');
    console.log('Member ID:', savedMember._id);
    console.log('Member Name:', savedMember.name);
    console.log('Image URL:', savedMember.image);
    
    // Test fetching
    const allMembers = await Team.find({ isActive: true });
    console.log('✅ Total team members:', allMembers.length);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Direct test error:', error.message);
    process.exit(1);
  }
}

directTeamTest();
