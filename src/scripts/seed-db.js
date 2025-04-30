// This script seeds the database with initial data
// Run with: node src/scripts/seed-db.js

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Call the seed API endpoint
    const response = await fetch('http://localhost:3000/api/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to seed database: ${errorData.error || 'Unknown error'}`);
    }
    
    const result = await response.json();
    console.log('Database seeded successfully:', result.message);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
