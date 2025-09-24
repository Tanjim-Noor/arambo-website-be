# Codebase Documentation

This document contains technical documentation for the Arambo Property API codebase, including utility scripts, development tools, and maintenance procedures.

## Table of Contents

1. [Database Scripts](#database-scripts)
2. [Migration Tools](#migration-tools)
3. [Development Utilities](#development-utilities)
4. [Maintenance Procedures](#maintenance-procedures)

## Database Scripts

### examine-data.js

**Location**: `src/database/scripts/examine-data.js`

**Purpose**: This script is used to examine the current structure and content of property data in the MongoDB database. It's particularly useful for understanding data before and after migrations, debugging data issues, and validating database state.

**Use Cases**:
- **Pre-migration analysis**: Run before migrations to understand current data structure
- **Post-migration validation**: Verify that migrations completed successfully
- **Data debugging**: Investigate data inconsistencies or unexpected values
- **Schema validation**: Check if data conforms to expected schema
- **Data exploration**: Understand the distribution of values in different fields

**What it checks**:
- Total document count in the properties collection
- Sample documents with key field values
- Distinct values for `propertyType` and `listingType` fields
- Documents that need migration (missing required fields)
- Data distribution and patterns

**Example Output**:
```
Connected to MongoDB

Total documents: 8

Sample documents:

Document 1:
  propertyType: "apartment"
  listingType: "for Sale"
  propertyName: "Luxury Apartment in Downtown"
  category: "sale"

Document 2:
  propertyType: "house"
  listingType: "for Rent"
  propertyName: "Cozy Family House"
  category: "rent"

Distinct propertyType values: ["apartment","house","villa"]
Distinct listingType values: ["for Rent","for Sale"]

Documents that need migration: 0
```

**How to run**:
```bash
node src/database/scripts/examine-data.js
```

**Prerequisites**:
- MongoDB container must be running
- Environment variables properly configured
- Node.js dependencies installed

**When to use**:
- Before running any database migrations
- After completing migrations to validate results
- When investigating data quality issues
- During development to understand current data state
- Before making schema changes

## Migration Tools

### validate-migration.js

**Location**: `src/database/scripts/validate-migration.js`

**Purpose**: Comprehensive validation script that checks the success and integrity of database migrations, particularly for the property schema refactoring.

**Use Cases**:
- Validate migration completion
- Check data consistency post-migration
- Verify index creation
- Identify any data anomalies

## Development Utilities

### Database Connection

All database scripts use the following connection pattern:
```javascript
const client = new MongoClient('mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin');
```

This connects to the local MongoDB instance running in Docker with the credentials defined in the docker-compose configuration.

### Environment Setup

Scripts automatically load environment variables using:
```javascript
require('dotenv').config();
```

Make sure your `.env` file is properly configured with MongoDB connection details.

## Maintenance Procedures

### Regular Data Health Checks

1. **Weekly Data Validation**:
   ```bash
   node src/database/scripts/examine-data.js
   ```

2. **Post-deployment Validation**:
   ```bash
   npm run migrate:status
   node src/database/scripts/validate-migration.js
   ```

3. **Data Backup Before Major Changes**:
   ```bash
   mongodump --host localhost:27017 --db arambo_properties --out backup/$(date +%Y%m%d)
   ```

### Troubleshooting Database Issues

1. **Check Connection**:
   - Verify Docker containers are running: `docker ps`
   - Test database connectivity using examine-data script

2. **Validate Schema**:
   - Run examine-data to check field distributions
   - Look for unexpected null values or data types

3. **Migration Issues**:
   - Check migration status: `npm run migrate:status`
   - Review migration logs for errors
   - Use rollback if necessary: `npm run migrate:down`

### Best Practices

1. **Before Schema Changes**:
   - Always run `examine-data.js` to understand current state
   - Create database backup
   - Test migrations on development data first

2. **After Schema Changes**:
   - Run validation scripts to ensure success
   - Check API endpoints to verify functionality
   - Monitor application logs for any issues

3. **Data Integrity**:
   - Regularly validate enum values match schema definitions
   - Check for orphaned or malformed data
   - Ensure indexes are properly created and utilized

## Script Dependencies

All database scripts require:
- `mongodb` npm package
- `dotenv` for environment variable loading
- Proper network access to MongoDB instance
- Valid authentication credentials

## Error Handling

Common issues and solutions:

1. **Connection Errors**: Check if MongoDB container is running and credentials are correct
2. **Permission Errors**: Ensure the MongoDB user has proper read/write permissions
3. **Schema Validation Errors**: Use examine-data to identify data that doesn't match expected schema
4. **Migration Failures**: Check migration logs and consider rollback options

---

**Last Updated**: September 24, 2025  
**Maintainer**: Development Team