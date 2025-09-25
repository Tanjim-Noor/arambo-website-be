module.exports = {
  async up(db, client) {
    // Add the new boolean facility fields to all existing properties
    await db.collection('properties').updateMany(
      {},
      {
        $set: {
          cctv: false,
          communityHall: false,
          gym: false,
          masjid: false,
          parking: false,
          petsAllowed: false,
          swimmingPool: false,
          trainedGuard: false
        }
      }
    );

    console.log('Added new boolean facility fields to all existing properties');
  },

  async down(db, client) {
    // Remove the boolean facility fields
    await db.collection('properties').updateMany(
      {},
      {
        $unset: {
          cctv: "",
          communityHall: "",
          gym: "",
          masjid: "",
          parking: "",
          petsAllowed: "",
          swimmingPool: "",
          trainedGuard: ""
        }
      }
    );

    console.log('Removed boolean facility fields from all properties');
  }
};