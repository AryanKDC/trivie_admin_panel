import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import PortfolioList from "../pages/portfolio/PortfolioList";
import CategoryList from "../pages/categories/CategoryList";
import ListUsers from "../pages/users/ListUsers";
import Login from "../pages/login/Login";
import PortfolioAdd from "../pages/portfolio/PortfolioAdd";
import PortfolioEdit from "../pages/portfolio/PortfolioEdit";
import ResetPasswordPage from "../components/ResetPasswordPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<PortfolioList />} />
      <Route path="/category" element={<CategoryList />} />
      <Route path="/portfolio/add" element={<PortfolioAdd />} />
      <Route path="/portfolio/edit/:id" element={<PortfolioEdit />} />
    </Route>

    <Route element={<AdminRoute />}>
      <Route path="/users" element={<ListUsers />} />
    </Route>

    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

  </Routes>
);

export default AppRoutes;
