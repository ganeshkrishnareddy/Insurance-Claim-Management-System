# 🏥 Insurance Claim Management System (Web & Mobile)

![Logo](assets/logo.png)

A comprehensive, full-stack Insurance Claim Management System designed to streamline the lifecycle of insurance claims from submission to settlement. This mono-repo contains both the **React Web Portal** and the **Flutter Mobile App**.

---

## 🚀 Features

- **Role-Based Access Control (RBAC)**: secure login for Admins and Users.
- **Claim Management**: Create, View, Approve, Reject, and Settle claims.
- **Real-Time Database**: Powered by **Supabase** (PostgreSQL) for instant data synchronization.
- **Dashboard Analytics**: Visual insights into claim status and financials.
- **Secure Authentication**: Robust user management via Supabase Auth.
- **Multi-Platform**:
    - 🌐 **Web Portal**: React.js + Vite
    - 📱 **Mobile App**: Flutter (In Development)

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend (Web)** | React.js, Vite, Lucide Icons |
| **Mobile App** | Flutter, Dart |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (Email/Password) |
| **Real-time** | Supabase Realtime Subscriptions |

---

## 👨‍💻 Developer Information

**P Ganesh Krishna Reddy**  
*Full Stack Developer*

📧 **Email**: [pganeshkrishnareddy@gmail.com](mailto:pganeshkrishnareddy@gmail.com)  
📞 **Phone**: +91 8374622779  
🔗 **LinkedIn**: [pganeshkrishnareddy](https://linkedin.com/in/pganeshkrishnareddy)  
🌐 **Portfolio**: [pganeshkrishnareddy.vercel.app](https://pganeshkrishnareddy.vercel.app/)

---

## 📦 Project Structure

```bash
├── src/                # React Web Application Source
│   ├── components/     # Reusable UI Components
│   ├── context/        # State Management (Auth, Claims)
│   └── supabaseClient.js # Database Configuration
├── mobile_app/         # Flutter Mobile Application Source
│   ├── lib/            # Dart Logic
│   └── pubspec.yaml    # Flutter Dependencies
└── README.md           # Project Documentation
```

## 🚀 Getting Started

### Web Portal
1.  Navigate to root directory.
2.  Install dependencies: `npm install`
3.  Start server: `npm run dev`

### Mobile App
1.  Navigate to `mobile_app/`.
2.  Install dependencies: `flutter pub get`
3.  Run app: `flutter run`

---
*© 2024 P Ganesh Krishna Reddy. All Rights Reserved.*
