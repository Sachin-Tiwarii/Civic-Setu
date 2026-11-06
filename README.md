# CivicSetu

CivicSetu is a web-based civic issue reporting platform that allows citizens to report local problems, track complaints, and help improve their communities.

## Features

- User registration and login
- Report civic issues with images as evidence
- Location-based complaint reporting
- Track complaint status
- Explore reported issues
- Admin dashboard for complaint management
- Leaderboard for citizen participation

## Tech Stack

**Frontend:** React, Vite, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Image Storage:** Cloudinary  
**Deployment:** Vercel, Render

## Installation

Clone the repository:

```bash
git clone https://github.com/Sachin-Tiwarii/Civic-Setu.git
cd Civic-Setu
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Run Locally

Start the backend:

```bash
cd backend
npm start
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

## Live Demo

[Visit CivicSetu](https://civicsetuu.vercel.app)

## License

This project is open-source and available for learning and development purposes.
