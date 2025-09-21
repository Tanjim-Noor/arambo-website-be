// Load environment variables
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Load and expand .env variables (allows ${VAR} interpolation)
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const config = {
  mongodb: {
    // The MongoDB connection URL
    // Can use env variables with interpolation like MONGODB_URI=${MONGODB_LOCAL_URI}
    url: process.env.MONGODB_URI || "mongodb://localhost:27017",

    // The name of the database
    databaseName: process.env.MONGODB_NAME || "arambo_properties",

    options: {
      useNewUrlParser: true,      // removes deprecation warning when connecting
      useUnifiedTopology: true,   // removes deprecation warning when connecting
      // connectTimeoutMS: 3600000, // optional: increase connection timeout to 1 hour
      // socketTimeoutMS: 3600000,  // optional: increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be relative or absolute
  // Store migration files inside your database folder
  migrationsDir: "src/database/migrations",

  // The mongodb collection where the applied migrations are stored
  changelogCollectionName: "migrations_changelog",

  // The mongodb collection where the lock will be created
  lockCollectionName: "migrations_changelog_lock",

  // The value in seconds for the TTL index that will be used for the lock.
  // Value of 0 will disable the feature.
  lockTtl: 0,

  // The file extension to create migrations and search for in migrations dir
  migrationFileExtension: ".js",

  // Enable the algorithm to create a checksum of the file contents
  // Requires that scripts are coded to be run multiple times
  useFileHash: false,

  // Module system for migration files: commonjs or esm
  moduleSystem: 'commonjs',
};

module.exports = config;
