# TaskNex

A full-stack task management web application for teams — submit event ideas and expense claims, track approval status, and manage workflows by department.

**🚀 Live Demo:** https://task-nex.vercel.app

---

## Screenshots

### Login & Register
<p float="left">
  <img src="./screenshots/login.png" width="48%" />
  <img src="./screenshots/register.png" width="48%" />
</p>

### Dashboard — User View
![Dashboard User](./screenshots/dashboard-user.png)

### Dashboard — Admin View (with Stats & Pie Chart)
![Dashboard Admin](./screenshots/dashboard-admin.png)

### New Task Modal
![New Task](./screenshots/new-task.png)

### Task Detail Modal
![Task Detail](./screenshots/task-detail.png)

> **Adding screenshots:** Take screenshots of each page and save them to the `screenshots/` folder with the filenames above.

---

## Features

- **JWT Authentication** — Secure register and login with encrypted passwords (bcryptjs)
- **Role-based Access** — Admin and User roles with separate views and permissions
- **Kanban Dashboard** — Tasks organized into 4 columns: Submitted / In Progress / Approved / Rejected
- **Task Types** — Event Ideas and Expense Claims
- **Admin Controls** — Approve, Reject, or mark tasks In Progress directly from the task popup
- **Submitter Visibility** — Admins see who created each task (`First L.` format)
- **Pie Chart Stats** — Admin-only stats banner showing task status distribution
- **Form Validation** — Email format, Canadian phone `(###)-###-####`, password match check

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Material UI (MUI v5), Chart.js, MUI X DatePicker |
| Auth Server | Node.js, Express, JWT, bcryptjs, Mongoose |
| API Server | Node.js, Express, MongoDB Native Driver v6 |
| Database | MongoDB Atlas |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Project Structure

```
TaskNex/
├── react-front-end/               # React frontend → Vercel
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx      # Kanban board with status columns
│       │   ├── Header.jsx         # App header with role badge & logout
│       │   ├── TaskCards.jsx      # Individual task card component
│       │   ├── TaskModule.jsx     # Task detail & edit popup
│       │   └── NewTaskModule.jsx  # Create new task popup
│       ├── helper/
│       │   └── pieChart.jsx       # Chart.js pie chart (admin only)
│       ├── login.jsx
│       └── register.jsx
│
└── Backend/
    ├── AuthServerPlusSchema/      # Auth server → Render (port 5050)
    │   ├── auth/
    │   │   ├── authController.js  # /register, /login, /userinfo
    │   │   └── userModal.js       # Mongoose User schema
    │   ├── app.js
    │   ├── db.js                  # Mongoose connection
    │   └── config.js              # JWT secret config
    │
    └── TaskNex_Server/            # Main API server → Render (port 8888)
        └── tasknexServer.js       # All task CRUD & status endpoints
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/yeji2060/TaskNex.git
cd TaskNex
```

### 2. Auth Server — terminal 1
```bash
cd Backend/AuthServerPlusSchema
npm install
```
Create `Backend/AuthServerPlusSchema/.env`:
```
PORT=5050
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/tasknexdb
JWT_SECRET=your_secret_key
```
```bash
npm start
# → listening on port 5050
```

### 3. Main API Server — terminal 2
```bash
cd Backend/TaskNex_Server
npm install
```
Create `Backend/TaskNex_Server/.env`:
```
PORT=8888
MongoOnline=mongodb+srv://<user>:<password>@cluster.mongodb.net/
```
```bash
npm start
# → listening on port 8888
```

### 4. Frontend — terminal 3
```bash
cd react-front-end
npm install
```
Create `react-front-end/.env`:
```
REACT_APP_API_BASE_URL=http://localhost:8888
REACT_APP_AUTH_BASE_URL=http://localhost:5050
```
```bash
npm start
# → http://localhost:3000
```

---

## Deployment

### Backend (Render.com)

Deploy each backend as a separate **Web Service**:

| Setting | Auth Server | Main API Server |
|---------|-------------|-----------------|
| Root Directory | `Backend/AuthServerPlusSchema` | `Backend/TaskNex_Server` |
| Build Command | `npm install` | `npm install` |
| Start Command | `npm start` | `npm start` |

**Environment Variables:**

Auth Server:
```
MONGO_URI=<atlas_connection_string>/tasknexdb
JWT_SECRET=<your_secret>
```

Main API Server:
```
MongoOnline=<atlas_connection_string>
NODE_VERSION=18
```

> **Important:** In MongoDB Atlas → **Network Access**, add `0.0.0.0/0` to allow connections from Render's dynamic IPs.

### Frontend (Vercel)

Import the GitHub repo and set:

| Setting | Value |
|---------|-------|
| Root Directory | `react-front-end` |
| Framework | Create React App |

**Environment Variables:**
```
REACT_APP_API_BASE_URL=https://<your-main-api>.onrender.com
REACT_APP_AUTH_BASE_URL=https://<your-auth-server>.onrender.com
```

---

## API Reference

### Auth Server (`https://tasknex.onrender.com/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login → returns JWT token |
| GET | `/userinfo` | Get current user profile (requires `x-access-token` header) |

### Main API Server (`https://tasknex-main.onrender.com`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/insertEvent` | Create an Event Idea |
| POST | `/expenseClaim` | Create an Expense Claim |
| PUT | `/updateTaskStatus/:id` | Update task status |
| PUT | `/editTask/:id` | Edit task fields |
| DELETE | `/delEvent/:id` | Delete a task |

---

## Future Enhancements

- Real-time notifications (email or in-app) for task status changes
- Advanced filters and search by keyword, date, or priority
- File/image attachments for expense claims
- Integration with Slack or Microsoft Teams

---

## Authors

EA, Yeji, and Victor
