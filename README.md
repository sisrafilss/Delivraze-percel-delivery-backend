# 📦 Delivraze Parcel Delivery Backend

Delivraze is a Bangladeshi parcel delivery company (imaginary). This repository contani the backend application of the Delivraze's parcel delivery system. This is v1.0.0 allow user's to register as a SENDER, or RECEIVER. Send parcel request, maange parcels and users by admin, and see the status log. Also anyone can track the parcel and it's status log using a trackign id without login. Live Hosted Link:

Built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**.

---

## 🚀 Features

- User authentication & authorization (JWT-based).
- Create, update, and manage parcel delivery requests.
- Track parcel status with detailed status logs.
- Payment integration is not support in this version. Labeled as cash on delivery.
- Pagination, filtering, and search for parcel listings.
- Role-based access control (ADMIN, SENDER, RECEIVER).

---

## How to run locally

- Clone the repositry and setup .env file by following the given `.env.example` file.
- Install all necessary dependencies and dev dependencies using `npm install` command.
- Run `npm run dev` command in the terminal.
- If it complains, you have to first install `ts-node-dev` globally. Install it first using `npm i -g ts-node-dev` and run the `npm run dev` once more.
- Application will be run within a few seconds. Use Postman or similar software to test the APIs given below.

## 📑 API Overview

### 🔐 Auth

- `POST /api/v1/auth/login` → Login registerd user using email and password (JWT based)
  The request body will contain the user's email and password for login. By default, one user is created for testing purposes with the `ADMIN` role (a Super Admin is not available; this predefined Admin will act as the Super Admin).

```json
    "email": "super@gmail.com",
    "password": "12345678"
```

- `POST /api/v1/auth/logout` → Logout for logged in user (clear accessToken from browser cookie)
- `POST /api/v1/auth/refresh-token` → Get new Access Token using Refresh Token
- `POST /api/v1/auth/change-password` → Change password for already logged in user
- `POST /api/v1/auth/forgot-password` → Request for a reset password link via email if password forgot
- `POST /api/v1/auth/reset-password` → Reset a new password using password reset link got via email

### 👤 Users

- `POST /api/v1/user/register` → Register a new user using credentials
- `PATCH /api/v1/user/userId` → Update user's information (for admin)
- `GET /api/v1/user/all-users` → GET all users (for admin)
- `GET /api/v1/user/me` → GET logged in user's information
- `GET /api/v1/user/userId` → GET a single user's information (admin)

### 📦 Parcels - Sender

- `GET /api/v1/parcel` → GET all parcels by sender
- `POST /api/v1/parcel` → Send a parcel pickup request by sender
- `PATCH /api/v1/parcel/cancel/parcelId` → Cancel a parcel pickup request before picked

### 📦 Parcels - Receiver

- `GET /api/v1/parcel/receiver/incomming` → GET All Incomming Parcel by Receiver
- `GET /api/v1/parcel/receiver/history` → GET All Parcels History by Receiver
- `PATCH /api/v1/parcel/receiver/update-status` → Update Delivery Status by Receiver

### 📦 Parcels - Admin

- `GET /api/v1/parcel/all` → Get all parcels (admin)
- `GET /api/v1/parcel/parcelId` → GET a single parcel (admin)
- `GET /api/v1/parcel/parcelId/status-log` → GET a single parcel Status Log (admin)
- `PATCH /api/v1/parcel/update/parcelId` → Update / Manage Parcels (admin)
- `PATCH /api/v1/parcel/status/parcelId` → Update Parcel Status (admin)
- `DELETE /api/v1/parcel/delete/parcelId` → UDelete Parcel (admin)

### 👥 Public

- `GET /api/v1/parcel/public/trackingId` → GET a Parcel by Trancing ID
