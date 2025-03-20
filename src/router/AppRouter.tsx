import { ProductRoutes } from "@/products/routes/ProductRoutes";
import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<ProductRoutes />} />
    </Routes>
  );
};
