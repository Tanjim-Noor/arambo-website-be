module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    console.log('🚀 Starting migration: Adding apartmentType and isVerified fields to properties...');
    
    try {
      // Get all existing properties to apply the migration
      const properties = await db.collection('properties').find({}).toArray();
      console.log(`📊 Found ${properties.length} properties to update`);

      if (properties.length === 0) {
        console.log('✅ No properties found, migration completed');
        return;
      }

      // Prepare bulk operations
      const bulkOps = [];

      for (const property of properties) {
        const updateFields = {};

        // Add apartmentType field (leave empty as requested)
        if (!property.hasOwnProperty('apartmentType')) {
          updateFields.apartmentType = '';
        }

        // Add isVerified field with random true/false as requested
        if (!property.hasOwnProperty('isVerified')) {
          updateFields.isVerified = Math.random() < 0.5; // Random true/false
        }

        // Only add to bulk ops if there are fields to update
        if (Object.keys(updateFields).length > 0) {
          bulkOps.push({
            updateOne: {
              filter: { _id: property._id },
              update: { $set: updateFields }
            }
          });
        }
      }

      // Execute bulk update if there are operations
      if (bulkOps.length > 0) {
        const result = await db.collection('properties').bulkWrite(bulkOps);
        console.log(`✅ Updated ${result.modifiedCount} properties with new fields`);
        console.log(`   - apartmentType: added to properties (empty string)`);
        console.log(`   - isVerified: added to properties (random true/false)`);
      } else {
        console.log('✅ All properties already have the required fields');
      }

      // Create indexes for the new fields to improve query performance
      await db.collection('properties').createIndex({ isVerified: 1 });
      console.log('✅ Created index on isVerified field');

      // Optional: Create a compound index for common queries
      await db.collection('properties').createIndex({ apartmentType: 1, isVerified: 1 });
      console.log('✅ Created compound index on apartmentType and isVerified fields');

      console.log('🎉 Migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    console.log('🔄 Rolling back migration: Removing apartmentType and isVerified fields...');
    
    try {
      // Remove the new fields from all properties
      const result = await db.collection('properties').updateMany(
        {},
        { 
          $unset: { 
            apartmentType: '',
            isVerified: ''
          } 
        }
      );
      
      console.log(`✅ Removed apartmentType and isVerified fields from ${result.modifiedCount} properties`);

      // Drop the indexes we created
      try {
        await db.collection('properties').dropIndex({ isVerified: 1 });
        console.log('✅ Dropped index on isVerified field');
      } catch (error) {
        console.log('⚠️  Index on isVerified may not exist, skipping...');
      }

      try {
        await db.collection('properties').dropIndex({ apartmentType: 1, isVerified: 1 });
        console.log('✅ Dropped compound index on apartmentType and isVerified fields');
      } catch (error) {
        console.log('⚠️  Compound index may not exist, skipping...');
      }

      console.log('🎉 Migration rollback completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration rollback failed:', error);
      throw error;
    }
  }
};