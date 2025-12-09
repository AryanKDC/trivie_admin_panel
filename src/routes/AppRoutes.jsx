import { Routes, Route } from "react-router-dom";
import PortfolioList from "../pages/portfolio/PortfolioList";
import CategoryList from "../pages/categories/CategoryList";
import ListUsers from "../pages/users/ListUsers";
import Login from "../pages/login/Login";
import PortfolioAdd from "../pages/portfolio/PortfolioAdd";
import PortfolioEdit from "../pages/portfolio/PortfolioEdit";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PortfolioList />} />
    <Route path="/category" element={<CategoryList />} />
    <Route path="/users" element={<ListUsers />} />
    <Route path="/login" element={<Login />} />
    <Route path="/portfolio/add" element={<PortfolioAdd />} />
    <Route path="/portfolio/edit/:id" element={<PortfolioEdit />} />
  </Routes>
);

export default AppRoutes;
