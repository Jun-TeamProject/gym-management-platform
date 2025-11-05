import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import MyProfile from './pages/MyProfile';
import ProtectedRoute from './component/ProtectedRoute';
import OAuthRedirectHandler from './pages/OAuthRedirectHandler';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/oauth2/callback" element={<OAuthRedirectHandler />} />
        <Route element={<ProtectedRoute requiredRoles={['MEMBER','ADMIN','TRAINER']} />}>
          <Route path="/" element={<HomePage />}/>
          <Route path="/myprofile" element={<MyProfile />} />
        </Route>
        <Route element={<ProtectedRoute requiredRoles={['ADMIN','MEMBER','TRAINER']} />}>
          <Route path="/admin" element={<AdminPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
};

export default App;
