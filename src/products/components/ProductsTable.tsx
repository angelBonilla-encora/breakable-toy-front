import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Chip,
  Spinner,
  Button,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { getDateColor, getStockColor } from "../utils";
import { DeleteIcon } from "../icons";
import { productColumns } from "../data/columns";
import Swal from "sweetalert2";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useMarkProductOutOfStockMutation,
  useRestoreProductStockMutation,
} from "@/redux/api/inventoryApi";
import { Product, Sort, SortDirection } from "../models";
import { EditProductModal } from ".";

export const ProductsTable = ({ filters }: { filters: any }) => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<Sort>({
    key: "name",
    direction: SortDirection.asc,
  });

  const { data, isLoading } = useGetProductsQuery({
    ...filters,
    category: filters.category || [],
    page,
    sort: `${sort.key},${sort.direction}`,
  });

  let products : Product[]= data?.content ?? [];
  let totalPages = data?.totalPages ?? 1;

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const initialOutOfStock : Set<string> = new Set(
      products.filter((p: Product) => p.quantityInStock === 0).map((p: Product) => p.id)
    );
    setSelectedKeys(initialOutOfStock);
  }, [products]);

  const [deleteProduct] = useDeleteProductMutation();
  const [markProductOutOfStock] = useMarkProductOutOfStockMutation();
  const [restoreProductStock] = useRestoreProductStockMutation();

  const handleSort = (key: string) => {
    setSort((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === SortDirection.asc
          ? SortDirection.desc
          : SortDirection.asc,
    }));
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Do you want to delete it?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id).unwrap();
          Swal.fire("Deleted!", "", "success");
        } catch (error) {
          Swal.fire("Error!", "Could not delete the product", "error");
        }
      }
    });
  };

  const handleSelection = async (newSelectedKeys: any) => {
    const updatedSelection : Set<string> = new Set(newSelectedKeys);
    setSelectedKeys(updatedSelection );
    
    for (const id of products.map((p: Product) => p.id)) {
      const isNowSelected = updatedSelection.has(id);
      const wasPreviouslySelected = selectedKeys.has(id);
      
      if (isNowSelected && !wasPreviouslySelected) {
        await markProductOutOfStock(id);
      } else if (!isNowSelected && wasPreviouslySelected) {
        await restoreProductStock(id);
      }
    }
  };

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Spinner color="default" label="Loading..." />
        </div>
      )}
      <Table
        className="mt-6 text-black"
        aria-label="Controlled table example with dynamic content"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={handleSelection}
        bottomContent={
          totalPages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page + 1}
                total={totalPages}
                onChange={(page) => setPage(page - 1)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={productColumns}>
          {(column) => (
            <TableColumn key={column.id} onClick={() => handleSort(column.id)}>
              <div className="flex items-center gap-2">
                {column.label}
                {column.id !== "actions" && <span className="ml-1 hover:cursor-pointer">⇅</span>}
              </div>
            </TableColumn>
          )}
        </TableHeader>

        {
          products.length != 0
          ? (
        <TableBody items={products}>
          {(item: Product) => (
            <TableRow key={item.id} className={getDateColor(new Date(item.expirationDate))}>
              {(columnKey) => {
                if (columnKey === "quantityInStock") {
                  return (
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={getStockColor(item.quantityInStock)}
                        size="sm"
                        variant="flat"
                      >
                        {item.quantityInStock}
                      </Chip>
                    </TableCell>
                  );
                }else if (columnKey === "name") {
                  return <TableCell className={item.quantityInStock == 0 ? "line-through" : ""}>{item.name}</TableCell>;
                } 
                else if (columnKey === "category") {
                  return <TableCell className={item.quantityInStock == 0 ? "line-through" : ""}>{item.category.name}</TableCell>;
                } else if (columnKey === "price") {
                  return <TableCell className={item.quantityInStock == 0 ? "line-through" : ""}>${item.price}</TableCell>;
                } else if (columnKey === "expirationDate") {
                  return <TableCell className={item.quantityInStock == 0 ? "line-through" : ""}>{new Date(item.expirationDate).toLocaleDateString()}</TableCell>;
                } else if (columnKey === "actions") {
                  return (
                    <TableCell>
                      <div className="flex gap-2">
                        <EditProductModal productId={item.id} />
                        <Button variant="bordered" isIconOnly onPress={() => handleDelete(item.id)}>
                          <DeleteIcon className="text-red-500 hover:text-red-700 cursor-pointer w-5 h-5" />
                        </Button>
                      </div>
                    </TableCell>
                  );
                } else {
                  return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
                }
              }}
            </TableRow>
          )}
        </TableBody>
          )
          : (
            <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
          )
        }
      
      </Table>
    </>
  );
};