# 2D-Multiverse
**Note**: Docker file is inside 2D-Multiverse folder
---
**2D-Multiverse** is a feature-rich project showcasing a comprehensive implementation of modern web technologies. This project combines the power of backend-heavy systems with a visually appealing and interactive frontend to deliver a seamless experience. It leverages a **monorepo architecture** powered by **Turbo** to manage and maintain scalability and modularity across multiple applications.

---
## **Skills and Technologies Demonstrated**

This project reflects expertise in a wide range of technologies and best practices:
- **Mono-Repo Structure**:
  - Used **Turbo** for maintaining a monorepo Structure.
  - Database hence used as common by both Http and Websockets.
- **Backend Development**:
  - Designing scalable systems with **Node.js**, **Express**, and **TypeScript**.
  - Implementing real-time features using **WebSockets (Socket.IO)**.
  - Secure authentication with **Passport.js**, **JWT**,**Cookie-Session** and **bcrypt**.
- **Frontend Development**:
  - Building responsive and dynamic UIs using **React**,**React-Toastify** and **Material-UI**.
  - Managing complex state with **Reduxjs Toolkit**.
- **Performance Optimization**:
  - Custom Rate **Limit of 100 requests in 60 sec on both express and mongodb**
  - Using **Redis** for caching and **PM2** for clustering.
  - Database optimization with custom indexing.
- **DevOps**:
  - Configuring **Docker** and **docker-compose** for containerized environments.
  - Automating CI/CD pipelines with **GitHub Actions**.
- **Testing**:
  - Writing robust tests using **Jest** to ensure reliability.

---

## **Features and Architecture**

### **Backend**
The backend is split into two core parts: **HTTP** and **WebSockets**, enabling robust data handling, user interactions, and real-time communication.

#### HTTP Server
- **Authentication**:  
  - Supports **JWT authentication** and session management via **cookie-session**.  
  - Includes **Simple and Google OAuth** using **Passport.js**.
  - Implements **bcrypt** for secure password hashing.
- **Core Functionality**:
  - REST API endpoints for user management (signup/login) and CRUD operations for maps, elements, spaces, and avatars.
  - **Rate Limiting**: Enforced on both **MongoDB** and **Express** separately to prevent abuse.
  - **Caching**: Utilizes **Redis** to reduce database load and improve response times.
  - **Performance Optimization**: Employs **PM2** clustering to handle high traffic efficiently.
- **Database**:
  - MongoDB is configured with custom indexing for optimized query performance.
- **Validation**:
  - All incoming requests are validated using **Zod** to ensure reliability and security.

#### WebSockets
- **Real-Time Communication**: Powered by **Socket.IO**, users can join a shared 2D space and interact with other users.
- **2D Space Features**:
  - Users can see and track each other's movements in real time.
  - Space boundaries are enforced to restrict movement beyond the defined area.
- **Scalability**:
  - Designed to handle multiple concurrent users efficiently using socket types and namespaces.

---

### **Frontend**
The project, while backend-centric, boasts an impressive and interactive frontend:
- **Technologies**:
  - Built using **React** and styled with **Material-UI**,**React-Toastify**.
  - State management is powered by **Redux Toolkit**.
- **Features**:
  - Beautiful, responsive design with animated backgrounds for enhanced user engagement.
  - Seamless integration with both HTTP and WebSocket backends.
- **Interactive Elements**:
  - Dynamic and visually appealing components for a rich user experience.
- **Responsive Design**:
  - Try My best to make it top notch responsive. 

---

### **Testing and Deployment**
- **Testing**:
  - The backend is thoroughly tested using **Jest**, ensuring reliability and robustness.
- **CI/CD**:
  - The project is equipped with a **GitHub Actions workflow** (`deploy.yml`) for continuous integration and deployment.

---

## **Setup and Installation**

### **Prerequisites**
- **Node.js**, **Docker**, **Redis**, and **MongoDB** (can run in Docker containers).
- Environment variables file (`.env`) in the project root. Replace sensitive data accordingly.

### **Installation Steps**
1. Clone the repository:  
   ```bash
   git clone https://github.com/<your-repo>/2D-Multiverse.git
   cd 2D-Multiverse
   ```
2. Set up environment variables in a `.env` file:
   ```env
   JWT_SECRET='your_secret_key'
   MONGO_URL='your_mongodb_connection_string'
   PORT=3000
   cookieKey='your_cookie_key'
   googleClientID='your_google_client_id'
   googleClientSecret='your_google_client_secret'
   redisURL='redis://redis:6379'
   ```

3. **Frontend**:  
   Navigate to the frontend app and run:
   ```bash
   cd apps/Frontend
   npm install
   npm run build
   npm run dev
   ```

4. **HTTP Server**:  
   Ensure MongoDB and Redis are running, then:
   ```bash
   cd apps/Http
   npm install
   npm run build
   npm run dev
   ```

5. **WebSocket Server**:  
   Ensure MongoDB is running, then:
   ```bash
   cd apps/WebSockets
   npm install
   npm run build
   npm run dev
   ```

6. **Database (Shared Library)**:
   ```bash
   cd packages/db
   npm install
   npm run build
   ```

7. **Run Tests**:
   ```bash
   cd tests
   npm run test
   ```

8. **Docker**:
   Use the `docker-compose` file in the project root to spin up the required containers.
   ```bash
     docker compose --build
   ```

---

## **Contributions**
This project is solely developed by **Sagar Kapoor**.  
Feel free to contact me for collaborations or queries at:  
📧 **sagarbadal70@gmail.com**
