#!/usr/bin/env python3
"""
Setup script for WithUs backend
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🚀 Setting up WithUs Backend...")
    
    # Check if Python is available
    if not run_command("python --version", "Checking Python version"):
        print("❌ Python is not available. Please install Python 3.8+")
        sys.exit(1)
    
    # Create virtual environment
    if not os.path.exists("venv"):
        if not run_command("python -m venv venv", "Creating virtual environment"):
            sys.exit(1)
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies"):
        sys.exit(1)
    
    # Initialize database
    if not run_command(f"{python_cmd} init_db.py", "Initializing database"):
        print("⚠️  Database initialization failed. You may need to set up PostgreSQL first.")
        print("   Please check your DATABASE_URL in the .env file.")
    
    print("\n🎉 Setup completed!")
    print("\n📝 Next steps:")
    print("1. Create a .env file with your database configuration")
    print("2. Run: python main.py")
    print("3. Visit: http://localhost:8000/docs for API documentation")

if __name__ == "__main__":
    main() 