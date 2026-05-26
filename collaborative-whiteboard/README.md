# Collaborative Whiteboard
## College Mini Project — README

---

## 📁 Project Structure

```
collaborative-whiteboard/
├── frontend/              ← React + Vite (runs on port 5173)
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx       ← Home screen (username + create/join room)
│       │   └── WhiteboardPage.jsx ← Drawing canvas + real-time sync
│       ├── services/
│       │   ├── api.js             ← Axios calls to Spring Boot REST APIs
│       │   └── websocket.js       ← WebSocket client (real-time drawing)
│       ├── App.jsx                ← Routing setup
│       ├── main.jsx               ← React entry point
│       └── index.css              ← All CSS styles
│
├── backend/               ← Spring Boot (runs on port 8080)
│   └── src/main/java/com/whiteboard/
│       ├── entity/
│       │   ├── Room.java          ← Room database table
│       │   └── RoomMember.java    ← Room members table
│       ├── repository/
│       │   ├── RoomRepository.java
│       │   └── RoomMemberRepository.java
│       ├── service/
│       │   └── RoomService.java   ← Business logic
│       ├── controller/
│       │   └── RoomController.java ← REST API endpoints
│       ├── websocket/
│       │   └── DrawingWebSocketHandler.java ← Real-time drawing sync
│       ├── config/
│       │   ├── WebSocketConfig.java ← WebSocket endpoint setup
│       │   └── CorsConfig.java      ← CORS for React frontend
│       └── CollaborativeWhiteboardApplication.java
│
└── database/
    └── setup.sql          ← MySQL database setup
```

---

## 🗄️ Step 1: MySQL Setup

1. Open **MySQL Workbench** or **MySQL Command Line**

2. Run this command:
```sql
CREATE DATABASE IF NOT EXISTS whiteboard_db;
```

3. Update your MySQL credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## ⚙️ Step 2: Run the Backend (Spring Boot)

### Option A: Using Maven (command line)
You need Java 17+ and Maven installed.

```powershell
# Go to backend folder
cd backend

# Run Spring Boot
mvn spring-boot:run
```

### Option B: Using IntelliJ IDEA
1. Open IntelliJ IDEA
2. Open the `backend/` folder as a Maven project
3. Wait for Maven to download dependencies
4. Run `CollaborativeWhiteboardApplication.java`

The backend runs at: **http://localhost:8080**

---

## 🌐 Step 3: Run the Frontend (React)

```powershell
# Go to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```

The frontend runs at: **http://localhost:5173**

---

## 🧪 Step 4: Test the App

1. Open **http://localhost:5173** in your browser
2. Enter your username, click **Create New Room**
3. Copy the room code shown on the whiteboard page
4. Open a **second browser tab/window** at http://localhost:5173
5. Enter a different username, paste the room code, click **Join Room**
6. Draw on one tab — it appears instantly on the other! 🎉

---

## 🔌 API Endpoints (Spring Boot)

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/rooms/create` | Create a new room |
| `POST` | `/api/rooms/join` | Join an existing room |
| `GET` | `/api/rooms/{roomCode}` | Get room info & members |

### WebSocket
- URL: `ws://localhost:8080/ws/drawing`
- Sends/receives drawing coordinates in JSON

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Vanilla CSS |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Backend | Spring Boot 3.2 |
| WebSocket | Spring WebSocket |
| Database | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |

---

## 📋 Features

- ✅ Home page with username input
- ✅ Create room (generates unique 6-char code)
- ✅ Join room with room code
- ✅ Real-time collaborative drawing via WebSocket
- ✅ Color picker
- ✅ Brush size control
- ✅ Eraser tool
- ✅ Clear board (synced to all users)
- ✅ Members list in sidebar
- ✅ Room code display
- ✅ Export as PNG
- ✅ MySQL room & member storage
