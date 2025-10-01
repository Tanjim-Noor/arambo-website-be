import { Admin } from '../models/admin.model';
import { connectToDatabase, disconnectFromDatabase } from '../config/connection';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../config';

/**
 * Seed admin user into the database
 */
export const seedAdmin = async (): Promise<void> => {
  try {
    console.log('🌱 Starting admin seeding...');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME.toLowerCase() });
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Active: ${existingAdmin.isActive}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      return;
    }

    // Create new admin
    const admin = new Admin({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD, // Will be hashed automatically by pre-save middleware
      isActive: true
    });

    const savedAdmin = await admin.save();
    
    console.log('✅ Admin user created successfully');
    console.log(`   ID: ${savedAdmin.id}`);
    console.log(`   Username: ${savedAdmin.username}`);
    console.log(`   Active: ${savedAdmin.isActive}`);
    console.log(`   Created: ${savedAdmin.createdAt}`);
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    throw error;
  }
};

/**
 * Reset admin user (delete and recreate)
 */
export const resetAdmin = async (): Promise<void> => {
  try {
    console.log('🔄 Resetting admin user...');

    // Delete existing admin
    const deleteResult = await Admin.deleteMany({ username: ADMIN_USERNAME.toLowerCase() });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin(s)`);

    // Create new admin
    await seedAdmin();
    
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
    throw error;
  }
};

/**
 * Update admin password
 */
export const updateAdminPassword = async (newPassword: string): Promise<void> => {
  try {
    console.log('🔑 Updating admin password...');

    const admin = await Admin.findOne({ username: ADMIN_USERNAME.toLowerCase() });
    
    if (!admin) {
      throw new Error('Admin user not found');
    }

    admin.password = newPassword; // Will be hashed automatically by pre-save middleware
    await admin.save();
    
    console.log('✅ Admin password updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    throw error;
  }
};

/**
 * List all admins
 */
export const listAdmins = async (): Promise<void> => {
  try {
    console.log('📋 Listing all admins...');

    const admins = await Admin.find({});
    
    if (admins.length === 0) {
      console.log('   No admins found');
      return;
    }

    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.username}`);
      console.log(`      ID: ${admin.id}`);
      console.log(`      Active: ${admin.isActive}`);
      console.log(`      Created: ${admin.createdAt}`);
      console.log(`      Last Login: ${admin.lastLogin || 'Never'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error listing admins:', error);
    throw error;
  }
};

// Script execution when run directly
const runAdminSeed = async () => {
  try {
    await connectToDatabase();
    
    const action = process.argv[2];
    
    switch (action) {
      case 'reset':
        await resetAdmin();
        break;
      case 'list':
        await listAdmins();
        break;
      case 'update-password':
        const newPassword = process.argv[3];
        if (!newPassword) {
          throw new Error('Please provide new password as argument');
        }
        await updateAdminPassword(newPassword);
        break;
      default:
        await seedAdmin();
    }
    
  } catch (error) {
    console.error('❌ Admin seed script error:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
    console.log('🔌 Disconnected from database');
  }
};

// Run if called directly
if (require.main === module) {
  runAdminSeed();
}

export default seedAdmin;