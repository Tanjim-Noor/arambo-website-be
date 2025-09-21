# Arambo Website Backend

A modern Node.js + Express + TypeScript backend API for property listings with MongoDB integration.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── database/            # Database configuration and models
│   │   ├── config/          # MongoDB connection setup
│   │   │   └── connection.ts
│   │   ├── models/          # Mongoose schemas and models
│   │   │   └── property.model.ts
│   │   ├── seeds/           # Database seeding utilities
│   │   │   └── property.seed.ts
│   │   └── index.ts         # Database exports
│   ├── routes/              # API route definitions
│   │   └── property.routes.ts
│   ├── controllers/         # Request handlers
│   │   └── property.controller.ts
│   ├── services/            # Business logic & integrations
│   │   └── property.service.ts
│   ├── validators/          # Zod schemas for input validation
│   │   └── property.validator.ts
│   ├── middlewares/         # Error handling, etc.
│   │   └── error.middleware.ts
│   ├── config/              # Environment/config loader
│   │   └── index.ts
│   └── index.ts             # App entry point
├── docker/                  # Docker configuration
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── app.env
├── tests/                   # Unit/integration tests
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- MongoDB 5.0+ (local installation or Docker)
- Docker and Docker Compose (optional but recommended)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd arambo-website-be

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your MongoDB connection string:

```env
NODE_ENV=development
PORT=4000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/arambo_properties_dev

REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

### 3. MongoDB Setup

Choose one of the following options:

#### Option A: Local MongoDB Installation

1. **Install MongoDB:**
   - **Windows:** Download from https://www.mongodb.com/try/download/community
   - **macOS:** `brew install mongodb-community`
   - **Linux:** Follow official docs for your distribution

2. **Start MongoDB:**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS/Linux
   mongod --dbpath /path/to/your/data/directory
   
   # Or if installed via brew (macOS)
   brew services start mongodb-community
   ```

3. **Verify Connection:**
   ```bash
   mongosh mongodb://localhost:27017/arambo_properties_dev
   ```

#### Option B: MongoDB Docker Container

```bash
# Run MongoDB in Docker
docker run -d \
  --name arambo-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=arambo_properties_dev \
  -v mongodb_data:/data/db \
  mongo:7.0

# Verify connection
docker exec -it arambo-mongodb mongosh arambo_properties_dev
```

#### Option C: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arambo_properties?retryWrites=true&w=majority
   ```

### 4. Seed the Database (Optional)

```bash
# Add sample data to your database
npm run seed
```

### 5. Run the Application

#### Option A: Local Development

```bash
# Make sure MongoDB is running locally
# Start development server
npm run dev
```

#### Option B: Docker Compose (Recommended)

```bash
# Run everything with Docker
cd docker
docker compose up -d

# Or with development tools (MongoDB Express + Redis Commander):
#docker-compose --profile dev up --build
```

**Docker includes:**
- 🚀 Backend API (port 4000)
- 🍃 MongoDB (port 27017)
- 🔴 Redis (port 6379)
- 🌐 MongoDB Express - Database UI (port 8082) *dev profile only*
- 🔧 Redis Commander - Cache UI (port 8081) *dev profile only*

## 🗄️ Database Management

### MongoDB Commands

```bash
# Connect to database
mongosh mongodb://localhost:27017/arambo_properties_dev

# View collections
show collections

# View properties
db.properties.find().pretty()

# Count documents
db.properties.countDocuments()

# Create index for text search
db.properties.createIndex({ 
  "propertyName": "text", 
  "location": "text", 
  "notes": "text" 
})
```

### Database Seeding

```bash
# Seed with sample data
npm run seed

# Or use the service directly
npm run db:seed
```

## 📡 API Endpoints

### Base URL
- Local: `http://localhost:4000/api`
- Docker: `http://localhost:4000/api`

### Endpoints

#### Health Check
```http
GET /api/properties/health
```

#### Create Property
```http
POST /api/properties
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "propertyName": "Luxury Villa",
  "propertyType": "villa",
  "size": 2500,
  "location": "Downtown",
  "bedrooms": 4,
  "bathroom": 3,
  "baranda": true,
  "category": "sale",
  "notes": "Beautiful property with garden",
  "firstOwner": true,
  "paperworkUpdated": false,
  "onLoan": false
}
```

