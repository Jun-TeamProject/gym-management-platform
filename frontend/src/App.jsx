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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/callback" element={<OAuthRedirectHandler />} />

          <Route
            element={
              <ProtectedRoute requiredRoles={["MEMBER", "TRAINER", "ADMIN"]} />
            }
          >
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/products" element={<ProductPurchaseList />} />
          </Route>

          {/*결제 관련 라우트 (MEMBER전용) //Todo: payment Fail Page 추가*/}
          <Route element={<ProtectedRoute requiredRoles={["MEMBER"]} />}>
            <Route path="/checkout/:productId" element={<CheckoutPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            {/* <Route path="/payment/fail" element={<PaymentFailPage />} /> */}
          </Route>

          {/*관리자 전용 라우트 (ADMIN) //Todo: /admin/usres 경로 추가*/}
          <Route element={<ProtectedRoute requiredRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminMain />} />
            <Route path="/admin/users" element={<AdminPage />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/branches" element={<BranchList />} />
            <Route path="/admin/overview" element={<AdminOverview />} />

            {/* <Route path="/payment/fail" element={<PaymentFailPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
