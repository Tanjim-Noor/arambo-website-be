const fs = require('fs');
const path = require('path');

/**
 * Parse CSV data and convert to property seed format
 */
function parseCSVData() {
  const csvFilePath = 'D:\\Ahnaf Projects\\Visual_Studio_Code\\Rubik Cube\\arambo-website-be\\csv\\Properties for Rent 235541e1499380aabc92e0d585df7438_all.csv';
  
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
    
    console.log('Headers found:', headers);
    
    const properties = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handling commas inside quotes)
      const values = parseCSVLine(line);
      if (values.length < headers.length) continue;
      
      const property = {};
      headers.forEach((header, index) => {
        property[header] = values[index] ? values[index].replace(/"/g, '').trim() : '';
      });
      
      // Skip empty rows
      if (!property.ID || property.ID === '') continue;
      
      properties.push(property);
    }
    
    console.log(`Parsed ${properties.length} properties from CSV`);
    return properties;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return [];
  }
}

/**
 * Parse a CSV line handling commas inside quotes
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Convert CSV property to seed format
 */
function convertToSeedFormat(csvProperty) {
  // Helper function to clean and parse numeric values
  const parseNumber = (value) => {
    if (!value || value === '') return 0;
    const cleaned = value.replace(/[",]/g, '');
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function to parse date
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === '') return new Date();
    try {
      return new Date(dateStr);
    } catch {
      return new Date();
    }
  };

  // Helper function to generate email from name
  const generateEmail = (name, id) => {
    if (!name || name === '') return `owner${id}@example.com`;
    return name.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '.')
      + '@example.com';
  };

  // Helper function to clean phone number
  const cleanPhone = (phone) => {
    if (!phone || phone === '') return '01700000000';
    return phone.replace(/[^\d]/g, '');
  };

  // Helper function to convert furnishing status
  const convertFurnishingStatus = (status) => {
    if (!status) return 'Non-Furnished';
    switch (status.toLowerCase()) {
      case 'furnished': return 'Furnished';
      case 'semi-furnished': return 'Semi-Furnished';
      case 'non-furnished': return 'Non-Furnished';
      default: return 'Non-Furnished';
    }
  };

  // Helper function to convert boolean from Yes/No
  const convertBoolean = (value) => {
    return value && value.toLowerCase() === 'yes';
  };

  // Split images string into array
  const parseImages = (imagesStr) => {
    if (!imagesStr || imagesStr === '') return [];
    return imagesStr.split(',')
      .map(img => img.trim())
      .filter(img => img !== '')
      .slice(0, 10); // Limit to 10 images
  };

  const ownerName = csvProperty['Owner Poc Name'] || 'Property Owner';
  const propertyId = csvProperty.ID || 'PROP-001';

  return {
    name: ownerName,
    email: generateEmail(ownerName, propertyId),
    phone: cleanPhone(csvProperty['Owner Poc Phone']),
    propertyName: `Property ${propertyId}`,
    listingType: 'For Rent',
    propertyType: 'Apartment', // Default since CSV doesn't have detailed property type
    size: parseNumber(csvProperty['SQ.FT']),
    location: csvProperty['Full Address'] || 'Dhaka, Bangladesh',
    bedrooms: parseNumber(csvProperty.Bedroom),
    bathroom: parseNumber(csvProperty.Bathroom),
    baranda: parseNumber(csvProperty.Veranda),
    category: convertFurnishingStatus(csvProperty['Furnishing Status']),
    notes: `Property listing for ${propertyId}`,
    firstOwner: true, // Default
    lift: convertBoolean(csvProperty.Lift),
    isConfirmed: false, // Default
    paperworkUpdated: true, // Default
    onLoan: false, // Default
    
    // New fields from CSV
    houseId: propertyId,
    streetAddress: csvProperty['Full Address'] || '',
    landmark: '', // Not in CSV
    area: csvProperty.Area || '',
    listingId: propertyId,
    inventoryStatus: csvProperty['Inventory Status'] || 'Looking for Rent',
    tenantType: csvProperty['Tenant Type'] || 'Family',
    propertyCategory: csvProperty['Property Category'] || 'Residential',
    furnishingStatus: convertFurnishingStatus(csvProperty['Furnishing Status']),
    availableFrom: parseDate(csvProperty['Available From']),
    floor: parseNumber(csvProperty.Floor),
    totalFloor: parseNumber(csvProperty['Total Floor']),
    yearOfConstruction: parseNumber(csvProperty['Year of Construction']),
    rent: parseNumber(csvProperty.Rent),
    serviceCharge: parseNumber(csvProperty['Service Charge']),
    advanceMonths: parseNumber(csvProperty['Advance, Months']),
    cleanHygieneScore: parseNumber(csvProperty['Clean & Hygiene Score']),
    sunlightScore: parseNumber(csvProperty['Sunlight Score']),
    bathroomConditionsScore: parseNumber(csvProperty['Bathroom Conditions']),
    coverImage: csvProperty['Cover Image'] || '',
    otherImages: parseImages(csvProperty.Images)
  };
}

/**
 * Generate TypeScript seed file content
 */
