# 📝 SkillSail Notes API

A powerful and feature-rich Notes API built with **Node.js**, **Express**, and **MongoDB**. This project showcases real-world API design with advanced features like full-text search, tagging, archiving, exporting notes as PDF/ZIP, and analytics.

---

## 🌐 Live Demo

Check out the live API: [https://notes-api-a6e8.onrender.com/api-docs/](https://notes-api-a6e8.onrender.com/api-docs/)

[![Live Demo](https://img.shields.io/badge/-LIVE_DEMO-2ea44f?style=for-the-badge)](https://notes-api-a6e8.onrender.com/api-docs/)

## 🚀 Features

### 📌 Core Features

- ✍️ **Create, Read, Update, Delete** notes (CRUD)
- 🔐 **JWT Authentication & Authorization**
- 🧑‍💼 **User Registration/Login**

### 🧠 Utility & UX Enhancements

- 🔍 **Search** by title or content
- 🗃️ **Pagination**
- 🏷️ **Tagging system** & **Filter by tag**

### 🔐 Security & Stability

- 🧼 **Soft Delete / Archive Notes**
- ⏳ **Rate Limiting** (with `express-rate-limit`)

### 📦 Pro-Level Add-ons

- 📄 **Export note as PDF**
- 🗂️ **Export all notes as a ZIP of PDFs**
- 📊 **Analytics:** total notes, most used tags, archived count

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Auth:** JWT
- **PDF/ZIP Export:** PDFKit, Archiver
- **Rate Limit:** express-rate-limit
- **Docs:** Swagger / OpenAPI

---

## 🔐 API Authentication

All protected routes use JWT. Attach token via:

`Authorization: Bearer <your_token>`

---

## 📁 Project Structure

```
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── types/
├── app.ts
└── index.ts
```

---

## 📦 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/notes-api.git
cd notes-api
npm install
```

### 2. Set Environment Variables

Create a .env file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 3. Run Server

```bash
# Dev mode
npm run dev

# Production
npm run build && npm start

```

## 🛠️ API Endpoints (Brief)

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| POST   | `/api/auth/register`         | Register new user       |
| POST   | `/api/auth/login`            | Login user              |
| GET    | `/api/notes`                 | Get paginated notes     |
| POST   | `/api/notes`                 | Create new note         |
| PUT    | `/api/notes/:noteId`         | Update a note           |
| DELETE | `/api/notes/:noteId`         | Delete a note           |
| GET    | `/api/notes/search?query=`   | Search notes            |
| GET    | `/api/notes/tag/:tagName`    | Filter notes by tag     |
| PATCH  | `/api/notes/archive/:noteId` | Archive a note          |
| GET    | `/api/notes/archived`        | Get archived notes      |
| GET    | `/api/notes/:noteId/export`  | Export note as PDF      |
| GET    | `/api/notes/export/zip`      | Export all notes as ZIP |
| GET    | `/api/notes/analytics`       | Notes usage analytics   |

## 📚 Swagger Docs

I've integrated Swagger for live API testing & docs.
[Click here](https://notes-api-a6e8.onrender.com/api-docs/) for testing.

## 🧠 Author

Built by [Anshuman](https://github.com/anshumanSathua) with ❤️
