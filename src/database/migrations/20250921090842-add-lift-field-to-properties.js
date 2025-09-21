module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // Migration logic: Add 'lift' field to all existing properties
    await db.collection('properties').updateMany(
      { lift: { $exists: false } },  // Only update documents without the field
      { $set: { lift: false } }      // Set default value
    );
    console.log('✅ Added lift field to existing properties');
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // Rollback logic: Remove the 'lift' field if needed
    await db.collection('properties').updateMany(
      {},
      { $unset: { lift: '' } }  // Remove the field
    );
    console.log('✅ Removed lift field from properties');
  }
};
