# 🚀 How to Run This Project in VS Code - Complete Step-by-Step Guide

This guide will walk you through every step needed to run the Subscription-Based E-Commerce Platform in Visual Studio Code.

---

## 📋 Prerequisites

Before starting, make sure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open terminal and run `node --version`
   - Should show: `v16.x.x` or higher

2. **MongoDB** (Local or MongoDB Atlas)
   - **Option A - Local MongoDB:**
     - Download from: https://www.mongodb.com/try/download/community
     - Install and start MongoDB service
   - **Option B - MongoDB Atlas (Cloud - Recommended):**
     - Sign up at: https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get connection string

3. **VS Code** (Latest version)
   - Download from: https://code.visualstudio.com/

4. **Git** (Optional, for cloning)
   - Download from: https://git-scm.com/

---

## 📁 Step 1: Open Project in VS Code

1. **Open VS Code**
   - Launch Visual Studio Code

2. **Open the Project Folder**
   - Click `File` → `Open Folder...` (or press `Ctrl+K` then `Ctrl+O`)
   - Navigate to your project folder: `E:\RN project`
   - Click `Select Folder`

3. **Verify Project Structure**
   - You should see folders: `src/`, `server/`, `node_modules/`, etc.
   - If you see a popup asking to trust the folder, click `Yes, I trust the authors`

---

## 🔧 Step 2: Install Dependencies

### 2.1 Install Frontend Dependencies

1. **Open Terminal in VS Code**
   - Press `` Ctrl + ` `` (backtick) OR
   - Go to `Terminal` → `New Terminal`

2. **Navigate to Root Directory** (if not already there)
   ```bash
   cd "E:\RN project"
   ```

3. **Install Frontend Packages**
   ```bash
   npm install
   ```
   - Wait for installation to complete (may take 2-5 minutes)
   - You should see: `added X packages` message

### 2.2 Install Backend Dependencies

1. **Navigate to Server Directory**
   ```bash
   cd server
   ```

2. **Install Backend Packages**
   ```bash
   npm install
   ```
   - Wait for installation to complete
   - You should see: `added X packages` message

3. **Go Back to Root Directory**
   ```bash
   cd ..
   ```

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Create Backend .env File

1. **In VS Code, navigate to `server/` folder** in the file explorer

2. **Create `.env` file**
   - Right-click in `server/` folder → `New File`
   - Name it exactly: `.env` (with the dot at the beginning)

3. **Add Backend Environment Variables**
   - Open the `.env` file
   - Copy and paste the following:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/subscription_ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **If Using MongoDB Atlas:**
   - Replace `MONGODB_URI` with your Atlas connection string
   - Example: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/subscription_ecommerce`

5. **Save the file** (`Ctrl+S`)

### 3.2 Create Frontend .env File (Optional)

1. **Navigate to root folder** (not server folder)

2. **Create `.env` file** in root directory

3. **Add Frontend Environment Variables**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Save the file** (`Ctrl+S`)

---

## 🗄️ Step 4: Start MongoDB

### Option A: Local MongoDB

1. **Start MongoDB Service**
   - **Windows:** MongoDB should start automatically as a service
   - **If not running:**
     - Open Services (Win+R → type `services.msc`)
     - Find "MongoDB" service
     - Right-click → Start

2. **Verify MongoDB is Running**
   - Open a new terminal in VS Code
   - Run: `mongod --version` (should show version)
   - Or check if port 27017 is in use

### Option B: MongoDB Atlas (Cloud)

1. **No local setup needed** - MongoDB Atlas runs in the cloud
2. **Just make sure your `.env` file has the correct Atlas connection string**

---

## 🖥️ Step 5: Run the Backend Server

1. **Open a new terminal in VS Code**
   - Click the `+` button in terminal panel OR
   - Press `` Ctrl + Shift + ` ``

2. **Navigate to server directory**
   ```bash
   cd server
   ```

3. **Start the backend server**
   ```bash
   npm run dev
   ```
   - If `nodemon` is not installed, use: `npm start`
   - You should see messages like:
     ```
     Server running on port 5000
     MongoDB Connected
     ```

4. **Keep this terminal open** - The server must keep running

5. **Verify Backend is Running**
   - Open browser: http://localhost:5000
   - You might see an error (that's OK - it means server is running)
   - Or check terminal for "Server running" message

---

## 🎨 Step 6: Run the Frontend Application

1. **Open another new terminal** (keep backend terminal running)
   - Click the `+` button again to create a second terminal

2. **Navigate to root directory** (if not already there)
   ```bash
   cd "E:\RN project"
   ```
   - Or use: `cd ..` if you're in server folder

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

4. **Wait for Vite to start**
   - You should see:
     ```
     VITE v5.x.x  ready in xxx ms
     ➜  Local:   http://localhost:5173/
     ```

5. **Open the Application**
   - Press `Ctrl + Click` on the URL: `http://localhost:5173/`
   - OR manually open browser and go to: `http://localhost:5173/`

