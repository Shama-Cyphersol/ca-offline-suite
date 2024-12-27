# Cyphersol ATS

CypherSol Desktop application built with React, Electron, and FastApi.

## Quick Start
Prerequisites: Node.js, Python 3.8+

The Root folder contains 2 main folders which are of interest.
1. Backend - contains FashApi code
2. Frontend - contains React app and a Electron folder which contains Electron app


```bash
# Backend setup
cd backend
python -m venv venv
source venv/Scripts/activate

## This will install fastapi and other backend dependencies in the root directory
pip install -r requirements.txt

# move to root folder
cd ..

# Frontend & Electron setup
npm install  # Install electron and concurrently dependencies in the base directory
cd frontend/react-app && npm install && cd ..  # Install react dependencies and move back to root

# Start app, this will automatically start all 3 things at once - FastApi, React and Electron.
npm start
```

Runs on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
