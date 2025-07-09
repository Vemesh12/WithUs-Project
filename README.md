# WithUs - Consumable Items Platform

A Swiggy/Zomato-style platform for ordering consumable items like water, fruits, milk, etc. with delivery and in-person service options.

## 🚀 Features

- Browse consumable items (fruits, milk, water, etc.)
- View item details and customer reviews
- Order items for delivery or schedule in-person services
- User authentication and order management
- Responsive design with modern UI

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Python** with FastAPI
- **PostgreSQL** database
- **SQLAlchemy** ORM
- **JWT** authentication

## 📁 Project Structure

```
WithUs-Project/
├── frontend/          # React TypeScript frontend
├── backend/           # FastAPI Python backend
├── database/          # Database scripts and migrations
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📝 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. 