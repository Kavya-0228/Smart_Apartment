# Smart Complaint Tracker

A modern React frontend application for managing apartment complaints.

## Features

- **Authentication**: Login/Register with role selection (Resident/Admin)
- **Dashboard**: View complaints with filtering and search
- **Raise Complaint**: Form to submit new complaints with image upload
- **Complaint Details**: Full complaint view with status timeline and comments
- **Admin Panel**: Manage all complaints, change status, assign tasks
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode**: Toggle between light and dark themes
- **Local Storage**: Data persists across browser sessions

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Local Storage for data persistence

## Getting Started

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## Demo Credentials

- **Admin Login**: `admin@apartment.com` / `password`
- **Any other email/password** will work for resident login

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Side navigation menu
│   ├── Card.tsx        # Card component
│   └── Badge.tsx       # Status badge component
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── RaiseComplaint.tsx # New complaint form
│   ├── ComplaintDetails.tsx # Complaint details
│   └── AdminPanel.tsx  # Admin management
├── context/            # React Context for state
│   ├── AuthContext.tsx # Authentication state
│   └── ComplaintContext.tsx # Complaint data
├── assets/             # Static assets
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Sample Data

The app includes sample complaints for demonstration. All data is stored in localStorage and persists across sessions.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.