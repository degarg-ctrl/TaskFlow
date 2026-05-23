# TaskFlow — MERN Task Manager with Auth

TaskFlow is a mobile task management application built using the full stack (React Native + Expo SDK 54, Node.js + Express, MongoDB + Mongoose), state management using Zustand, and per-user JWT authentication.

## Tech Stack
* **Frontend**: React Native, Expo SDK 54, Zustand, Axios, React Navigation, AsyncStorage
* **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, jsonwebtoken, bcryptjs

## Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas connection string

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the `.env.example` template and fill in your variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_signing_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Install dependencies from the root directory:
   ```bash
   npm install
   ```
2. Start the Expo application:
   ```bash
   npx expo start
   ```
