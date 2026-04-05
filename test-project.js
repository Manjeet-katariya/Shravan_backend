// Test Project Creation
require('dotenv').config();
const fetch = require('node-fetch');

async function testProjectCreation() {
  try {
    console.log('🔥 Testing project creation...');
    
    const projectData = {
      title: 'The Glass Pavilion',
      category: 'residential',
      description: 'The Glass Pavilion is an exploration of transparency and light. Perched on a dramatic alpine slope, the residence utilizes massive structural glass panels to dissolve the boundary between the interior living spaces and the breathtaking natural environment. Sustainable heating systems and locally sourced stone ground the ethereal structure.',
      location: 'Swiss Alps, Switzerland',
      completionYear: 2023,
      client: 'Private Client',
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687936-ce88c6b91927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ac7ecb73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      videos: [
        'https://www.w3schools.com/html/mov_bbb.mp4'
      ],
      technologies: [
        'Structural Glass',
        'Local Granite',
        'Geothermal Heating'
      ],
      materials: [
        'Glass',
        'Stone',
        'Steel',
        'Wood'
      ],
      order: 1
    };

    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();
    
    console.log('Project Creation Response Status:', response.status);
    console.log('Project Creation Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Project created successfully!');
      console.log('Project ID:', result.data._id);
      console.log('Project Title:', result.data.title);
      console.log('Category:', result.data.category);
    } else {
      console.log('❌ Project creation failed:', result.message);
    }
    
  } catch (error) {
    console.error('Test project creation error:', error.message);
  }
}

testProjectCreation();
