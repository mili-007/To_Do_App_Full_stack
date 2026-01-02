# To-Do App - Full Stack Application

A modern, feature-rich To-Do application built with React (TypeScript) frontend and Node.js/Express backend with MongoDB. This application demonstrates database relationships including One-to-Many, Many-to-One, and Many-to-Many relationships.

## 🚀 Features

### Core Features
- ✅ User Authentication (Register/Login)
- ✅ Create, Read, Update, Delete Todos
- ✅ Todo Priority Levels (Low, Medium, High)
- ✅ Due Date Management
- ✅ Todo Completion Status

### Advanced Features
- 📁 **Projects** - Organize todos into projects (One-to-Many relationship)
- 🏷️ **Categories** - Tag todos with multiple categories (Many-to-Many relationship)
- 💬 **Comments** - Add comments to todos for collaboration (One-to-Many relationship)
- 👥 **Sharing** - Share todos with other users (Many-to-Many relationship)
- 🎨 **Color Customization** - Custom colors for projects and categories

### Frontend Features
- 🎯 Route-based navigation
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔄 Redux for state management
- ⚡ Real-time updates

## 📁 Project Structure

```
To-Do-App/
├── todo-app-backend/          # Node.js/Express Backend
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   └── server.js         # Entry point
│   └── package.json
│
├── todo-app-frontend/         # React/TypeScript Frontend
│   ├── src/
│   │   ├── app/              # Redux store
│   │   ├── components/       # React components
│   │   ├── features/        # Redux slices & services
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── main.tsx         # Entry point
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd todo-app-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `todo-app-backend/`:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000` (or your specified PORT)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd todo-app-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URLs in service files if needed:
   - `src/features/todos/todoService.ts`
   - `src/features/projects/projectService.ts`
   - `src/features/categories/categoryService.ts`
   - `src/features/comments/commentService.ts`
   
   Default: `http://localhost:8003/api` (update to match your backend port)

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🗄️ Database Relationships

### One-to-Many (1:N)
- **Project → Todos**: One project has many todos
- **Todo → Comments**: One todo has many comments
- **User → Comments**: One user has many comments

### Many-to-One (N:1)
- **Todos → Project**: Many todos belong to one project
- **Comments → Todo**: Many comments belong to one todo
- **Comments → User**: Many comments belong to one user

### Many-to-Many (N:M)
- **Todos ↔ Categories**: Todos can have many categories, categories can have many todos
- **Users ↔ Todos (Sharing)**: Users can share todos with multiple other users

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Todos
- `GET /api/todos` - Get all todos (including shared)
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project with todos
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category with todos
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Comments
- `GET /api/todos/:todoId/comments` - Get comments for a todo
- `POST /api/todos/:todoId/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Create Projects**: Organize your work into projects
3. **Create Categories**: Tag your todos with categories
4. **Create Todos**: Add todos with projects, categories, and due dates
5. **Add Comments**: Collaborate by adding comments to todos
6. **Share Todos**: Share todos with other users (backend ready)

## 📖 Documentation

- [Database Relationships Guide](./DATABASE_RELATIONSHIPS.md)
- [Frontend Integration Guide](./FRONTEND_INTEGRATION_GUIDE.md)
- [Routing Guide](./ROUTING_GUIDE.md)

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected routes with middleware
- Input validation and sanitization

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Update CORS settings for your frontend domain
3. Deploy to platforms like:
   - Heroku
   - Railway
   - Render
   - AWS
   - DigitalOcean

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- MongoDB for the database
- React team for the amazing framework
- Express.js for the backend framework
- All open-source contributors

---

**Note**: Remember to never commit `.env` files or sensitive information to version control!

