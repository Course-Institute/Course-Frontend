# Session Management System Demo

## 🚀 **New Features Added**

### ✅ **5-Minute Session Management**
- Automatic session timeout after 5 minutes of inactivity
- Session timer displayed in the sidebar
- Visual countdown with color changes (red when < 1 minute)

### ✅ **Sidebar Enhancements**
- **Book Stack Icon**: Click the book stack icon in the sidebar header to close the sidebar
- **Logout Button**: Red logout button at the bottom of the sidebar
- **Session Timer**: Real-time countdown display
- **Session Status**: Visual indicator of remaining time

### ✅ **Session Warning Dialog**
- Automatic popup when session has less than 1 minute remaining
- Option to extend session or logout
- Beautiful progress bar showing session time remaining

### ✅ **Automatic Session Handling**
- Session persists across page refreshes
- Automatic logout when session expires
- Redirects to login page when not authenticated

---

## 🧪 **How to Test**

### **Step 1: Login**
1. Go to http://localhost:5175/
2. Click "App Login" in the footer or navbar
3. Use credentials: `demo@example.com` / `password123`
4. You'll be redirected to the admin dashboard

### **Step 2: Test Sidebar Features**
1. **Book Stack Icon**: Click the book stack icon in the sidebar header to close/open the sidebar
2. **Session Timer**: Watch the "Session: X:XX" timer in the sidebar footer
3. **Logout Button**: Click the red "Logout" button to end your session

### **Step 3: Test Session Management**
1. **Wait for Warning**: Wait until the session timer shows less than 1 minute
2. **Session Warning Dialog**: A dialog will automatically appear
3. **Extend Session**: Click "Extend Session" to add another 5 minutes
4. **Auto Logout**: Wait for the session to expire completely (5 minutes) to see automatic logout

### **Step 4: Test Session Persistence**
1. **Login**: Login to the admin dashboard
2. **Refresh Page**: Refresh the browser page
3. **Session Continues**: Your session should persist and continue counting down
4. **Navigate Away**: Try navigating to other pages and back

---

## 🎯 **Key Features**

### **Session Context**
- Global session management across the entire application
- Automatic session validation and cleanup
- Persistent session storage in localStorage

### **Visual Indicators**
- **Green Timer**: Normal session time (> 1 minute)
- **Red Timer**: Warning state (< 1 minute)
- **Progress Bar**: Visual representation of session time remaining

### **Security Features**
- Automatic logout on session expiry
- Session validation on page load
- Secure token storage and management

### **User Experience**
- Non-intrusive session warnings
- Easy session extension
- Clear logout options
- Responsive design for all screen sizes

---

## 🔧 **Technical Implementation**

### **Files Modified/Created**
- `src/contexts/SessionContext.tsx` - Session management context
- `src/components/SessionWarning.tsx` - Session warning dialog
- `src/components/admin/Sidebar.tsx` - Updated with logout and timer
- `src/pages/AdminDashboard.tsx` - Integrated session management
- `src/pages/LoginPage.tsx` - Updated to use session context
- `src/App.tsx` - Added SessionProvider wrapper

### **Session Duration**
- **Total Session**: 5 minutes (300 seconds)
- **Warning Time**: 1 minute before expiry
- **Timer Update**: Every 1 second

### **Session Storage**
- `authToken` - Authentication token
- `userRole` - User role (admin, student, center)
- `sessionStart` - Session start timestamp
- `keepSignedIn` - User preference for staying signed in

---

## 🎨 **UI/UX Features**

### **Sidebar Design**
- Clean, modern interface
- Book stack icon for intuitive sidebar toggle
- Prominent logout button with hover effects
- Real-time session countdown

### **Session Warning Dialog**
- Beautiful modal design with rounded corners
- Progress bar showing session time remaining
- Clear action buttons (Extend/Logout)
- Non-dismissible (user must choose an action)

### **Color Coding**
- **Green**: Normal session time
- **Red**: Warning state and logout actions
- **Blue**: Primary actions and navigation

---

## 🚨 **Troubleshooting**

### **Session Not Working**
1. Check browser console for errors
2. Verify localStorage is enabled
3. Clear browser cache and try again

### **Timer Not Updating**
1. Refresh the page
2. Check if JavaScript is enabled
3. Verify session context is properly loaded

### **Logout Not Working**
1. Check if you're on the admin dashboard
2. Verify session context is active
3. Try refreshing the page

---

## 📱 **Mobile Compatibility**

- Fully responsive sidebar design
- Touch-friendly buttons and icons
- Mobile-optimized session warning dialog
- Adaptive layout for all screen sizes

---

**🎉 The session management system is now fully integrated and ready to use!**
