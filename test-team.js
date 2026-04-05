// Test Team Member Creation with any image URL
require('dotenv').config();
const fetch = require('node-fetch');

async function testTeamCreation() {
  try {
    console.log('Testing team member creation...');
    
    const teamData = {
      name: 'John Doe',
      position: 'Senior Architect',
      bio: 'Experienced architect with 10+ years in commercial and residential design.',
      email: 'john.doe@example.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      order: 1,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // Using a sample image
    };

    const response = await fetch('http://localhost:5000/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(teamData)
    });

    const result = await response.json();
    
    console.log('Team Creation Response Status:', response.status);
    console.log('Team Creation Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Team member created successfully!');
      console.log('Team Member ID:', result.data._id);
      console.log('Image URL:', result.data.image);
    } else {
      console.log('❌ Team creation failed:', result.message);
    }
    
  } catch (error) {
    console.error('Test team creation error:', error.message);
  }
}

testTeamCreation();
