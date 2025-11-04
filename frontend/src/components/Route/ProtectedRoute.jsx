// src/components/Route/ProtectedRoute.js

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * @param {string[]} requiredRoles - 이 라우트에 접근 가능한 역할 배열 (예: ['ADMIN', 'TRAINER'])
 */
const ProtectedRoute = ({ requiredRoles }) => {
    const { isAuthenticated, role } = useAuth();

    // 1. 인증되지 않은 경우: 로그인 페이지로 리다이렉션
    if (!isAuthenticated) {
        alert('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }

    // 2. 권한이 없는 경우: 403 페이지나 메인 페이지로 리다이렉션
    if (requiredRoles && !requiredRoles.includes(role)) {
        alert('접근 권한이 없습니다.');
        // 권한 없는 경우 메인 페이지 또는 403 에러 페이지로 이동
        return <Navigate to="/" replace />;
    }

    // 3. 인증되고 권한도 있는 경우: 요청된 컴포넌트를 렌더링
    return <Outlet />;
};

export default ProtectedRoute;