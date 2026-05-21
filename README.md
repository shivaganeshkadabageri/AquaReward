# AquaReward – Gamified Water Saving Platform for Hotels

AquaReward is a premium, full-stack, responsive web application designed to encourage hotel guests to conserve water by tracking consumption, engaging in daily challenges, earning streaks, and redeeming exclusive hotel rewards. It also empowers hotel administrators with real-time property analytics and room diagnostics.

---

## 🛠️ Technology Stack

### Backend (`/backend`)
- **Framework**: Spring Boot 3.2.x, Spring Web, Spring Data MongoDB, Spring Security
- **Language**: Java 17
- **Authentication**: Stateless JSON Web Tokens (JWT)
- **Database**: MongoDB (Local instance)
- **Build Tool**: Maven (via pre-configured `./mvnw.cmd` wrapper)

### Frontend (`/frontend`)
- **Core Library**: React 19, Vite (Fast HMR)
- **Styling**: Tailwind CSS (Premium glassmorphism and tailored sustainability HSL palette)
- **Animations**: Framer Motion (Fluid staggers and smooth transitions)
- **Charts**: Recharts (Interactive usage telemetry area graphs)
- **Icons**: Lucide React

---

## 🚀 Quick Start Guide

Both servers are already fully configured and currently **running successfully in the background** on your local machine. If you want to check logs or run them manually in the future, follow the instructions below:

### Prerequisites
- **JDK 17** installed (e.g., in `C:\Program Files\Java\jdk-17`)
- **MongoDB** running locally on port `27017`
- **Node.js** (v18+)

### 1. Running the Spring Boot Backend
From the root directory:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
cd backend
.\mvnw.cmd spring-boot:run
```
- Exposes REST endpoints on: `http://localhost:8080`
- Automatically seeds the database on startup if empty.

### 2. Running the React Frontend
From the root directory:
```powershell
cd frontend
npm install
npm run dev
```
- Opens local dev server on: `http://localhost:5173/`

---

## 🔑 Ready-To-Use Demo Accounts

The database seeder pre-populates the platform with realistic mock profiles. On the login screen, you can click the quick-fill buttons or enter the following details manually:

### Guest Portals
- **Emma Watson**: `emma@guest.com` / `guestpassword` (Room 101, 320 Points, 4-day Saving Streak)
- **Sophia Loren**: `sophia@guest.com` / `guestpassword` (Room 201, 480 Points, 5-day Saving Streak)
- **Liam Neeson**: `liam@guest.com` / `guestpassword` (Room 102, 180 Points, 2-day Saving Streak)

### Hotel Management Portal
- ** Sarah Jenkins**: `admin@ecohaven.com` / `adminpassword` (Property: Eco Haven Resort)

---

## 🌟 Key Application Features

1. **IoT Smart Meter Simulator (Guest Dashboard)**: Transmit simulated telemetry (Shower, Tap, Laundry, Bathroom) for custom durations. Telemetry instantly posts to the API, recalculating level tiers, streaking dates, and eco-points.
2. **Weekly Telemetry Analysis**: Interactive graphs visualizing liters used vs. hotel conservation targets.
3. **Daily Eco-Challenges**: Clear checklist milestones. Complete them by staying under consumption targets (e.g. < 80 L today).
4. **Resort Rewards Catalog**: Exchange earned points for spa vouchers, biodynamic organic wine, or luxury suite upgrades. Generates instant printable coupon QR codes.
5. **Guest Leaderboard**: Property podium showing off top water conservationists.
6. **Property Overview & Room Diagnostics (Admin Portal)**: Real-time room telemetry grids, aggregate water saved totals, and a tool to launch new challenges or add custom rewards.
