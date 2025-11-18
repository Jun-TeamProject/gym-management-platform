import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminMain from "./pages/AdminMain";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import MyProfile from "./pages/MyProfile";
import ProtectedRoute from "./component/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import ProductList from "./component/ProductList";
import BranchList from "./component/BranchList";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import AdminPage from "./pages/AdminPage";
import ProductPurchaseList from "./pages/ProductPurchaseList";
import AdminOverview from "./pages/AdminOverview";
import Calendar from "./component/Calender";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import PostsPage from "./pages/PostsPage";
import PostDetailPage from "./pages/PostDetailPage";
import ReservationPage from "./pages/ReservationPage";
import PaymentHistoryAdminPage from "./pages/PaymentHistoryAdminPage";
import UserDetailPage from "./pages/UserDetailPage";
import BranchListPage from "./pages/BranchListPage";
import BranchDetailPage from "./pages/BranchDetailPage";
import UserChatPage from "./pages/UserChatPage";
import AdminChatPage from "./pages/AdminChatPage";
import NotificationPage from "./pages/NotificationPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/callback" element={<OAuthRedirectHandler />} />

          <Route path="/branches" element={<BranchListPage />} />
          <Route path="/branches/:id" element={<BranchDetailPage />} />

          <Route
            element={
              <ProtectedRoute requiredRoles={["MEMBER", "TRAINER", "ADMIN"]} />
            }
          >
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/products" element={<ProductPurchaseList />} />
            <Route path="/attendances" element={<Calendar />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/community" element={<PostsPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
          </Route>

          {/*결제 관련 라우트 (MEMBER전용) //Todo: payment Fail Page 추가*/}
          <Route element={<ProtectedRoute requiredRoles={["MEMBER"]} />}>
            <Route path="/checkout/:productId" element={<CheckoutPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/purchases" element={<PaymentHistoryPage />} />
            <Route path="/chat" element={<UserChatPage />} />
            {/* <Route path="/payment/fail" element={<PaymentFailPage />} /> */}
          </Route>

          {/*관리자 전용 라우트 (ADMIN) //Todo: /admin/usres 경로 추가*/}
          <Route element={<ProtectedRoute requiredRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminMain />} />
            <Route path="/admin/users" element={<AdminPage />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/branches" element={<BranchList />} />
            <Route path="/admin/overview" element={<AdminOverview />} />
            <Route path="/admin/chat" element={<AdminChatPage />} />
            <Route
              path="/admin/payments"
              element={<PaymentHistoryAdminPage />}
            />
            <Route
              path="/admin/users/detail/:userId"
              element={<UserDetailPage />}
            />

            {/* <Route path="/payment/fail" element={<PaymentFailPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
