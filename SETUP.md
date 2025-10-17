# WithUs Project Setup Guide

This guide will help you set up the WithUs farm-to-door delivery platform from scratch.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## Project Structure

```
WithUs-Project/
├── frontend/          # React TypeScript frontend
├── backend/           # FastAPI Python backend
├── README.md         # Project overview
├── SETUP.md          # This file
└── start.bat         # Quick start script
```

## Step 1: Backend Setup

### 1.1 Install Python Dependencies

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 1.2 Database Setup

1. **Install PostgreSQL** if you haven't already
2. **Create a database**:
   ```sql
   CREATE DATABASE withus_db;
   CREATE USER withus_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE withus_db TO withus_user;
   ```

3. **Create environment file**:
   ```bash
   cd backend
   cp env.example .env
   ```

4. **Edit `.env` file** with your database credentials:
   ```env
   DATABASE_URL=postgresql://withus_user:your_secure_password@localhost:5432/withus_db
   SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   HOST=0.0.0.0
   PORT=8000
   DEBUG=True
   ```

### 1.3 Initialize Database

```bash
cd backend
python init_db.py
```

This will create the database tables and add sample data.

### 1.4 Start Backend Server

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Step 2: Frontend Setup

### 2.1 Install Dependencies

```bash
cd frontend
npm install
```

### 2.2 Start Development Server

```bash
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000`


## Step 3: Test the Application

### 3.1 Backend API Testing

1. Visit `http://localhost:8000/docs` for interactive API documentation
2. Test the endpoints:
   - `GET /api/items` - List all items
   - `GET /api/items/1` - Get item details
   - `POST /api/auth/register` - Register a new user
   - `POST /api/auth/login` - Login user

### 3.2 Frontend Testing

1. Open `http://localhost:3000` in your browser
2. Browse the homepage
3. Register a new account
4. Browse items and categories
5. View item details
6. Place orders and write reviews

## Sample Data

The database comes pre-populated with sample farm-fresh items:

- **Fresh Fruits**: Mangoes, Apples, Bananas
- **Dairy Products**: Organic Milk, Fresh Curd
- **Beverages**: Coconut Water, Mineral Water
- **Vegetables**: Fresh seasonal produce

*Note: Default admin credentials are created during database initialization. Please change them immediately after first login.*

## Troubleshooting

### Backend Issues

1. **Database Connection Error**:
   - Check if PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Import Errors**:
   - Make sure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

3. **Port Already in Use**:
   - Change port in `.env` file
   - Kill process using port 8000

### Frontend Issues

1. **Node Modules Error**:
   - Delete `node_modules` folder
   - Run `npm install` again

2. **Port Already in Use**:
   - Change port in package.json or use `npm start -- --port 3001`

3. **API Connection Error**:
   - Ensure backend is running on `http://localhost:8000`
   - Check CORS settings in backend

## Development Workflow

1. **Backend Development**:
   - Edit files in `backend/` directory
   - Server auto-reloads on changes
   - Check logs in terminal

2. **Frontend Development**:
   - Edit files in `frontend/src/` directory
   - Browser auto-reloads on changes
   - Check browser console for errors

3. **Database Changes**:
   - Modify models in `backend/models.py`
   - Update schemas in `backend/schemas.py`
   - Re-run `python init_db.py` if needed

## Production Deployment

### Backend Deployment

1. Set `DEBUG=False` in `.env`
2. Use a production WSGI server like Gunicorn
3. Set up proper database credentials
4. Configure environment variables

### Frontend Deployment

1. Build the project: `npm run build`
2. Serve the `build/` folder with a web server
3. Configure API base URL for production

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Items
- `GET /api/items` - List all items
- `GET /api/items/{id}` - Get item details
- `GET /api/items/categories/list` - List categories

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/{user_id}` - Get user orders
- `GET /api/orders/{order_id}` - Get order details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/item/{item_id}` - Get item reviews
- `GET /api/reviews/user/{user_id}` - Get user reviews

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs in your terminal
3. Check the browser console for frontend errors
4. Verify all prerequisites are installed correctly

## Next Steps

Once the basic setup is working:

1. **Add more features**:
   - Payment integration
   - Real-time notifications
   - Admin dashboard
   - Image upload

2. **Improve UI/UX**:
   - Add animations
   - Improve mobile responsiveness
   - Add dark mode

3. **Enhance security**:
   - Input validation
   - Rate limiting
   - HTTPS setup

4. **Performance optimization**:
   - Database indexing
   - Caching
   - CDN for images 