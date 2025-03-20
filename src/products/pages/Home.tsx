import { useState } from "react";
import { CreateProductModal, MetricsSummary, ProductsTable, SearchProduct } from "../components";
import UserLayout from "@/layouts/UserLayout";

export const Home = () => {
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    availability: "",
    page: 0,
  });

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <UserLayout>
      <SearchProduct onSearch={handleSearch} />
      <CreateProductModal />
      <ProductsTable filters={filters} />
      <MetricsSummary />
    </UserLayout>
  );
};