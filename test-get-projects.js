// Test Get All Projects
require('dotenv').config();
const fetch = require('node-fetch');

async function testGetProjects() {
  try {
    console.log('🔥 Testing get all projects...');
    
    const response = await fetch('http://localhost:5000/api/projects');
    const result = await response.json();
    
    console.log('Get Projects Response Status:', response.status);
    console.log('Get Projects Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Projects fetched successfully!');
      console.log('Total projects:', result.count);
      result.data.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title} (${project.category})`);
      });
    } else {
      console.log('❌ Projects fetch failed:', result.message);
    }
    
  } catch (error) {
    console.error('Test get projects error:', error.message);
  }
}

testGetProjects();
