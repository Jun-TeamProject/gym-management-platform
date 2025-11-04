// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Route/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';

// Member Pages
import MyPage from './pages/member/MyPage';
import SchedulePage from './pages/member/SchedulePage';

// Trainer Pages
import TrainerSchedulePage from './pages/trainer/TrainerSchedulePage';

// Admin Pages
import AdminUserManagePage from './pages/admin/AdminUserManagePage';
import AdminSalesPage from './pages/admin/AdminSalesPage';


const App = () => {
  return (
    <AuthProvider> {/* 전체 애플리케이션에 인증 컨텍스트 제공 */}
      <Router>
        <Routes>
          {/* 1. Public Routes: 누구나 접근 가능 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 2. Protected Routes (로그인 필요) */}
          <Route element={<ProtectedRoute requiredRoles={['MEMBER', 'TRAINER', 'ADMIN']} />}>
             {/* MEMBER 전용 라우트 */}
             <Route path="/mypage" element={<MyPage />} />
             <Route path="/schedule" element={<SchedulePage />} />
             {/* TRAINER 전용 라우트 (ADMIN도 접근 가능하도록 권한 추가) */}
             <Route path="/trainer/schedule" element={<ProtectedRoute requiredRoles={['TRAINER', 'ADMIN']} />}>
                 <Route index element={<TrainerSchedulePage />} />
             </Route>
          </Route>
          
          {/* 3. Admin-Only Routes (ADMIN만 접근 가능) */}
          <Route element={<ProtectedRoute requiredRoles={['ADMIN']} />}>
              <Route path="/admin/users" element={<AdminUserManagePage />} />
              <Route path="/admin/sales" element={<AdminSalesPage />} />
          </Route>

          {/* 4. Not Found Route */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;