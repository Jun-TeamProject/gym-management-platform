import axios from 'axios';

// 1. Axios 인스턴스 생성
// package.json에 proxy 설정을 했다면, baseURL은 공백으로 둡니다.
const apiClient = axios.create({
    baseURL: '/api', // 모든 요청 앞에 /api를 붙여 명세서와 일치시킵니다.
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. 요청 인터셉터 설정: 모든 요청에 JWT 토큰 자동 삽입
apiClient.interceptors.request.use(
    (config) => {
        // 로컬 스토리지에서 토큰을 가져옵니다.
        const token = localStorage.getItem('accessToken');
        
        // 토큰이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가합니다.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 응답 인터셉터 설정: 토큰 만료 등 에러 처리
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 예: 401 Unauthorized 에러 발생 시 자동 로그아웃 처리
        if (error.response && error.response.status === 401) {
            // 토큰 만료 또는 인증 실패 시
            console.error("인증 실패 또는 토큰 만료. 로그아웃 처리.");
            // 여기서 AuthContext의 logout 함수를 호출하거나,
            // window.location.href='/login' 등을 통해 로그인 페이지로 이동시킬 수 있습니다.
            // (주의: Context 외부이므로 직접 window.location을 사용하거나, Context를 import 해야 합니다.)
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;