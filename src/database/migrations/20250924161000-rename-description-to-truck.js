/**
 * Migration: Rename 'description' field to 'truck' in trucks collection
 * 
 * Date: 2025-09-24
 */

module.exports = {
  async up(db, client) {
    console.log('Starting migration: rename description field to truck');
    
    const collection = db.collection('trucks');
    
    // Get count of documents that will be affected
    const totalDocs = await collection.countDocuments({});
    console.log(`Found ${totalDocs} trucks to migrate`);
    
    if (totalDocs === 0) {
      console.log('No documents to migrate');
      return;
    }
    
    // Rename 'description' field to 'truck' for all documents
    const result = await collection.updateMany(
      {}, // Update all documents
      {
        $rename: { "description": "truck" }
      }
    );
    
    console.log(`Successfully renamed 'description' to 'truck' in ${result.modifiedCount} documents`);
    
    // Validation: Check that the rename worked
    const docsWithTruck = await collection.countDocuments({ truck: { $exists: true } });
    const docsWithDescription = await collection.countDocuments({ description: { $exists: true } });
    
    console.log(`Validation:`);
    console.log(`- Documents with 'truck' field: ${docsWithTruck}`);
    console.log(`- Documents with 'description' field: ${docsWithDescription}`);
    
    if (docsWithDescription > 0) {
      throw new Error(`Migration validation failed: ${docsWithDescription} documents still have 'description' field`);
    }
    
    console.log('Migration completed successfully!');
  },

  async down(db, client) {
    console.log('Starting rollback: rename truck field back to description');
    
    const collection = db.collection('trucks');
    
    // Rename 'truck' field back to 'description'
    const result = await collection.updateMany(
      {},
      {
        $rename: { "truck": "description" }
      }
    );
    
    console.log(`Successfully renamed 'truck' back to 'description' in ${result.modifiedCount} documents`);
    console.log('Rollback completed successfully!');
  }
};