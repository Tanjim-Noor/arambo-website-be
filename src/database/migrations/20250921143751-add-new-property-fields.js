module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    console.log('🔄 Adding new property fields to existing documents...');
    
    // Get count of existing properties
    const existingCount = await db.collection('properties').countDocuments();
    console.log(`📊 Found ${existingCount} existing properties`);
    
    if (existingCount === 0) {
      console.log('✅ No existing properties to migrate');
      return;
    }

    // Add new fields with default values to all existing properties
    const updateResult = await db.collection('properties').updateMany(
      {}, // Update all documents
      {
        $set: {
          // Set default values for new optional fields (only if they don't exist)
          houseId: null,
          streetAddress: null,
          landmark: null,
          area: null,
          listingId: null,
          inventoryStatus: null,
          tenantType: null,
          propertyCategory: null,
          furnishingStatus: null,
          availableFrom: null,
          floor: null,
          totalFloor: null,
          yearOfConstruction: null,
          rent: null,
          serviceCharge: null,
          advanceMonths: null,
          cleanHygieneScore: null,
          sunlightScore: null,
          bathroomConditionsScore: null,
          coverImage: null,
          otherImages: []
        }
      }
    );

    console.log(`✅ Updated ${updateResult.modifiedCount} properties with new fields`);
    
    // Create indexes for new fields
    console.log('🔄 Creating indexes for new fields...');
    await db.collection('properties').createIndex({ area: 1, propertyCategory: 1 });
    await db.collection('properties').createIndex({ inventoryStatus: 1, tenantType: 1 });
    await db.collection('properties').createIndex({ rent: 1, bedrooms: 1 });
    await db.collection('properties').createIndex({ houseId: 1 });
    await db.collection('properties').createIndex({ listingId: 1 });
    
    console.log('✅ Indexes created successfully');
    console.log('🎉 Migration completed successfully!');
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    console.log('🔄 Rolling back new property fields...');
    
    // Remove the new fields from all documents
    const updateResult = await db.collection('properties').updateMany(
      {},
      {
        $unset: {
          houseId: '',
          streetAddress: '',
          landmark: '',
          area: '',
          listingId: '',
          inventoryStatus: '',
          tenantType: '',
          propertyCategory: '',
          furnishingStatus: '',
          availableFrom: '',
          floor: '',
          totalFloor: '',
          yearOfConstruction: '',
          rent: '',
          serviceCharge: '',
          advanceMonths: '',
          cleanHygieneScore: '',
          sunlightScore: '',
          bathroomConditionsScore: '',
          coverImage: '',
          otherImages: ''
        }
      }
    );

    console.log(`✅ Removed new fields from ${updateResult.modifiedCount} properties`);
    
    // Drop the new indexes
    console.log('🔄 Dropping new indexes...');
    try {
      await db.collection('properties').dropIndex({ area: 1, propertyCategory: 1 });
      await db.collection('properties').dropIndex({ inventoryStatus: 1, tenantType: 1 });
      await db.collection('properties').dropIndex({ rent: 1, bedrooms: 1 });
      await db.collection('properties').dropIndex({ houseId: 1 });
      await db.collection('properties').dropIndex({ listingId: 1 });
    } catch (error) {
      console.log('⚠️  Some indexes may not exist, continuing...');
    }
    
    console.log('✅ Rollback completed successfully!');
  }
};
