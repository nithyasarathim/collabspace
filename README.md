# TeamUp

## About The Project

TeamUp is a collaborative platform designed to help users connect, manage projects, and work together effectively. It provides a comprehensive suite of tools for project management, communication, and task tracking, making it an ideal solution for students and teams. This platform facilitates seamless collaboration through features like project creation, task management with a Kanban board, real-time discussions, and a notification system for project-related updates.

## Built With

This project is built with a modern tech stack, utilizing the following technologies:

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web development.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Framer Motion**: A library for creating production-ready animations.
- **Socket.IO Client**: For real-time, bidirectional communication.

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A NoSQL database for storing project and user data.
- **Mongoose**: An object data modeling (ODM) library for MongoDB and Node.js.
- **Socket.IO**: Enables real-time, event-based communication.
- **JWT**: For securely transmitting information between parties as a JSON object.
- **Nodemailer**: A module for Node.js applications to allow easy email sending.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/your_username/TeamUp.git
   ```

2. Install NPM packages for both frontend and backend
   ```bash
   # For frontend
   cd TeamUp/frontend
   npm install

   # For backend
   cd ../backend
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the `backend` directory and add the following variables:
   ```plaintext
   MONGO_URI=mongodb://localhost:27017/TEAMUP-DATABASE
   PORT=8000
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd TeamUp/backend
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd TeamUp/frontend
   npm run dev
   ```

## Features

- **Project Management**: Create, manage, and track your projects with an intuitive interface.
- **Kanban Board**: Visualize your workflow with a drag-and-drop Kanban board for task management.
- **Real-time Discussion**: Collaborate with your team members in real-time through the project discussion feature.
- **Notifications**: Stay updated with notifications for project invites and other important events.
- **User Authentication**: Secure user authentication with JWT.
- **File Sharing**: Share and manage project-related files with your team.
- **Personal Task List**: Keep track of your personal to-dos and tasks.

## Folder Structure

```
TeamUp/
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Routers/
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .gitignore
    ├── package.json
    └── vite.config.js
```