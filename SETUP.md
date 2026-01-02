# Quick Setup Guide

## First Time Setup

### Backend Setup

1. Navigate to backend:
```bash
cd todo-app-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

4. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd todo-app-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URLs in service files to match your backend port:
   - Default backend port: `5000`
   - Update in: `src/features/*/.*Service.ts` files
   - Change `http://localhost:8003` to `http://localhost:5000`

4. Start development server:
```bash
npm run dev
```

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/todo-app`

### Option 2: MongoDB Atlas (Cloud)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Replace `<password>` with your password
5. Use in `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app`

## Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify `.env` file exists
- Check if port is already in use

### Frontend can't connect to backend
- Verify backend is running
- Check CORS settings
- Update API URLs in service files

### Authentication errors
- Check JWT_SECRET in `.env`
- Verify token is being sent in requests

