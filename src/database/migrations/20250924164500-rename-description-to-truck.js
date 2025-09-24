/**
 * Migration: Rename description field to truck field
 * 
 * Changes:
 * 1. Rename 'description' field to 'truck' field in all truck documents
 * 
 * Date: 2025-09-24
 */

module.exports = {
  async up(db, client) {
    console.log('Starting migration: rename-description-to-truck');
    
    const collection = db.collection('trucks');
    
    // Get count of documents that will be affected
    const totalDocs = await collection.countDocuments({});
    console.log(`Found ${totalDocs} truck documents to migrate`);
    
    if (totalDocs === 0) {
      console.log('No documents to migrate');
      return;
    }
    
    // Step 1: Rename description field to truck field
    console.log('Step 1: Renaming description field to truck field...');
    
    const result = await collection.updateMany(
      { description: { $exists: true } },
      { $rename: { description: 'truck' } }
    );
    
    console.log(`Renamed description field to truck field for ${result.modifiedCount} documents`);
    
    // Step 2: Validation check
    console.log('Step 2: Validation check...');
    const docsWithTruckField = await collection.countDocuments({ truck: { $exists: true } });
    const docsWithDescriptionField = await collection.countDocuments({ description: { $exists: true } });
    
    console.log(`Final validation:`);
    console.log(`- Documents with truck field: ${docsWithTruckField}`);
    console.log(`- Documents with description field: ${docsWithDescriptionField}`);
    console.log(`- Total documents: ${totalDocs}`);
    
    if (docsWithDescriptionField > 0) {
      throw new Error(`Migration validation failed: ${docsWithDescriptionField} documents still have description field`);
    }
    
    console.log('Migration completed successfully!');
  },

  async down(db, client) {
    console.log('Starting rollback: rename-description-to-truck');
    
    const collection = db.collection('trucks');
    
    // Step 1: Rename truck field back to description field
    console.log('Step 1: Renaming truck field back to description field...');
    const result = await collection.updateMany(
      { truck: { $exists: true } },
      { $rename: { truck: 'description' } }
    );
    console.log(`Renamed truck field back to description field for ${result.modifiedCount} documents`);
    
    console.log('Rollback completed successfully!');
  }
};