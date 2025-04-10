
```markdown
# 🌐 Next UserHub Platform

A full-stack user management platform built with:

- **Frontend**: Next.js + Form Validation  
- **Backend**: Express.js + MongoDB + Load Balancing  
- **Dockerized**: Full setup using docker-compose

---

## 📁 Project Structure

```
next-userhub-platform/
├── frontend/      # Next.js application (user listing + form)
├── backend/       # Express + MongoDB + NGINX load balancing
├── nginx.conf     # Shared NGINX config (used by backend or frontend)
└── README.md      # This file
```

---

## 🧰 Prerequisites

- **Docker** and **Docker Compose** must be installed.
- Ensure required scripts have executable permissions. For example, run:
  ```bash
  chmod +x ./backend/mongo-init/restore_central.sh
  ```
- Verify that your MongoDB dump exists under `./backend/dump/usersdb`.

---

## 🔄 Running Services Separately

### Running the Frontend Independently

1. **Navigate to the `frontend` folder:**

   ```bash
   cd frontend
   ```

2. **Run the Frontend Service:**

   ```bash
   docker-compose up --build
   ```

3. **Access the Frontend:**

   The service will be available at its configured port (typically [http://localhost:3000](http://localhost:3000)).

4. **Tear Down the Frontend:**

   When finished, run:
   ```bash
   docker-compose down -v
   ```

---

### Running the Backend Independently

1. **Navigate to the `backend` folder:**

   ```bash
   cd backend
   ```

2. **Ensure the restore script has executable permissions:**

   ```bash
   chmod +x ./mongo-init/restore_central.sh
   ```

3. **Run the Backend Service:**

   ```bash
   docker-compose up --build
   ```

4. **Access the Backend API:**

   The API should be available at its configured port (typically [http://localhost:4000/user](http://localhost:4000/user)).

5. **Tear Down the Backend:**

   When finished, run:
   ```bash
   docker-compose down -v
   ```

---

## 🚫 Run All Services Together *(Disabled - Under Development)*

> **Note:** The following instructions are under active development and are currently disabled. The full-stack integration is not enabled at this time.

<!--
### 1️⃣ Clone the Repo

```bash
git clone https://github.com/your-username/next-userhub-platform.git
cd next-userhub-platform
```

### 2️⃣ Run All Services

From the project root, run:

```bash
docker-compose up --build
```

This command will build and launch:
- 2 backend containers (`backend1`, `backend2`)
- 2 frontend containers (`frontend1`, `frontend2`)
- A MongoDB container with optional seed data (from `./backend/dump`)
- NGINX containers for load balancing:
  - **Frontend** available on port `3000`
  - **Backend API** available on port `4000`

*These instructions are under development.*
  
### 3️⃣ Access the App

- 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
- 🔧 **Backend API**: [http://localhost:4000/user](http://localhost:4000/user)
-->

---

## 🧼 Tear Down (Full Stack)

If running the entire stack (once enabled) or any service from the project root, you can stop and remove all containers, networks, and volumes with:

```bash
docker-compose down -v --remove-orphans
```

---

## 📄 More Info

For detailed instructions and development guides, see:

- [`frontend/README.md`](./frontend/README.md)
- [`backend/README.md`](./backend/README.md)