---

## ✅ Step 7: Verify Everything is Working

1. **Check Backend Terminal**
   - Should show: "Server running on port 5000"
   - Should show: "MongoDB Connected"

2. **Check Frontend Terminal**
   - Should show: "Local: http://localhost:5173/"

3. **Check Browser**
   - Should see the FreshCart homepage
   - Should see the modern grocery UI with green theme

4. **Test Basic Functionality**
   - Click "Shop" or "Products" link
   - Try registering a new account
   - Try logging in

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
**Solution:**
- Close any other applications using port 5000
- Or change PORT in `server/.env` to another port (e.g., 5001)
- Update `FRONTEND_URL` accordingly

### Issue 2: "MongoDB connection failed"
**Solution:**
- Check if MongoDB is running (for local)
- Verify `MONGODB_URI` in `server/.env` is correct
- For Atlas: Check your IP is whitelisted and credentials are correct

### Issue 3: "Cannot find module"
**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Issue 4: "Vite not found"
**Solution:**
- Make sure you're in the root directory (not server folder)
- Run `npm install` again

### Issue 5: "CORS error"
**Solution:**
- Check `FRONTEND_URL` in `server/.env` matches your frontend URL
- Should be: `FRONTEND_URL=http://localhost:5173`

### Issue 6: "Page not loading"
**Solution:**
- Check both terminals are running (backend + frontend)
- Check browser console for errors (F12)
- Verify URLs are correct

---

## 📝 Step 8: Create Admin User (Optional)

To access the admin dashboard:

1. **Register a normal user** through the website

2. **Update user role in MongoDB:**
   - Open MongoDB Compass or use MongoDB shell
   - Connect to: `mongodb://localhost:27017`
   - Database: `subscription_ecommerce`
   - Collection: `users`
   - Find your user document
   - Change `role` field from `"user"` to `"admin"`
   - Save

3. **Logout and login again** - You should now see "Admin" link

---

## 🎯 Quick Start Commands Summary

**Terminal 1 (Backend):**
```bash
cd server
npm install          # First time only
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd "E:\RN project"   # Or just root directory
npm install          # First time only
npm run dev
```

---

## 📚 Project Structure

```
E:\RN project\
├── src/              # Frontend React code
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── redux/         # State management
│   └── services/     # API services
├── server/           # Backend Node.js code
│   ├── controllers/  # Route handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── server.js     # Entry point
├── package.json      # Frontend dependencies
└── server/
    └── package.json  # Backend dependencies
```

---

## 🔄 Stopping the Servers

1. **Stop Frontend:**
   - Go to frontend terminal
   - Press `Ctrl + C`
   - Type `Y` if asked to confirm

2. **Stop Backend:**
   - Go to backend terminal
   - Press `Ctrl + C`
   - Type `Y` if asked to confirm

---

## 🚀 Next Steps After Running

1. **Explore the UI:**
   - Browse products
   - Register an account
   - Add items to cart
   - Create a subscription

2. **Test Features:**
   - Product listing with filters
   - Product details page
   - Shopping cart
   - Checkout process
   - User dashboard
   - Admin dashboard (if admin user created)

3. **Development:**
   - Make changes to code
   - Save files (auto-reloads)
   - Check browser for updates

---

## 💡 Tips for VS Code

1. **Install Recommended Extensions:**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets

2. **Use VS Code Features:**
   - `Ctrl + P` - Quick file search
   - `Ctrl + Shift + P` - Command palette
   - `Ctrl + B` - Toggle sidebar
   - `Ctrl + J` - Toggle terminal

3. **Debugging:**
   - Set breakpoints in code
   - Use browser DevTools (F12)
   - Check Network tab for API calls

---

## 📞 Need Help?

If you encounter any issues:

1. Check the terminal for error messages
2. Check browser console (F12 → Console tab)
3. Verify all environment variables are set correctly
4. Make sure MongoDB is running
5. Ensure both servers are running simultaneously

---

## ✅ Checklist

Before running, make sure:

- [ ] Node.js is installed
- [ ] MongoDB is installed/running (or Atlas configured)
- [ ] VS Code is installed
- [ ] Project folder is opened in VS Code
- [ ] Frontend dependencies installed (`npm install` in root)
- [ ] Backend dependencies installed (`npm install` in server/)
- [ ] Backend `.env` file created and configured
- [ ] Frontend `.env` file created (optional)
- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] Browser opens to http://localhost:5173

---

**🎉 Congratulations! Your project should now be running!**

Enjoy developing your modern grocery e-commerce platform! 🛒✨

