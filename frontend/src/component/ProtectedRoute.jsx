import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/auth";

const ProtectedRoute = ({ requiredRoles }) => {
  //로그인 상태확인
  const { isAuthenticated } = authService.isAuthenticated();

  // 현재 사용자 정보
  const user = authService.getCurrentUser();

  // 사용자 객체에서 role필드 추출
  const role = user ? user.role : null;


  console.log(isAuthenticated);
  console.log(role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 권한이 없는 경우: 메인 페이지로 리다이렉션
  if (requiredRoles && !requiredRoles.includes(role)) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
