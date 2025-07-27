const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('../models/Department');
const seedDepartments = require('../data/seedData');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing departments (optional - comment out to preserve existing data)
    console.log('🗑️  Clearing existing department data...');
    await Department.deleteMany({});
    console.log('✅ Existing departments cleared');

    // Insert seed data
    console.log('📝 Inserting seed department data...');
    const insertedDepartments = await Department.insertMany(seedDepartments);
    console.log(`✅ Successfully inserted ${insertedDepartments.length} departments`);

    // Show summary by city
    const cities = await Department.getAllCities();
    console.log('\n📊 Seeding Summary:');
    console.log('==================');
    
    for (const city of cities) {
      const count = await Department.countDocuments({ city, isActive: true });
      console.log(`${city}: ${count} departments`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSeeded departments for the following cities:');
    cities.forEach(city => console.log(`  - ${city}`));

    // Test queries
    console.log('\n🧪 Testing database queries...');
    
    // Test finding a specific department
    const testDepartment = await Department.findByLocationAndIssue('Mumbai', 'Water');
    if (testDepartment) {
      console.log(`✅ Test query successful: Found ${testDepartment.name}`);
    } else {
      console.log('❌ Test query failed');
    }

    // Test getting all issue types
    const issueTypes = await Department.getAllIssueTypes();
    console.log(`✅ Found ${issueTypes.length} issue types: ${issueTypes.join(', ')}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    console.log('\n🔌 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 