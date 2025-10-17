# WithUs - Farm to Door Delivery Platform

A modern farm-to-door delivery platform specializing in fresh fruits, vegetables, dairy products, and beverages. Experience the convenience of having farm-fresh produce delivered right to your doorstep - fast, fresh, and hassle-free.

## 🚀 Features

- **Farm-Fresh Products**: Browse fresh fruits, vegetables, dairy, and beverages
- **Direct Farm Delivery**: Get produce delivered directly from farm to your door
- **Item Details & Reviews**: View detailed product information and customer reviews
- **Flexible Ordering**: Order items for delivery or schedule in-person services
- **User Management**: Complete authentication and order tracking system
- **Modern UI**: Responsive design with beautiful, intuitive interface

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
├── README.md         # Project overview
├── SETUP.md          # Detailed setup guide
└── start.bat         # Quick start script
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