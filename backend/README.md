### 📝 Filename: `README.md`

```markdown
# 🛠️ UserHub Backend API

A robust **Express.js** + **MongoDB** backend for managing user data. This backend powers the **NextUserHub** frontend and supports full **CRUD operations**, **Joi validation**, and **load-balanced deployment** via Docker and NGINX.

---

## 🚀 Features

- RESTful API to manage users
- MongoDB with Mongoose ODM
- Input validation with Joi
- Load-balanced backend containers via NGINX
- MongoDB preloaded with sample dump data
- Dockerized for easy deployment

---

## 🧠 Prerequisites

- Docker + Docker Compose installed
- Optional: MongoDB data dump inside `dump/` to auto-load on container start

---

## 📁 Project Structure

```
userhub-backend/
│
├── server.js              # Main entry – DB connection + logging + start
├── app.js                 # Express app setup (middleware, routes)
├── logger.js              # Simple request logger
│
├── models/
│   └── User.js            # Mongoose user schema and model
│
├── routes/
│   └── userRoutes.js      # All /user route logic (CRUD)
│
├── validation/
│   └── userValidation.js  # Joi schema for request body validation
│
├── mongo-init/
│   └── restore.sh         # Shell script to auto-restore MongoDB dump
│
├── dump/                  # MongoDB dump (bson/json) that gets restored
├── logs/                  # App logs directory (created at runtime)
│
├── Dockerfile             # Node.js image setup for backend
├── docker-compose.yml     # Multi-service setup (Mongo, Backend, NGINX)
└── nginx.conf             # Load balancing config for backend containers
```

---

## 📦 Mongoose User Model (models/User.js)

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user:     { type: String, required: true, unique: true },
  interest: { type: [String], required: true },
  age:      { type: Number, required: true },
  mobile:   { type: Number, required: true, unique: true },
  email:    { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
});

userSchema.set('toJSON', { versionKey: false });

module.exports = mongoose.model('User', userSchema);
```

**📌 Highlights:**
- All fields are **required**
- `email`, `user`, and `mobile` must be **unique**
- `interest` is an **array of strings**
- Clean JSON output with `__v` version key removed

---

## ✅ Joi Validation Schema (validation/userValidation.js)

```js
const Joi = require('joi');

const userSchema = Joi.object({
  user: Joi.string().min(1).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  interest: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one interest must be specified',
    'any.required': 'Interests are required',
  }),
  age: Joi.number().integer().min(1).required().messages({
    'number.base': 'Age must be a number',
    'any.required': 'Age is required',
  }),
  mobile: Joi.number().integer().min(1000000000).max(9999999999).required().messages({
    'number.base': 'Mobile must be a number',
    'any.required': 'Mobile is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
});

const updateUserSchema = userSchema
  .fork(['user', 'email', 'age', 'mobile', 'interest'], (schema) => schema.optional())
  .keys({
    _id: Joi.string().required(),
  });

module.exports = { userSchema, updateUserSchema };
```

---

## 🐳 Dockerized Setup

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:6.0.13-jammy
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
      - ./dump:/dump
      - ./mongo-init:/docker-entrypoint-initdb.d
    command: ["bash", "/docker-entrypoint-initdb.d/restore.sh"]
    restart: always

  backend1:
    build: .
    ports:
      - "4001:4000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/usersdb
      - PORT=4000
    depends_on:
      - mongo

  backend2:
    build: .
    ports:
      - "4002:4000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/usersdb
      - PORT=4000
    depends_on:
      - mongo

  nginx:
    image: nginx:alpine
    ports:
      - "4000:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend1
      - backend2

volumes:
  mongo-data:
```

---

## 📂 MongoDB Dump Auto-Restore

If `dump/` folder contains valid MongoDB dump files (`usersdb/collections.bson`), and `restore.sh` exists, the database will be **auto-seeded** on first boot.

```bash
# mongo-init/restore.sh
#!/bin/bash
echo "Restoring MongoDB from dump..."
mongorestore /dump
echo "✅ Restore complete."
```

Make sure this file is executable:
```bash
chmod +x mongo-init/restore.sh
```

---

## 🔀 Load Balancing with NGINX

```
Client Request
     ↓
NGINX (localhost:4000)
     ↓            ↓
 backend1       backend2
 (4001)          (4002)
```

- Round-robin strategy
- High availability: if one instance fails, the other serves traffic
- NGINX config in `nginx.conf`

---

## 🧪 Run the App

```bash
docker-compose up --build
```

### Access API via:

- 🔀 **Load balancer**: `http://localhost:4000/user`
- 🔧 **Direct backends**:  
  - `http://localhost:4001/user`  
  - `http://localhost:4002/user`

---

## 📬 Contribution & Feedback

Feel free to report issues, request features, or submit pull requests.

---