function generateSeedFileContent(properties) {
  const seedProperties = properties.map(convertToSeedFormat);
  
  let content = `import { Property } from '../models/property.model';
import { connectToDatabase, disconnectFromDatabase } from '../config/connection';

/**
 * Property data parsed from CSV for seeding the database
 * Generated from: Properties for Rent CSV data
 */
const sampleProperties = [
`;

  seedProperties.forEach((prop, index) => {
    content += `  {\n`;
    content += `    name: '${prop.name.replace(/'/g, "\\'")}',\n`;
    content += `    email: '${prop.email}',\n`;
    content += `    phone: '${prop.phone}',\n`;
    content += `    propertyName: '${prop.propertyName.replace(/'/g, "\\'")}',\n`;
    content += `    listingType: '${prop.listingType}',\n`;
    content += `    propertyType: '${prop.propertyType}',\n`;
    content += `    size: ${prop.size},\n`;
    content += `    location: '${prop.location.replace(/'/g, "\\'")}',\n`;
    content += `    bedrooms: ${prop.bedrooms},\n`;
    content += `    bathroom: ${prop.bathroom},\n`;
    content += `    baranda: ${prop.baranda},\n`;
    content += `    category: '${prop.category}',\n`;
    content += `    notes: '${prop.notes.replace(/'/g, "\\'")}',\n`;
    content += `    firstOwner: ${prop.firstOwner},\n`;
    content += `    lift: ${prop.lift},\n`;
    content += `    isConfirmed: ${prop.isConfirmed},\n`;
    content += `    paperworkUpdated: ${prop.paperworkUpdated},\n`;
    content += `    onLoan: ${prop.onLoan},\n`;
    content += `    \n`;
    content += `    // New fields from CSV data\n`;
    content += `    houseId: '${prop.houseId}',\n`;
    content += `    streetAddress: '${prop.streetAddress.replace(/'/g, "\\'")}',\n`;
    content += `    landmark: '${prop.landmark}',\n`;
    content += `    area: '${prop.area}',\n`;
    content += `    listingId: '${prop.listingId}',\n`;
    content += `    inventoryStatus: '${prop.inventoryStatus}',\n`;
    content += `    tenantType: '${prop.tenantType}',\n`;
    content += `    propertyCategory: '${prop.propertyCategory}',\n`;
    content += `    furnishingStatus: '${prop.furnishingStatus}',\n`;
    content += `    availableFrom: new Date('${prop.availableFrom.toISOString()}'),\n`;
    content += `    floor: ${prop.floor},\n`;
    content += `    totalFloor: ${prop.totalFloor},\n`;
    content += `    yearOfConstruction: ${prop.yearOfConstruction},\n`;
    content += `    rent: ${prop.rent},\n`;
    content += `    serviceCharge: ${prop.serviceCharge},\n`;
    content += `    advanceMonths: ${prop.advanceMonths},\n`;
    content += `    cleanHygieneScore: ${prop.cleanHygieneScore},\n`;
    content += `    sunlightScore: ${prop.sunlightScore},\n`;
    content += `    bathroomConditionsScore: ${prop.bathroomConditionsScore},\n`;
    content += `    coverImage: '${prop.coverImage}',\n`;
    content += `    otherImages: [\n`;
    prop.otherImages.forEach(img => {
      content += `      '${img}',\n`;
    });
    content += `    ]\n`;
    content += `  }${index < seedProperties.length - 1 ? ',' : ''}\n`;
  });

  content += `];

/**
 * Seed the database with sample property data
 */
export async function seedProperties(): Promise<void> {
  try {
    console.log('🌱 Starting property seeding...');
    
    await connectToDatabase();
    
    // Clear existing properties
    await Property.deleteMany({});
    console.log('🧹 Cleared existing properties');
    
    // Insert sample properties
    const createdProperties = await Property.insertMany(sampleProperties);
    console.log(\`✅ Seeded \${createdProperties.length} properties successfully\`);
    
    // Display summary
    console.log('📊 Property seeding summary:');
    console.log(\`   - Total properties: \${createdProperties.length}\`);
    
    // Group by area
    const areaGroups = createdProperties.reduce((groups: any, property: any) => {
      const area = property.area || 'No Area';
      groups[area] = (groups[area] || 0) + 1;
      return groups;
    }, {});
    
    console.log('📍 Properties by area:');
    Object.entries(areaGroups).forEach(([area, count]) => {
      console.log(\`   - \${area}: \${count}\`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    throw error;
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Run seeding if this file is executed directly
 */
if (require.main === module) {
  seedProperties()
    .then(() => {
      console.log('🎉 Property seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Property seeding failed:', error);
      process.exit(1);
    });
}
`;

  return content;
}

// Run the script
console.log('🚀 Starting CSV to Seed conversion...');
const properties = parseCSVData();

if (properties.length > 0) {
  const seedContent = generateSeedFileContent(properties);
  
  // Write to new seed file
  const outputPath = 'D:\\Ahnaf Projects\\Visual_Studio_Code\\Rubik Cube\\arambo-website-be\\src\\database\\seeds\\property.seed.ts';
  fs.writeFileSync(outputPath, seedContent, 'utf-8');
  
  console.log(`✅ Generated new seed file with ${properties.length} properties`);
  console.log(`📁 Saved to: ${outputPath}`);
} else {
  console.log('❌ No properties found in CSV file');
}