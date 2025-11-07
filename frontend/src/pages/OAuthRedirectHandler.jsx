import { useEffect } from "react";
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import useAuthStore from "../stores/authStore";
import storageService from "../services/storage";

const OAuthRedirectHandler = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const error = searchParams.get("error");
    const socialLoginSuccess = useAuthStore(state => state.socialLoginSuccess);
    console.log(searchParams);
    useEffect(() => {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        if (token){
            storageService.setAccessToken(token);
            storageService.setRefreshToken(refreshToken);
            const payloadJson = atob(token.split(".")[1]);
            const payload = JSON.parse(payloadJson);
            const user = {
                id: payload.id,
                email: payload.email,
                username: payload.username,
                role: payload.role,
            };
            storageService.setUser(user);

            socialLoginSuccess();
            navigate('/');
        }else{
            navigate('/login?error=social_login_failed');
        }
    },[location, navigate, searchParams]);
    return <div>로그인 처리 중...</div>
}
export default OAuthRedirectHandler;