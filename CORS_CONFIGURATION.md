# CORS Configuration for MIVPS Backend

## Frontend Configuration ✅ COMPLETED

The frontend is now configured with:
- **Base URL**: `https://app.mivips.com/api`
- **CORS Support**: `withCredentials: true`
- **Headers**: `Content-Type: application/json`, `Accept: application/json`

## Backend CORS Configuration Required

Your backend server at `https://app.mivips.com` needs to be configured to allow CORS requests.

### 1. Express.js with CORS Middleware (Recommended)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Install cors: npm install cors

// Enable CORS for all routes
app.use(cors({
  origin: [
    'https://app.mivips.com',           // Production frontend
    'http://localhost:5173',            // Vite dev server
    'http://localhost:4000',            // Alternative dev server
    'https://localhost:5173',           // HTTPS dev server
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Origin'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Handle preflight requests
app.options('*', cors());
```

### 2. Manual CORS Headers (Alternative)

```javascript
app.use((req, res, next) => {
  // Allow multiple origins
  const allowedOrigins = [
    'https://app.mivips.com',
    'http://localhost:5173',
    'http://localhost:4000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
```

### 3. Specific Route CORS (For API endpoints)

```javascript
// Admin login with CORS
app.post('/api/user/admin-login', cors({
  origin: ['https://app.mivips.com', 'http://localhost:5173'],
  credentials: true
}), async (req, res) => {
  // Your admin login logic
});

// Student login with CORS
app.post('/api/user/student-login', cors({
  origin: ['https://app.mivips.com', 'http://localhost:5173'],
  credentials: true
}), async (req, res) => {
  // Your student login logic
});

// Students data with CORS
app.get('/api/students', cors({
  origin: ['https://app.mivips.com', 'http://localhost:5173'],
  credentials: true
}), async (req, res) => {
  // Your students data logic
});
```

### 4. Nginx Configuration (If using Nginx as reverse proxy)

```nginx
server {
    listen 443 ssl;
    server_name app.mivips.com;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' 'https://app.mivips.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://app.mivips.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    location /api {
        proxy_pass http://localhost:5000;  # Your backend server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## API Endpoints Configuration

### Required Backend Endpoints:

1. **Admin Login**: `POST /api/user/admin-login`
2. **Student Login**: `POST /api/user/student-login`
3. **Students Data**: `GET /api/students?page=1&limit=10`
4. **Add Student**: `POST /api/addStudent`

### Expected Response Format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## Testing CORS Configuration

### 1. Browser Console Test:
```javascript
fetch('https://app.mivips.com/api/user/admin-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### 2. cURL Test:
```bash
curl -X POST https://app.mivips.com/api/user/admin-login \
  -H "Content-Type: application/json" \
  -H "Origin: https://app.mivips.com" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Common CORS Issues:

1. **"Access-Control-Allow-Origin" header missing**
   - Solution: Add CORS middleware to backend

2. **Preflight request failed**
   - Solution: Handle OPTIONS requests properly

3. **Credentials not included**
   - Solution: Set `credentials: true` in CORS config

4. **Multiple origins not working**
   - Solution: Check origin array configuration

### Environment Variables:

Create `.env` file for different environments:

```bash
# Development
VITE_APP_ENDPOINT=http://localhost:5000/api

# Production
VITE_APP_ENDPOINT=https://app.mivips.com/api
```

## Security Considerations

1. **HTTPS Only**: Use HTTPS in production
2. **Specific Origins**: Only allow trusted domains
3. **Credentials**: Only enable when necessary
4. **Headers**: Only allow required headers
5. **Methods**: Only allow required HTTP methods
