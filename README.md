# 📚 ReadingHub – A Personal Digital Library Manager

## 🔗 Live Demo

**Frontend:** [https://capstone-sem3-j7sk.vercel.app/](https://capstone-sem3-j7sk.vercel.app/)
**Backend:** [(Add your backend API link here)](https://capstone-sem3-3v88.onrender.com/)

---

## 📌 Overview

ReadingHub is a full-stack web application that enables readers to manage their personal digital library. It replaces handwritten logs and spreadsheets with an interactive system to track reading progress, add notes, and organize books efficiently.

---

## 🧠 Problem Statement

Book lovers often struggle to keep track of what they have read, are currently reading, or plan to read. Manual tracking is inefficient and prone to loss. ReadingHub solves this by offering a seamless platform to:

* Organize reading lists
* Track reading goals and progress
* Add notes and reviews
* Access reading history anytime, anywhere

---

## 🏗️ System Architecture

```
User → React Frontend → Express.js API → MongoDB Atlas
```

### Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Frontend       | React.js, React Router, Axios, TailwindCSS  |
| Backend        | Node.js, Express.js                         |
| Database       | MongoDB Atlas                               |
| Authentication | JWT (JSON Web Tokens)                       |
| Deployment     | Frontend: Vercel, Backend: Render / Railway |

---

## ✨ Key Features

| Category          | Features                                                       |
| ----------------- | -------------------------------------------------------------- |
| Authentication    | Signup, Login, Logout using JWT                                |
| Book Management   | Add, Edit, View, Delete Books (CRUD)                           |
| Progress Tracking | Pages read, status updates (To Read / In Progress / Completed) |
| Notes & Reviews   | Write personal book notes or summaries                         |
| Search & Filter   | Search by title, author, genre; filter by status               |
| Sorting           | Sort by name, author, or date added                            |
| Routing           | Fully protected pages using React Router                       |
| Hosting           | Deployed frontend & backend with cloud database                |

---

## 🔐 Authentication

* Secure login/signup using JSON Web Tokens
* User data isolation
* Authorization middleware to protect private endpoints

---

## 📡 API Endpoints

| Endpoint            | Method | Description             | Access |
| ------------------- | ------ | ----------------------- | ------ |
| `/api/auth/signup`  | POST   | Register new user       | Public |
| `/api/auth/login`   | POST   | Login and receive token | Public |
| `/api/books`        | GET    | Get all user books      | Auth   |
| `/api/books/:id`    | GET    | Get book by ID          | Auth   |
| `/api/books`        | POST   | Add new book            | Auth   |
| `/api/books/:id`    | PUT    | Update book details     | Auth   |
| `/api/books/:id`    | DELETE | Delete book             | Auth   |
| `/api/books/search` | GET    | Search or filter books  | Auth   |

---

## 📁 Project Structure

### Frontend

```
src/
 ├─ components/
 ├─ pages/
 ├─ routes/
 ├─ context/
 ├─ services/
 └─ App.jsx
```

### Backend

```
backend/
 ├─ controllers/
 ├─ routes/
 ├─ models/
 ├─ middleware/
 ├─ config/
 └─ server.js
```

---

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/readinghub.git
cd readinghub
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret
PORT=5000
```

Run backend:

```bash
npm run dev
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment Details

| Component | Platform         |
| --------- | ---------------- |
| Frontend  | Vercel           |
| Backend   | Render / Railway |
| Database  | MongoDB Atlas    |

---

## 🧩 Future Enhancements

* Reading analytics & charts
* Book cover uploads
* Export data (CSV/PDF)
* Social sharing & friend libraries
* Mobile responsiveness improvements
* Dark/light mode

---

## 🙌 Credits

Developed by **Prince Singh**
Stack: MERN (MongoDB, Express.js, React.js, Node.js)

---

## 📄 License

Open for educational and personal use.

---
