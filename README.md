\# ServiQuest Admin Dashboard 🧭



\[!\[Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)

\[!\[Vite](https://img.shields.io/badge/Vite-frontend-blueviolet)](#)

\[!\[License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)



\## Table of Contents

\- \[Overview](#overview)

\- \[Features](#features)

\- \[Tech Stack](#tech-stack)

\- \[Getting Started](#getting-started)

&nbsp; - \[Prerequisites](#prerequisites)

&nbsp; - \[Installation](#installation)

&nbsp; - \[Running Locally](#running-locally)

\- \[Environment Variables](#environment-variables)

\- \[Authentication Flow](#authentication-flow)

\- \[Folder Structure](#folder-structure)

\- \[API Integration](#api-integration)

\- \[Deployment](#deployment)

\- \[Contributing](#contributing)

\- \[License](#license)

\- \[Contact](#contact)



---



\## Overview  

The \*\*ServiQuest Admin Dashboard\*\* is a modern React-based web app for managing platform operations — users, bookings, services, and payments.  

It provides real-time insights, analytics, and full CRUD management via the ServiQuest Backend API.



---



\## Features  

✅ \*\*Secure Admin Login\*\* via JWT  

✅ \*\*Dashboard Analytics\*\*: View system statistics (users, bookings, payments)  

✅ \*\*User \& Provider Management\*\*  

✅ \*\*Service Category Management\*\*  

✅ \*\*Payment Tracking\*\* (via Stripe API)  

✅ \*\*Real-time Chat Overview\*\*  

✅ \*\*Protected Routes\*\* with role-based access control  

✅ \*\*Responsive Design\*\* (Tailwind CSS + Flex/Grid)  



---



\## Tech Stack  

| Layer | Technology |

|--------|-------------|

| Frontend | \*\*React 18 + Vite\*\* |

| UI Library | \*\*Tailwind CSS\*\* |

| Routing | \*\*React Router v6+\*\* |

| State Management | \*\*Context API (AuthContext)\*\* |

| Authentication | \*\*JWT stored in localStorage\*\* |

| HTTP Client | \*\*Axios\*\* |

| Backend API | \[ServiQuest Backend](https://github.com/Izewdevlabs/serviquest-backend) |

| Build Tool | \*\*Vite 5+\*\* |



---



**## Getting Started**  



**### Prerequisites**  

\- Node.js v16 or newer  

\- NPM or Yarn  

\- A running instance of the \[ServiQuest Backend](https://github.com/Izewdevlabs/serviquest-backend) on `http://localhost:5000`  



\### Installation  

```bash



git clone https://github.com/Izewdevlabs/serviquest-admin-dashboard.git

cd serviquest-admin-dashboard

npm install



**Running Locally**

npm run dev



Then open:

👉 http://localhost:5173



**Environment Variables**



Create a .env file in the root:



VITE\_API\_BASE\_URL=http://localhost:5000/api

VITE\_APP\_NAME=ServiQuest





You can add more variables (e.g., analytics keys or production API URLs) later.



**Authentication Flow**



Admin logs in using their credentials (email + password).



Backend returns a signed JWT token.



Token is stored in localStorage and shared via AuthContext.



Protected routes (Dashboard, Analytics, etc.) use <ProtectedRoute> to validate session.



Logging out clears context and local storage.



Folder Structure

serviquest-admin-dashboard/

│

├── src/

│   ├── components/

│   │   └── ProtectedRoute.jsx

│   ├── context/

│   │   └── AuthContext.jsx

│   ├── pages/

│   │   ├── Login.jsx

│   │   ├── Register.jsx

│   │   ├── Dashboard.jsx

│   │   └── Users.jsx

│   ├── services/

│   │   └── authService.js

│   ├── main.jsx

│   └── index.css

│

├── .env.example

├── .gitignore

└── README.md



API Integration



The dashboard consumes APIs from the ServiQuest Backend:



Function	Endpoint	Method

Login	/api/auth/login	POST

Register Admin	/api/auth/register	POST

Fetch Stats	/api/admin/stats	GET

List Users	/api/admin/users	GET

Manage Services	/api/services	GET/POST/PUT/DELETE



Use Axios or fetch with the token in headers:



axios.get("/api/admin/stats", {

&nbsp; headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }

});



Deployment



For production build:



npm run build





Outputs to /dist. You can deploy it to:



Netlify



Vercel



GitHub Pages



AWS S3 / CloudFront



Set VITE\_API\_BASE\_URL to your production backend endpoint.



Contributing



Fork the repo



Create your feature branch



git checkout -b feature/new-component





Commit your changes



Push and create a Pull Request



Follow the established code style and structure.



**License**



This project is licensed under the MIT License — see LICENSE

&nbsp;for details.





