import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/auth";

const ProtectedRoute = ({requiredRoles}) => {
  // const {isAuthenticated, role} = authService.isAuthenticated();
  const isAuthenticated = authService.isAuthenticated();
  const role = authService.getRole();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // 2. 권한이 없는 경우: 403 페이지나 메인 페이지로 리다이렉션
  console.log(requiredRoles,role, requiredRoles.includes(role));
  if (requiredRoles && !requiredRoles.includes(role)) {
    // alert("접근 권한이 없습니다.");
    // 권한 없는 경우 메인 페이지 또는 403 에러 페이지로 이동
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
