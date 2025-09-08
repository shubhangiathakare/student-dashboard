# Student Management Dashboard

A modern, interactive **React + Vite + Tailwind + Firebase** SPA to manage students with authentication and real-time database.  
Includes **Framer Motion animations**, **Firebase Authentication**, and **Firestore Database** for a complete full-stack experience.

## ✨ Features
- 🔒 **Authentication** - Google Sign-In with Firebase Authentication
- 📝 **CRUD Operations** - Add, view, edit, and delete students
- 🔍 **Real-time Search** - Fast client-side search with Firestore indexing
- 🌓 **Dark/Light Mode** - Built-in theme switching
- 📱 **Fully Responsive** - Works on all device sizes
- 🎨 **Modern UI** - Clean, accessible interface with Tailwind CSS
- 🚀 **Fast Performance** - Optimized with code splitting and lazy loading
- 📊 **Data Visualization** - Charts for student statistics
- 📱 **PWA Support** - Installable on mobile devices

## 🛠 Tech Stack
- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS with dark mode
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Build Tool**: Vite
- **Form Handling**: React Hook Form with Yup validation
- **Notifications**: React Toastify

## 🔥 Firebase Features
- **Authentication**: Secure user authentication with Google Sign-In
- **Firestore**: Real-time NoSQL database with security rules
- **Hosting**: Deploy directly to Firebase Hosting
- **Security**: Role-based access control with Firestore Security Rules

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- Firebase account
- Google Cloud Project with Firestore and Authentication enabled

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/student-management-dashboard.git
   cd student-management-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google Sign-In)
   - Create a Firestore database in production mode
   - Register a web app in your Firebase project
   - Copy your Firebase config from Project Settings > Your apps > Firebase SDK snippet

4. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. **Deploy Security Rules**
   ```bash
   npm run deploy:rules
   ```
   This will guide you through the process of deploying Firestore security rules.

6. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (usually http://localhost:5173).

7. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## 📁 Project Structure

```
src/
  ├── components/       # Reusable UI components
  │   ├── ui/          # Basic UI components (buttons, cards, etc.)
  │   ├── layout/      # Layout components (header, footer, etc.)
  │   └── charts/      # Data visualization components
  │
  ├── context/         # React Context providers
  │   ├── AuthContext.jsx  # Authentication state
  │   └── ThemeContext.jsx # Theme management
  │
  ├── forms/           # Form components
  │   └── StudentForm.jsx  # Student creation/editing form
  │
  ├── hooks/           # Custom React hooks
  │   └── useAuth.js   # Authentication hook
  │
  ├── pages/           # Page components
  │   ├── Dashboard.jsx    # Main dashboard
  │   ├── Login.jsx        # Login page
  │   ├── AddStudent.jsx   # Add student page
  │   └── EditStudent.jsx  # Edit student page
  │
  ├── services/        # API and service layer
  │   ├── studentService.js  # Student CRUD operations
  │   └── firebase.js        # Firebase configuration
  │
  └── utils/           # Utility functions
      └── validators.js     # Form validation schemas
```

## 🔌 Firebase Integration

The app uses Firebase for:

- **Authentication**: Google Sign-In
- **Database**: Firestore for storing student data
- **Security**: Fine-grained access control with Firestore Security Rules
- **Hosting**: Deploy directly to Firebase Hosting

### Security Rules

Security rules are defined in `firestore.rules` and deployed using:

```bash
npm run deploy:rules
```

## 🔒 Authentication

- Google Sign-In is implemented using Firebase Authentication
- Protected routes ensure only authenticated users can access the dashboard
- User sessions are persisted across page refreshes

## 📸 Screenshots

| Dashboard | Student Form | Mobile View |
|-----------|--------------|-------------|
| ![Dashboard](screenshots/dashboard.png) | ![Student Form](screenshots/form.png) | ![Mobile View](screenshots/mobile.png) |

## 🚀 Deployment

### Firebase Hosting

1. Install Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase project:
   ```bash
   firebase init
   ```
   - Select Hosting and Firestore
   - Choose your Firebase project
   - Set `dist` as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds: No

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for the amazing backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the awesome UI library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
