# SRM Unigram — Frontend

**SRM Unigram** is a dedicated social media platform built exclusively for SRM students & faculty.  
This is the frontend repository of SRM Unigram which delivers a clean, responsive, and interactive UI where students & faculty can share photos, professional posts, events, certifications, and news — all in one place.

The frontend handles:
- User interface & layout
- Post creation UI
- Feed rendering
- API communication with backend
- Secure session handling with JWT

---

## Core Responsibilities
- Built with **React.js**
- Global feed combining posts from all SRM students & faculty
- UI for three categories of posts:
  - Photo posts (Instagram-style)
  - Professional posts (LinkedIn-style)
  - Text/news posts (Twitter-style)
- SRM email–protected login & signup pages
- OTP verification UI
- JWT-based protected routes
- Responsive design for mobile, tablet, and desktop
- Smooth animations & modern UX interactions
- Image upload interface (for photo posts)

---

## Features

### Authentication
- Signup using SRM email address  
- OTP verification screen  
- Login with secure token storage (`localStorage` / `sessionStorage`)  

### Feed
- Combined SRM-wide feed  
- Auto-refreshing timeline  
- View photos, professional posts, and news posts  

### Posts
- Create photo posts, professional posts, or thought/news posts  
- Edit and delete own posts (if enabled)  
- View individual post details  

### Interactions
- Like/Unlike posts  
- Comment on posts  
- View comments  

### User Profile
- View profile information  
- Edit profile details  
- View posts created by user  

---

## Technologies Used
- React.js (Vite or CRA depending on setup)  
- React Router for navigation  
- Axios for API communication  
- Context API / Redux (if used)  
- Tailwind CSS / CSS Modules (depending on choice)  
- Cloud storage support for images (if applicable)  

---

## Security & Verification
- Only verified **SRM email users** can access the dashboard  
- **JWT** is stored securely and validated on protected routes  
- Sensitive pages are blocked without authentication  
- No unauthorized user can access:
  - Feed  
  - Profile  
  - Post creation  

---

## Developer
**Kevin Antony**  
*Full-stack Developer & System Architect of SRM Unigram*   

---

## License
Frontend code © 2025 **Kevin Antony**  
All rights reserved. Redistribution or replication is not permitted without written consent.  

The **SRM logo** is the property of **SRM Institute of Science and Technology** and is used under permission for official purposes only.

---

# Live Site
https://srmunigram.vercel.app