#### Get Properties
```http
GET /api/properties?category=sale&propertyType=villa&bedrooms=4&limit=10
```

**Query Parameters:**
- `category`: sale, rent, lease, buy
- `propertyType`: apartment, house, villa, townhouse, studio, duplex, penthouse, commercial, land, other
- `bedrooms`: number
- `minSize`: minimum size
- `maxSize`: maximum size
- `location`: location filter
- `firstOwner`: true/false
- `onLoan`: true/false
- `limit`: 1-100 (default: 10)
- `offset`: pagination offset (default: 0)

#### Get Property by ID
```http
GET /api/properties/:id
```

#### Update Property
```http
PUT /api/properties/:id
Content-Type: application/json

{
  "propertyName": "Updated Villa Name",
  "size": 2600
}
```

#### Get Property Statistics
```http
GET /api/properties/stats
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 🛠️ Development

### Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm start          # Start production server
npm test           # Run tests
npm run lint       # Lint code
npm run lint:fix   # Fix linting issues
```

### Code Structure

- **Database** (`/database`): MongoDB models, connection config, seeds
- **Routes** (`/routes`): Define API endpoints and route parameters
- **Controllers** (`/controllers`): Handle HTTP requests/responses, validate input
- **Services** (`/services`): Business logic, database operations
- **Validators** (`/validators`): Zod schemas for type-safe validation
- **Middlewares** (`/middlewares`): Error handling, logging, authentication
- **Config** (`/config`): Environment variables and app configuration

### Adding New Features

1. **Add Zod Schema** in `/validators`
2. **Create Mongoose Model** in `/database/models`
3. **Create Service Function** in `/services`
4. **Implement Controller** in `/controllers`
5. **Define Routes** in `/routes`
6. **Add Tests** in `/tests`

## 🐳 Docker Usage

### Development with Docker

```bash
# Build and run with logs
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Production Deployment

```bash
# Update production environment
cp docker/app.env docker/app.prod.env
# Edit app.prod.env with production values

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `4000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `REDIS_URL` | Redis connection URL | No | `redis://localhost:6379` |
| `CORS_ORIGIN` | Allowed CORS origins | No | `*` |

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Zod schemas
- **Error Handling**: Centralized error management
- **Request Logging**: Morgan HTTP request logger

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:4000/api/properties/health
```

### Redis Commander (Development)
Access Redis UI at: http://localhost:8081

### MongoDB Express (Development)
Access MongoDB UI at: http://localhost:8082

### Logs
```bash
# Docker logs
docker-compose logs -f backend

# Local logs
tail -f logs/app.log
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   ```
   Error: Failed to connect to MongoDB
   ```
   - Verify MONGODB_URI in environment
   - Ensure MongoDB is running locally or accessible
   - Check network connectivity for cloud databases
   - Verify authentication credentials

2. **Database Validation Errors**
   ```
   ValidationError: Property validation failed
   ```
   - Check required fields in request body
   - Verify data types match schema
   - Review Mongoose model validation rules

3. **Redis Connection Issues**
   ```
   Error: Redis connection refused
   ```
   - Start Redis server: `redis-server`
   - Check REDIS_URL in environment
   - Ensure Redis container is running in Docker

4. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::4000
   ```
   - Change PORT in `.env`
   - Kill process using port: `lsof -ti:4000 | xargs kill`

5. **TypeScript Compilation Errors**
   ```bash
   # Clear and rebuild
   rm -rf dist node_modules
   npm install
   npm run build
   ```

6. **Docker Issues**
   ```bash
   # Rebuild containers
   docker-compose down
   docker-compose up --build

   # Clear volumes if database issues persist
   docker-compose down -v
   docker-compose up --build
   ```

### Debug Mode

```bash
# Enable detailed logging
NODE_ENV=development npm run dev

# Or with debug flag
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For support, email support@arambo.com or create an issue on GitHub.

---

**Built with ❤️ by the Arambo Team**