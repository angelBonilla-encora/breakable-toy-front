import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";

export const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
