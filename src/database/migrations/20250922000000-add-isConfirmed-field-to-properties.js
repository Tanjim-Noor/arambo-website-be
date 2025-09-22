/**
 * Migration to add isConfirmed field to all existing properties
 * Set default value to false for all existing records
 */

module.exports = {
  async up(db, client) {
    // Add isConfirmed field with default value true to all existing properties
    await db.collection('properties').updateMany(
      { isConfirmed: { $exists: false } }, // Only update documents that don't have the field
      { $set: { isConfirmed: true } }
    );

    console.log('Added isConfirmed field to all existing properties with default value true');
  },

  async down(db, client) {
    // Remove isConfirmed field from all properties
    await db.collection('properties').updateMany(
      {},
      { $unset: { isConfirmed: "" } }
    );
    
    console.log('Removed isConfirmed field from all properties');
  }
};