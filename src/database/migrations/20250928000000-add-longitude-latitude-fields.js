module.exports = {
  async up(db, client) {
    // Add longitude and latitude fields to existing properties
    await db.collection('properties').updateMany(
      {},
      {
        $set: {
          longitude: null,
          latitude: null
        }
      }
    );
    
    console.log('Added longitude and latitude fields to all properties');
  },

  async down(db, client) {
    // Remove longitude and latitude fields from properties
    await db.collection('properties').updateMany(
      {},
      {
        $unset: {
          longitude: "",
          latitude: ""
        }
      }
    );
    
    console.log('Removed longitude and latitude fields from all properties');
  }
};