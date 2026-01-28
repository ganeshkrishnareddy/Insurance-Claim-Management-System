# Insurance Claim Management System (React)

## Developed by P Ganesh Krishna Reddy
- **LinkedIn**: [pganeshkrishnareddy](https://linkedin.com/in/pganeshkrishnareddy)
- **GitHub**: [ganeshkrishnareddy](https://github.com/ganeshkrishnareddy)
- **Portfolio**: [pganeshkrishnareddy.vercel.app](https://pganeshkrishnareddy.vercel.app/)
- **Email**: pganeshkrishnareddy@gmail.com
- **Mobile**: +91-8374622779

---

## Project Overview
A professional web application designed to streamline the hospital insurance claim workflow. Built with React and optimized for deployment on platforms like Vercel.

## Core Features
- **Patient Claim Creation**: Easily initiate new insurance claims.
- **Financial Management**:
  - **Bills**: Track individual medical service charges.
  - **Advances**: Record payments received before claim submission.
  - **Settlements**: Log final payments received from insurance.
  - **Pending Balances**: Automated real-time calculation of remaining amounts (Total - Advances - Paid).
- **Status Workflow**:
  - `Draft`: Manage bills and advances before submission.
  - `Submitted`: Once submitted, the claim awaits review.
  - `Approved / Rejected`: Reviewer status updates.
  - `Partially Settled / Settled`: Payment-driven status transitions.
- **Currency**: All financial data is handled in **INR (₹)**.

## Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ganeshkrishnareddy/Insurance-Claim-Management-System
   cd insurance_claims_react
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Deployment on Vercel
1. Push your code to GitHub.
2. Connect your GitHub repository to Vercel.
3. Select the `insurance_claims_react` directory as the project root.
4. Vercel will auto-detect the Vite build settings. Click **Deploy**.

---
*Developed with focus on accuracy and user experience.*
