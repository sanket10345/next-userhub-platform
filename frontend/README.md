# 🌐 NextUserHub – Next.js Frontend User Management

This is **NextUserHub**, a **Next.js**-based frontend application for managing users. It provides functionality to **list, create, and edit** users with built-in form validation and Dockerized deployment with load balancing.

---

## 🔧 Prerequisite

> ⚠️ This frontend requires a backend API to be running at:  
> **`http://localhost:4000`**

Ensure your backend service (Node.js, Express, or similar) is running and exposes the following endpoints:
- `GET /users` → Fetch all users
- `POST /users` → Create a new user
- `GET /users/:id` → Fetch user by ID
- `PUT /users/:id` → Update user by ID

---

## 📁 App Routes

### `/`
- **Purpose:** List all users
- **Behavior:** Calls `GET /users` from the backend and displays users

### `/add`
- **Purpose:** Add a new user
- **Behavior:** Presents a form, validates inputs, sends `POST /users`

### `/user/[id].js`
- **Purpose:** View or edit user by ID
- **Behavior:** Calls `GET /users/:id`, shows a form pre-filled with data, allows updating via `PUT /users/:id`

---

## ✅ Form Validation Logic

Located in `utils/validation.js` (or similar):

```js
export const validateUserFormInputs = (form) => {
  if (!form.user || !form.email || !form.age || !form.mobile || !form.interest) {
    return 'All fields are required';
  }
  const emailRegex = /.+@.+\..+/;
  if (!emailRegex.test(form.email)) {
    return 'Invalid email format';
  }
  if (isNaN(form.age) || form.age < 0) {
    return 'Age must be a valid number';
  }
  if (!/^\d{10}$/.test(form.mobile)) {
    return 'Mobile must be a 10-digit number';
  }
  return '';
};
```

---

## 🐳 Docker Deployment

### Dockerfile

```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  frontend1:
    build: .
    container_name: nextjs-frontend1
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production

  frontend2:
    build: .
    container_name: nextjs-frontend2
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    ports:
      - "3000:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend1
      - frontend2
```

---

## 🚀 Running the App

1. **Make sure backend is running at `http://localhost:4000`**

2. **Start containers:**

```bash
docker-compose up --build
```

3. **Access the frontend:**

🔗 [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Load Balancing Architecture

This app uses **NGINX** to load balance between two frontend instances.

### Architecture:

```
User → NGINX (port 3000)
             ↓
    [ Frontend1 | Frontend2 ]
     (port 3001 | port 3002)
```

- **NGINX** proxies requests to either frontend using a round-robin strategy.
- Ensures better scalability and fault tolerance.
- If one frontend crashes, the other still handles requests.

> Optional: Customize `nginx.conf` to change balancing strategy.

---