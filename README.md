**AI Hub** is a full-stack web application that allows users to interact with different AI models, save conversations, and manage their own personal AI assistant experience. The app provides user authentication, persistent chat history, and a sleek modern UI using Angular and Ionic.

## 🚀 Features

- 🔐 User Authentication (via Firebase)
- 💬 Multi-model AI Chat Interface
- 🧠 Chat history saved in MongoDB (per user)
- 📱 Responsive UI built with Ionic Framework
- 📂 Organized project structure with clean modular code

---

## 🛠 Tech Stack

### 🔸 Frontend
- [Angular](https://angular.io/) (TypeScript)
- [Ionic](https://ionicframework.com/)
- [Axios](https://axios-http.com/) (API communication)

### 🔸 Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)

### 🔸 Authentication
- [Firebase Authentication](https://firebase.google.com/docs/auth)

### 🔸 Database
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud-hosted)

---

## 📁 Project Structure

```
AI-Hub/
├── ai-hub/
│   ├── backend/               # Express.js API
│   │   ├── models/            # Mongoose schemas for Chat and Conversation
│   │   ├── routes/            # API endpoints
│   │   └── server.js          # Entry point
│   └── frontend/              # Angular + Ionic application
├── .vscode/                   # Editor configuration
├── package.json               # Root package config
└── README.md
```

---
