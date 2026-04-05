// Test Project Detail Page
require('dotenv').config();
const fetch = require('node-fetch');

async function testProjectDetail() {
  try {
    console.log('🔥 Testing project detail fetch...');
    
    // First get all projects to get an ID
    const projectsResponse = await fetch('http://localhost:5000/api/projects');
    const projectsData = await projectsResponse.json();
    
    if (projectsData.success && projectsData.data.length > 0) {
      const projectId = projectsData.data[0]._id;
      console.log('Testing with project ID:', projectId);
      
      // Now test getting single project
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`);
      const result = await response.json();
      
      console.log('Project Detail Response Status:', response.status);
      console.log('Project Detail Response:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('✅ Project detail fetch successful!');
        console.log('Project Title:', result.data.title);
        console.log('Project Category:', result.data.category);
        console.log('Images count:', result.data.images.length);
        console.log('Videos count:', result.data.videos.length);
      } else {
        console.log('❌ Project detail fetch failed:', result.message);
      }
    } else {
      console.log('❌ No projects found to test with');
    }
    
  } catch (error) {
    console.error('Test project detail error:', error.message);
  }
}

testProjectDetail();
