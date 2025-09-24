/**
 * Migration: Refactor propertyType field and add listingType field
 * 
 * Changes:
 * 1. Add new 'listingType' field derived from 'category' field
 * 2. Update existing 'propertyType' field to match new enum values ('apartment', 'house', 'villa')
 * 3. Update indexes accordingly
 * 
 * Date: 2025-09-24
 * 
 * Current enum values:
 * - listingType: 'for Rent', 'for Sale'  
 * - propertyType: 'apartment', 'house', 'villa'
 */

module.exports = {
  async up(db, client) {
    console.log('Starting migration: refactor-property-fields');
    
    const collection = db.collection('properties');
    
    // Get count of documents that will be affected
    const totalDocs = await collection.countDocuments({});
    console.log(`Found ${totalDocs} documents to migrate`);
    
    if (totalDocs === 0) {
      console.log('No documents to migrate');
      return;
    }
    
    // Step 1: Add listingType field based on category field
    console.log('Step 1: Adding listingType field based on category...');
    
    // Map category values to listingType values
    const categoryToListingType = {
      'rent': 'for Rent',
      'sale': 'for Sale',
      'buy': 'for Sale',
      'lease': 'for Rent',
      'furnished': 'for Rent'
    };
    
    let listingTypeUpdates = 0;
    
    for (const [category, listingType] of Object.entries(categoryToListingType)) {
      const result = await collection.updateMany(
        { category: category },
        { $set: { listingType: listingType } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Set listingType to "${listingType}" for ${result.modifiedCount} documents with category "${category}"`);
        listingTypeUpdates += result.modifiedCount;
      }
    }
    
    // Set default listingType for any remaining documents
    const remainingDocs = await collection.updateMany(
      { listingType: { $exists: false } },
      { $set: { listingType: 'for Sale' } } // Default fallback
    );
    if (remainingDocs.modifiedCount > 0) {
      console.log(`Set default listingType "for Sale" for ${remainingDocs.modifiedCount} documents without category mapping`);
      listingTypeUpdates += remainingDocs.modifiedCount;
    }
    
    console.log(`Total documents updated with listingType: ${listingTypeUpdates}`);
    
    // Step 2: Update propertyType field to match new enum values
    console.log('Step 2: Updating propertyType field with new enum values...');
    
    // Map existing propertyType values to new enum values
    const propertyTypeMappings = [
      { old: 'apartment', new: 'apartment' },
      { old: 'house', new: 'house' },
      { old: 'villa', new: 'villa' },
      { old: 'studio', new: 'apartment' },      // map studio to apartment
      { old: 'townhouse', new: 'house' },       // map townhouse to house
      { old: 'duplex', new: 'house' },          // map duplex to house
      { old: 'penthouse', new: 'apartment' },   // map penthouse to apartment
      { old: 'commercial', new: 'apartment' },  // fallback mapping
      { old: 'residential', new: 'apartment' }, // fallback mapping
    ];
    
    let propertyTypeUpdates = 0;
    
    for (const mapping of propertyTypeMappings) {
      const result = await collection.updateMany(
        { propertyType: mapping.old },
        { $set: { propertyType: mapping.new } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Mapped propertyType "${mapping.old}" to "${mapping.new}" for ${result.modifiedCount} documents`);
        propertyTypeUpdates += result.modifiedCount;
      }
    }
    
    // Step 3: Set propertyType to null for unmappable values or set default
    console.log('Step 3: Handling unmappable propertyType values...');
    const validPropertyTypes = ['apartment', 'house', 'villa'];
    
    // First, let's see what unmappable values exist
    const unmappableValues = await collection.distinct('propertyType', {
      propertyType: { $exists: true, $nin: [...validPropertyTypes, null] }
    });
    
    if (unmappableValues.length > 0) {
      console.log(`Found unmappable propertyType values: ${JSON.stringify(unmappableValues)}`);
      
      // Set them to null (optional field)
      const result = await collection.updateMany(
        { 
          propertyType: { 
            $exists: true, 
            $nin: validPropertyTypes 
          } 
        },
        { $unset: { propertyType: "" } }
      );
      console.log(`Set propertyType to null for ${result.modifiedCount} documents with unmappable values`);
    }
    
    // Step 4: Update indexes
    console.log('Step 4: Updating indexes...');
    
    // Create new indexes for listingType
    try {
      await collection.createIndex({ listingType: 1, category: 1 });
      console.log('Created index: { listingType: 1, category: 1 }');
    } catch (error) {
      console.log('Index { listingType: 1, category: 1 } already exists or failed to create:', error.message);
    }
    
    try {
      await collection.createIndex({ location: 1, listingType: 1 });
      console.log('Created index: { location: 1, listingType: 1 }');
    } catch (error) {
      console.log('Index { location: 1, listingType: 1 } already exists or failed to create:', error.message);
    }
    
    try {
      await collection.createIndex({ propertyType: 1 });
      console.log('Created index: { propertyType: 1 }');
    } catch (error) {
      console.log('Index { propertyType: 1 } already exists or failed to create:', error.message);
    }
    
    // Step 5: Validation check
    console.log('Step 5: Validation check...');
    const finalListingTypeCount = await collection.countDocuments({ listingType: { $exists: true } });
    const validPropertyTypeCount = await collection.countDocuments({ 
      $or: [
        { propertyType: { $in: validPropertyTypes } },
        { propertyType: { $exists: false } }
      ]
    });
    
    console.log(`Final validation:`);
    console.log(`- Documents with listingType: ${finalListingTypeCount}`);
    console.log(`- Documents with valid/null propertyType: ${validPropertyTypeCount}`);
    console.log(`- Total documents: ${totalDocs}`);
    
    // Check listingType values
    const listingTypeValues = await collection.distinct('listingType');
    console.log(`- ListingType values: ${JSON.stringify(listingTypeValues)}`);
    
    // Check propertyType values
    const currentPropertyTypes = await collection.distinct('propertyType');
    console.log(`- PropertyType values: ${JSON.stringify(currentPropertyTypes)}`);
    
    if (finalListingTypeCount !== totalDocs) {
      throw new Error(`Migration validation failed: Expected ${totalDocs} documents with listingType, got ${finalListingTypeCount}`);
    }
    
    console.log('Migration completed successfully!');
  },

  async down(db, client) {
    console.log('Starting rollback: refactor-property-fields');
    
    const collection = db.collection('properties');
    
    // Step 1: Remove listingType field
    console.log('Step 1: Removing listingType field...');
    const result1 = await collection.updateMany(
      {},
      { $unset: { listingType: "" } }
    );
    console.log(`Removed listingType from ${result1.modifiedCount} documents`);
    
    // Step 2: Restore original propertyType values (this is lossy, we can't perfectly restore)
    console.log('Step 2: Note - Cannot perfectly restore original propertyType values due to mapping losses');
    console.log('Current propertyType values will remain as apartment/house/villa');
    
    // Step 3: Remove new indexes
    console.log('Step 3: Removing new indexes...');
    
    const indexesToDrop = [
      { listingType: 1, category: 1 },
      { location: 1, listingType: 1 },
      { propertyType: 1 }
    ];
    
    for (const indexSpec of indexesToDrop) {
      try {
        await collection.dropIndex(indexSpec);
        console.log(`Dropped index: ${JSON.stringify(indexSpec)}`);
      } catch (error) {
        console.log(`Index ${JSON.stringify(indexSpec)} not found or failed to drop:`, error.message);
      }
    }
    
    console.log('Rollback completed successfully!');
    console.log('Note: Original propertyType values (like "studio", "commercial") cannot be restored perfectly.');
  }
};