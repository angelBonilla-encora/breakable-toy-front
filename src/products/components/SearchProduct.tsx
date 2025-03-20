import { useState } from "react";
import { useGetCategoriesQuery } from "@/redux/api/inventoryApi";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, Select, SelectItem, Spinner } from "@heroui/react";
import { availabilities } from '../data/availabilities';
import { Category } from "../models";



export const SearchProduct = ({ onSearch }: { onSearch: (filters: any) => void }) => {
  const [values, setValues] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    name: "",
    category: [],
    availability: "",
  });

  const { data: categoryData, isLoading: loadingCategories } = useGetCategoriesQuery({});
  const categories = categoryData?.content ?? [];

  const handleSelection = (selectedKeys: any) => {
    setValues(selectedKeys);
    setFilters((prev) => ({
      ...prev,
      category: Array.from(selectedKeys),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <Card>
      <div className="grid grid-cols-2 p-6">
        <div>
          <Input
            label="Product Name"
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
          />

          <div className="flex w-full flex-col gap-2 mt-4">
            {loadingCategories ? (
              <div className="flex justify-center items-center">
                <Spinner color="default" label="Loading Categories..." />
              </div>
            ) : (
              <Select
                className="w-full"
                label="Category"
                placeholder="Select categories"
                selectedKeys={values}
                selectionMode="multiple"
                onSelectionChange={handleSelection}
              >
                {categories.map((category : Category) => (
                  <SelectItem key={category.name}>{category.name}</SelectItem>
                ))}
                <SelectItem key="">
                  All
                </SelectItem>
              </Select>
            )}
          </div>

          <div className=" lg:flex lg:justify-between lg:items-end rounded-lg">
            <Select
              className="max-w-xs mt-4"
              defaultSelectedKeys={"all"}
              label="Availability"
              placeholder="Select an availability"
              value={filters.availability}
              onChange={(e) => setFilters((prev) => ({
                ...prev,
                availability: e.target.value,
              }))}
            >
              {availabilities.map((availability) => (
                <SelectItem key={availability.key}>{availability.label}</SelectItem>
              ))}
            </Select>
            <Button className="mt-4 lg:mt-0" color="primary" onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};