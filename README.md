# Arambo Website Backend

A modern Node.js + Express + TypeScript backend API for property listings with Notion integration.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── routes/              # API route definitions
│   │   └── property.routes.ts
│   ├── controllers/         # Request handlers
│   │   └── property.controller.ts
│   ├── services/            # Business logic & integrations
│   │   └── notion.service.ts
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
- Docker and Docker Compose (optional)
- Notion account with integration token

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd arambo-website-be/backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your actual values:

```env
NODE_ENV=development
PORT=4000

# Get these from your Notion integration
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here

REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

### 3. Notion Setup

1. **Create a Notion Integration:**
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Give it a name (e.g., "Arambo Property API")
   - Copy the "Internal Integration Token"

2. **Create a Notion Database:**
   - Create a new page in Notion
   - Add a database with these properties:
     - `Name` (Title)
     - `Email` (Email)
     - `Phone` (Phone)
     - `PropertyName` (Text)
     - `PropertyType` (Select: Apartment, House, Villa, etc.)
     - `Size` (Number)
     - `Location` (Text)
     - `Bedrooms` (Number)
     - `Bathroom` (Number)
     - `Baranda` (Checkbox)
     - `Category` (Select: Sale, Rent, Lease, Buy)
     - `Notes` (Text)
     - `FirstOwner` (Checkbox)
     - `PaperworkUpdated` (Checkbox)
     - `OnLoan` (Checkbox)

3. **Share Database with Integration:**
   - Click "Share" on your database
   - Invite your integration
   - Copy the database ID from the URL

### 4. Run the Application

#### Option A: Local Development

```bash
# Start Redis (if not using Docker)
# Install Redis: https://redis.io/download

# Start development server
npm run dev
```

#### Option B: Docker Compose (Recommended)

```bash
# Update docker/app.env with your Notion credentials
# Then run:
cd docker
docker-compose up --build

# Or with Redis Commander UI:
docker-compose --profile dev up --build
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

- **Routes** (`/routes`): Define API endpoints and route parameters
- **Controllers** (`/controllers`): Handle HTTP requests/responses, validate input
- **Services** (`/services`): Business logic, external API calls (Notion)
- **Validators** (`/validators`): Zod schemas for type-safe validation
- **Middlewares** (`/middlewares`): Error handling, logging, authentication
- **Config** (`/config`): Environment variables and app configuration

### Adding New Features

1. **Add Zod Schema** in `/validators`
2. **Create Service Function** in `/services`
3. **Implement Controller** in `/controllers`
4. **Define Routes** in `/routes`
5. **Add Tests** in `/tests`

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
| `NOTION_TOKEN` | Notion integration token | Yes | - |
| `NOTION_DATABASE_ID` | Notion database ID | Yes | - |
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

### Logs
```bash
# Docker logs
docker-compose logs -f backend

# Local logs
tail -f logs/app.log
```

## 🚨 Troubleshooting

### Common Issues

1. **Notion API Errors**
   ```
   Error: Notion API Error - Check your NOTION_TOKEN and NOTION_DATABASE_ID
   ```
   - Verify integration token
   - Ensure database is shared with integration
   - Check database property names match expected schema

2. **Redis Connection Issues**
   ```
   Error: Redis connection refused
   ```
   - Start Redis server: `redis-server`
   - Check REDIS_URL in environment
   - Ensure Redis container is running in Docker

3. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::4000
   ```
   - Change PORT in `.env`
   - Kill process using port: `lsof -ti:4000 | xargs kill`

4. **TypeScript Compilation Errors**
   ```bash
   # Clear and rebuild
   rm -rf dist node_modules
   npm install
   npm run build
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