// Simple Team API Test
require('dotenv').config();
const fetch = require('node-fetch');

async function testTeamAPI() {
  try {
    console.log('Testing team API...');
    
    // First test GET request
    console.log('\n1. Testing GET /api/team');
    const getResponse = await fetch('http://localhost:5000/api/team');
    const getResult = await getResponse.json();
    console.log('GET Response:', getResult);
    
    // Then test POST request
    console.log('\n2. Testing POST /api/team');
    const teamData = {
      name: 'Test User',
      position: 'Test Position',
      bio: 'Test bio',
      imageUrl: 'http://localhost:5000/uploads/image-1775284508246-270115651.png'
    };

    const postResponse = await fetch('http://localhost:5000/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(teamData)
    });

    console.log('POST Response Status:', postResponse.status);
    const postResult = await postResponse.json();
    console.log('POST Response:', postResult);
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testTeamAPI();
