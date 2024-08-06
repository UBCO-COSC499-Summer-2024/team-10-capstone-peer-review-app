# PeerGrade
## 🏗 Architecture Overview

### 🖥 Client-Side (Frontend)
The client-side of Peer Grade is built using:
- **React**: A powerful JavaScript library for building user interfaces
- **shadcn/ui**: A collection of accessible and customizable React components
- **TailwindCSS**: A utility-first CSS framework for rapid UI development

The frontend code is located in the `app/client/PeerGrade` directory.

### 🖧 Server-Side (Backend)
The server-side is powered by Node.js and Express.js, with the following structure:
- **Middlewares**: Handle cross-cutting concerns like authentication and error handling
- **Controllers**: Manage the application's logic and handle requests
- **Routes**: Define the API endpoints and their corresponding controllers
- **Services**: Contain business logic and interact with the database
- **Express.js**: Provides the web application framework

The backend code is located in the `app/server` directory.

## 💻 Local Development
To set up the application for local development, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app.git
   ```
2. Navigate to the `/app/` directory


## 🐳 Docker Deployemnt
To deploy the application using Docker, follow these steps:
1. Navigate to the `/app/` directory
2. Ensure you have a `.env` file in `/app/.env`
3. Run:
   ```bash
   docker compose -f docker-compose-dev.yml up -d

   # To stop the container
   docker compose -f docker-compose-dev.yml down
   ```

## Manual Deployment
To deploy the application manually, follow these steps:

### Frontend
1. Navigate to the `/app/client/PeerGrade` directory
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/app/client/PeerGrade` directory with the following content:
   ```bash
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/peergrade
   ```
4. Start the application:
   ```bash
   npm run dev
   ```
5. Open your web browser and navigate to `http://localhost:3000/` to access the application.

### Backend
1. Navigate to the `/app/server` directory
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/app/server` directory with the following content:
   ```bash
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/peergrade
   ```
4. Start the application:
   ```bash
   npm run dev
   ```
5. The app will be running on `http://localhost:3000/` however, the api calls will be made to `http://localhost:5001/`

6. We also have a ngix container running which is used to store files and serve them to the frontend on `localhost:8080`


## 📝 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
