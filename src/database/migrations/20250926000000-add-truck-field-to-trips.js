/**
 * Migration: Add truck field to trips collection
 * Date: 2025-09-26
 * Description: Adds a truck field (string, default empty) to all existing trip records
 */

module.exports = {
  async up(db) {
    // Add truck field with default empty string to all existing trip documents
    await db.collection('trips').updateMany(
      {}, // Match all documents
      {
        $set: {
          truck: '' // Set truck field to empty string
        }
      }
    );
    
    console.log('Added truck field to all trips');
  },

  async down(db) {
    // Remove truck field from all trip documents
    await db.collection('trips').updateMany(
      {},
      {
        $unset: {
          truck: 1
        }
      }
    );
    
    console.log('Removed truck field from all trips');
  }
};