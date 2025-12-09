import { Routes, Route } from "react-router-dom";
import PortfolioList from "../pages/portfolio/PortfolioList";
import CategoryList from "../pages/categories/CategoryList";
import ListUsers from "../pages/users/ListUsers";
import Login from "../pages/login/Login";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PortfolioList />} />
    <Route path="/category" element={<CategoryList />} />
    <Route path="/users" element={<ListUsers />} />
    <Route path="/login" element={<Login/ >} />
  </Routes>
);

export default AppRoutes;
