import mongoose from 'mongoose';
import { config } from '../../config';

// MongoDB connection options with best practices
const connectionOptions: mongoose.ConnectOptions = {
  // Connection pool settings
  maxPoolSize: 10, // Maximum number of connections in the connection pool
  minPoolSize: 5,  // Minimum number of connections in the connection pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  
  // Replica set settings
  retryWrites: true,
  retryReads: true,
};

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Connect to MongoDB
   */
  public async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        console.log('Database already connected');
        return;
      }

      console.log('Connecting to MongoDB...');
      
      await mongoose.connect(config.MONGODB_URI, connectionOptions);
      
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');
      
      // Set up event listeners
      this.setupEventListeners();
      
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw new Error(`Failed to connect to MongoDB: ${error}`);
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    try {
      if (!this.isConnected) {
        console.log('Database already disconnected');
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ MongoDB disconnection error:', error);
      throw error;
    }
  }

  /**
   * Check if database is connected
   */
  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get the mongoose connection instance
   */
  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }

  /**
   * Setup event listeners for connection monitoring
   */
  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error: Error) => {
      console.error('❌ Mongoose connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Mongoose reconnected to MongoDB');
      this.isConnected = true;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await this.disconnect();
        process.exit(0);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });
  }
}

// Export singleton instance
export const database = DatabaseConnection.getInstance();

// Export connection helper functions
export const connectToDatabase = () => database.connect();
export const disconnectFromDatabase = () => database.disconnect();
export const getDatabaseConnection = () => database.getConnection();
export const isDatabaseConnected = () => database.getConnectionStatus();