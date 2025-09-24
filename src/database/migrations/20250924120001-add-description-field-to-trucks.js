module.exports = {
  async up(db, client) {
    // Add description field to all existing truck documents
    await db.collection('trucks').updateMany(
      { description: { $exists: false } },
      { $set: { description: '' } }
    );
    
    console.log('Added description field to all existing truck documents');
  },

  async down(db, client) {
    // Remove description field from all truck documents
    await db.collection('trucks').updateMany(
      {},
      { $unset: { description: '' } }
    );
    
    console.log('Removed description field from all truck documents');
  }
};