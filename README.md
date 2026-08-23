# Movin | Admin Dashboard & Management System

This repository contains the **Admin Dashboard** for the **Movin** real-estate platform. It is a robust management suite built to oversee properties, users, auctions, and complaints with a focus on security, transparency, and automated user feedback.

---

## Key Features

### 1. Advanced User Reputation System 
We implemented a sophisticated "Safety-First" logic to identify high-risk accounts:
* **Dynamic Report Counting:** Using MongoDB Aggregation Pipelines, the system calculates total reports against a user *and* their listed properties in real-time.
* **Visual Risk Indicators:** High-risk users (5+ reports) are flagged with a **pulsing red badge** in the UI to alert administrators immediately.

### 2. End-to-End Approval Workflow 
A strict moderation cycle ensures platform quality:
* **Status-Based Visibility:** Properties and Auctions remain hidden from **Search** and **Overview** sections until they receive explicit `Approved` status from an admin.
* **Auction Moderation:** Dedicated approval gate for auctions to verify starting prices and durations before they go live.
* **Smart Filtering:** The Search Engine only indexes `Approved` listings to ensure users only see verified data.

### 3. Rejection Logic & Feedback Loop 
* **Reasoned Rejection:** When an admin rejects a listing, they must provide a specific reason (e.g., "Invalid documentation" or "Inaccurate location").
* **Instant Notifications:** The system automatically triggers a notification to the seller's profile informing them of the decision and the specific reason for rejection.

### 4. User Activity & Profile Tracking 
* **Activity Logs:** Users can track the progress of their listings (Pending, Approved, Rejected) directly from their profile, and admin can see all activities of users, properties, and auctions from the overview page.
* **Status Transparency:** If a property is rejected, the reason is displayed in the user's activity panel for transparency.

### 5. Comprehensive User & Report Management 
* **Account Controls:** One-click `Block` and `Unblock` functionality.
* **Polymorphic Reporting:** Handles complaints against both Users and Properties, sorted by urgency (Pending vs. Resolved).

---

## Tech Stack

### **Backend (Node.js & Express)**
* **MongoDB & Mongoose:** Using complex **Aggregation Pipelines** for real-time data joining and reputation scoring.
* **Notification Engine:** Automated triggers linked to the Approval/Rejection logic.
* **JWT Authentication:** Secure admin routes with token rotation.

### **Frontend (Angular 17+)**
* **Standalone Architecture:** Clean and modular components.
* **Reactive UI:** Utilizes `ChangeDetectorRef` and `RxJS` for a smooth, lag-free experience.
* **SCSS Animations:** Custom keyframe animations for high-risk alerts (Pulse effects) and UI transitions.

---

## Data Architecture

To avoid database bloat, we chose **Aggregation Pipelines** over storing static counters. This ensures:
1. **Accuracy:** The `reportsCount` is always live and reflects the actual state of the `reports` collection.
2. **Efficiency:** Data joins happen at the database level, reducing the payload size sent to the frontend.

### Logic Implementation:
- **Targeting:** Reports are linked via `targetId` which can point to a User ID or Property ID.
- **Sorting Logic:** `Pending` (Priority 1) -> `Resolved` (Priority 2), then by `Date` (Newest first).
* **Notification Flow:** Admin Action -> DB Update -> Notification Trigger -> User Profile Update.

---

## Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/malakkhaled22/admin-dashboard-movin-realestate-app.git

2. **Install Dependencies:**

   npm install

3. **Run the app**

   ng serve -o

4. **Overview of Admin Dashboard**
   Go To:
   https://admin-dashboard-movin-realestate-ap.vercel.app
