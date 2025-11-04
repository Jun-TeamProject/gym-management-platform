import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginApi } from '../api/authApi';

const AuthContext = createContext();

// 2. Provider 컴포넌트
export const AuthProvider = ({ children }) => {
    // 초기 상태: 로컬 스토리지에서 JWT 및 사용자 정보 로드 시도
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [role, setRole] = useState(localStorage.getItem('userRole') || null);

    // 컴포넌트 마운트 시 토큰 및 역할 설정
    useEffect(() => {
        if (token) {
            // 실제 프로젝트에서는 여기서 토큰 유효성 검증 API 호출 및 사용자 정보(role 포함)를 가져와야 함
            setIsAuthenticated(true);
            setRole(localStorage.getItem('userRole'));
            // setUser(가져온 사용자 상세 정보)
        } else {
            setIsAuthenticated(false);
            setRole(null);
            setUser(null);
        }
    }, [token]);

    // 3. 로그인 함수
    const login = async (email, password) => {
    try {
        const { token, role, userData } = await loginApi(email, password); // API 호출
        
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userRole', role);
        setToken(token);
        setRole(role);
        setUser(userData); // API에서 받은 상세 정보 저장
        setIsAuthenticated(true);
        return true; // 로그인 성공
    } catch (error) {
        console.error("로그인 시도 중 에러:", error.message);
        throw error; // 에러를 호출한 컴포넌트로 다시 던짐
    }
};

    // 4. 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        setToken(null);
        setRole(null);
        setUser(null);
        setIsAuthenticated(false);
    };
    
    // 5. Context Value
    const contextValue = {
        user,
        role,
        isAuthenticated,
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 6. Hook 생성
export const useAuth = () => useContext(AuthContext);