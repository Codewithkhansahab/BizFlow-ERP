# File Tree: Major Project

Generated on: 8/24/2025, 10:54:30 AM
Root path: `c:\Users\khant\Major Project`

```
├── 📁 .git/ 🚫 (auto-hidden)
├── 📁 .vscode/ 🚫 (auto-hidden)
├── 📁 backend/
│   ├── 📁 config/
│   │   ├── 📄 db.js
│   │   └── 📄 nodeMailer.js
│   ├── 📁 controllers/
│   │   ├── 📄 adminController.js
│   │   ├── 📄 attendaceController.js
│   │   ├── 📄 employeeController.js
│   │   ├── 📄 inventoryController.js
│   │   ├── 📄 leaveController.js
│   │   ├── 📄 notificationController.js
│   │   ├── 📄 projectController.js
│   │   ├── 📄 salaryController.js
│   │   ├── 📄 taskController.js
│   │   └── 📄 userController.js
│   ├── 📁 logs/
│   │   └── 📋 app.log 🚫 (auto-hidden)
│   ├── 📁 middlewares/
│   │   ├── 📄 authMiddleware.js
│   │   ├── 📄 errorMiddleware.js
│   │   ├── 📄 roleMiddleware.js
│   │   └── 📄 uploadMiddleware.js
│   ├── 📁 models/
│   │   ├── 📄 Attendace.js
│   │   ├── 📄 Employee.js
│   │   ├── 📄 Inventory.js
│   │   ├── 📄 Leave.js
│   │   ├── 📄 Notification.js
│   │   ├── 📄 ProfileUpdateRequest.js
│   │   ├── 📄 Project.js
│   │   ├── 📄 Salary.js
│   │   ├── 📄 Task.js
│   │   └── 📄 User.js
│   ├── 📁 node_modules/ 🚫 (auto-hidden)
│   ├── 📁 public/
│   │   └── 📁 uploads/
│   │       └── 📁 profile-images/
│   │           ├── 🖼️ profile-1755432255299-742574586.jpg
│   │           ├── 🖼️ profile-1755432366295-891832862.jpg
│   │           ├── 🖼️ profile-1755432596759-809392118.jpg
│   │           ├── 🖼️ profile-1755432707770-789306984.jpg
│   │           ├── 🖼️ profile-1755499981954-893918146.jpg
│   │           └── 🖼️ profile-1755502918172-120049367.jpg
│   ├── 📁 routes/
│   │   ├── 📄 adminRoutes.js
│   │   ├── 📄 attendanceRoutes.js
│   │   ├── 📄 employeeRoutes.js
│   │   ├── 📄 inventoryRoutes.js
│   │   ├── 📄 leaveRoutes.js
│   │   ├── 📄 notificationRoutes.js
│   │   ├── 📄 projectRoutes.js
│   │   ├── 📄 salaryRoutes.js
│   │   ├── 📄 taskRoutes.js
│   │   ├── 📄 uploadRoutes.js
│   │   └── 📄 userRoutes.js
│   ├── 📁 uploads/
│   │   ├── 🖼️ profile-1755194348372-291528803.jpg
│   │   ├── 🖼️ profile-1755197947250-266791748.JPG
│   │   ├── 🖼️ profile-1755199048477-548010678.jpg
│   │   ├── 🖼️ profile-1755282045630-940310171.jpg
│   │   ├── 🖼️ profile-1755367145922-321672381.jpg
│   │   ├── 🖼️ profile-1755425419952-938622725.jpg
│   │   ├── 🖼️ profile-1755431626030-882383625.jpg
│   │   ├── 🖼️ profile-1755508103544-633708810.jpg
│   │   ├── 🖼️ profile-1755516979906-925967296.jpg
│   │   ├── 🖼️ profile-1755519610286-877174763.jpg
│   │   ├── 🖼️ profile-1755795987270-475723411.png
│   │   └── 🖼️ profile-1755800995857-599769834.png
│   ├── 📁 util/
│   │   ├── 📄 generateToken.js
│   │   ├── 📄 logger.js
│   │   └── 📄 sendEmail.js
│   ├── 📁 validations/
│   │   ├── 📄 taskValidation.js
│   │   └── 📄 userValidation.js
│   ├── 🔒 .env 🚫 (auto-hidden)
│   ├── 🚫 .gitignore
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   ├── 📖 readme.md
│   └── 📄 server.js
└── 📁 client/
    ├── 📁 node_modules/ 🚫 (auto-hidden)
    ├── 📁 public/
    │   ├── 🖼️ generated-image (3).png
    │   ├── 🖼️ generated-image (4).png
    │   └── 🖼️ generated-image (5).png
    ├── 📁 src/
    │   ├── 📁 Admin/
    │   │   ├── 📁 components/
    │   │   │   ├── 📄 AdminAnnouncementCard.jsx
    │   │   │   ├── 📄 AdminDashboardStats.jsx
    │   │   │   ├── 📄 ProfileRequestsManagementCard.jsx
    │   │   │   ├── 📄 ProfileUpdateModal.jsx
    │   │   │   ├── 📄 RecentEmployeesCard.jsx
    │   │   │   └── 📄 RecentTasksCard.jsx
    │   │   ├── 📄 AdminDashboard.jsx
    │   │   └── 📄 ListRecentTasks.jsx
    │   ├── 📁 CEO/
    │   │   └── 📄 CEODashboard.jsx
    │   ├── 📁 Dashboard/
    │   │   ├── 📁 components/
    │   │   │   ├── 📄 UniversalCompleteProfile.jsx
    │   │   │   └── 📄 UniversalWelcomeHeader.jsx
    │   │   └── 📄 DashboardLayout.jsx
    │   ├── 📁 Employee/
    │   │   ├── 📁 components/
    │   │   │   ├── 📄 AttendanceCard.jsx
    │   │   │   ├── 📄 CurrentTaskCard.jsx
    │   │   │   ├── 📄 EmployeeDetailsCard.jsx
    │   │   │   ├── 📄 MyTasksCard.jsx
    │   │   │   ├── 📄 ProfileUpdateModal.jsx
    │   │   │   ├── 📄 WelcomeHeader.jsx
    │   │   │   └── 📄 WorkHoursCard.jsx
    │   │   ├── 📄 CompleteProfile.jsx
    │   │   ├── 📄 EmployeeDashboard.jsx
    │   │   ├── 📄 LeavePanel.jsx
    │   │   ├── 📄 MySalaries.jsx
    │   │   └── 📄 NotificationsPanel.jsx
    │   ├── 📁 HR/
    │   │   ├── 📁 components/
    │   │   │   ├── 📄 AttendanceOverviewCard.jsx
    │   │   │   ├── 📄 EmployeeManagementCard.jsx
    │   │   │   ├── 📄 HRAnnouncementCard.jsx
    │   │   │   ├── 📄 HRDashboardStats.jsx
    │   │   │   ├── 📄 LeaveManagementCard.jsx
    │   │   │   ├── 📄 ProfileRequestsCard.jsx
    │   │   │   └── 📄 SalaryFormModal.jsx
    │   │   ├── 📄 HRDashboard.jsx
    │   │   └── 📄 SalaryManagement.jsx
    │   ├── 📁 Manager/
    │   │   ├── 📁 components/
    │   │   │   ├── 📄 DashboardStats.jsx
    │   │   │   ├── 📄 ProfileUpdateRequestsCard.jsx
    │   │   │   ├── 📄 QuickAnnouncementCard.jsx
    │   │   │   ├── 📄 TaskCreationModal.jsx
    │   │   │   ├── 📄 TaskManagementCard.jsx
    │   │   │   └── 📄 TeamOverviewCard.jsx
    │   │   └── 📄 ManagerDashboard.jsx
    │   ├── 📁 assets/
    │   │   ├── 📄 _redirects
    │   │   └── 🖼️ react.svg
    │   ├── 📁 auth/
    │   │   ├── 📄 ForgotPassword.jsx
    │   │   ├── 📄 ResetPassword.jsx
    │   │   ├── 📄 ResetPasswordWithOTP.jsx
    │   │   └── 📄 VerifyOTP.jsx
    │   ├── 📁 components/
    │   │   ├── 📄 Header.jsx
    │   │   ├── 📄 Navbar.jsx
    │   │   ├── 📄 ProtectedRoute.jsx
    │   │   └── 📄 RoleRoute.jsx
    │   ├── 📁 context/
    │   │   ├── 📄 AppContext.jsx
    │   │   └── 📄 AuthContext.jsx
    │   ├── 📁 pages/
    │   │   ├── 📄 Home.jsx
    │   │   ├── 📄 Login.jsx
    │   │   ├── 📄 Messages.jsx
    │   │   ├── 📄 Profile.jsx
    │   │   ├── 📄 ResetPassword.jsx
    │   │   ├── 📄 Settings.jsx
    │   │   └── 📄 VerifyEmail.jsx
    │   ├── 📄 App.jsx
    │   ├── 🎨 index.css
    │   └── 📄 main.jsx
    ├── 🔒 .env 🚫 (auto-hidden)
    ├── 🚫 .gitignore
    ├── 📖 README.md
    ├── 📄 eslint.config.js
    ├── 🌐 index.html
    ├── 📄 package-lock.json
    ├── 📄 package.json
    └── 📄 vite.config.js
```

---
*Generated by FileTree Pro Extension*