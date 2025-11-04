// src/api/authApi.js

import apiClient from './apiClient';

// 1. 일반 로그인 API 호출
export const loginApi = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        
        // 백엔드에서 응답 받은 JWT 토큰과 사용자 역할(role)을 반환합니다.
        // Spring Boot API 명세서: POST /api/auth/login
        return {
            token: response.data.accessToken,
            role: response.data.role, // 백엔드가 role을 포함하여 응답해야 함
            userData: response.data.user // 기타 사용자 정보 (선택)
        };
    } catch (error) {
        // 서버 에러 메시지를 던지거나, 실패를 알립니다.
        throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
    }
};

// 2. 회원가입 API 호출
export const signupApi = async (userData) => {
    try {
        // Spring Boot API 명세서: POST /api/users
        const response = await apiClient.post('/users', userData);
        return response.data; // 가입 성공 정보 반환
    } catch (error) {
        throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
};

// 3. 내 정보 조회 API 호출
export const fetchMyInfoApi = async () => {
    try {
        // Spring Boot API 명세서: GET /api/users/me
        const response = await apiClient.get('/users/me');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || '사용자 정보를 가져오는 데 실패했습니다.');
    }
};