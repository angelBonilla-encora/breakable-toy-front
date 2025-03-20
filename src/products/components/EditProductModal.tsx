import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  DatePicker,
  NumberInput,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { Controller, useForm } from "react-hook-form";
import { EditIcon } from "../icons";
import { FC, useEffect } from "react";
import { useGetCategoriesQuery, useGetProductQuery, useUpdateProductMutation } from "../../redux/api/inventoryApi";
import dayjs from "dayjs";
import { Category } from "../models";
import Swal from "sweetalert2";

interface Props {
  productId: string;
}

export const EditProductModal: FC<Props> = ({ productId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const today = dayjs().startOf("day");

  const { data: categoriesData } = useGetCategoriesQuery({});
  const categories = categoriesData?.content ?? [];

  const [updateProduct] = useUpdateProductMutation();

  const { data: post, isLoading, error, refetch } = useGetProductQuery(productId);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      category_id: "",
      quantityInStock: 0,
      price: 0,
      expirationDate: "",
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        name: post.name || "",
        category_id: post.category?.id?.toString() || "",
        quantityInStock: post.quantityInStock || 0,
        price: post.price || 0,
        expirationDate: post.expirationDate || "",
      });
    }
  }, [post, reset]);

  const onSubmit = async (formData: any) => {
    try {
      const formattedData = {
        ...formData,
        expirationDate: formData.expirationDate
          ? dayjs(formData.expirationDate).format("YYYY-MM-DD")
          : null,
      };

      const body = {
        productId,
        updatedProduct: formattedData,
      };

      await updateProduct(body).unwrap();
      
      Swal.fire({
        icon: "success",
        title: "Product updated",
        text: "Product updated successfully",
        confirmButtonColor: "#3085d6",
      });
      
      await refetch();
      reset();
    } catch (error: any) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.data?.message || "Error updating product",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner color="default" label="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading product data.</div>;
  }

  return (
    <div>
      <Button variant="bordered" isIconOnly onPress={onOpen}>
        <EditIcon className="text-gray-500 hover:text-gray-700 cursor-pointer w-5 h-5" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form className="mt-6 w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Edit Product</ModalHeader>

              <ModalBody>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Product name is required", minLength: 2 }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      label="Product Name"
                      isRequired
                      errorMessage={error?.message}
                      validationBehavior="aria"
                      isInvalid={invalid}
                      className="w-full"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="category_id"
                  rules={{ required: "Category is required" }}
                  render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                    <Select
                      selectedKeys={value ? new Set([value.toString()]) : new Set()}
                      onSelectionChange={(keys) => onChange(Array.from(keys)[0]?.toString() || "")}
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      className="w-full"
                      label="Select a category"
                    >
                      {categories.map((category: Category) => (
                        <SelectItem key={category.id} textValue={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="quantityInStock"
                  rules={{
                    required: "Stock is required",
                    min: { value: 1, message: "Must be at least 1" },
                  }}
                  render={({ field: { onChange, ...field }, fieldState: { invalid, error } }) => (
                    <NumberInput
                      {...field}
                      onChange={(value) => onChange(Number(value))}
                      label="Stock"
                      isRequired
                      errorMessage={error?.message}
                      validationBehavior="aria"
                      isInvalid={invalid}
                      className="w-full"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="price"
                  rules={{
                    required: "Unit price is required",
                    min: { value: 0.01, message: "Price must be greater than 0" },
                  }}
                  render={({ field: { onChange, ...field }, fieldState: { invalid, error } }) => (
                    <NumberInput
                      {...field}
                      onChange={(value) => onChange(Number(value))}
                      label="Unit Price"
                      isRequired
                      errorMessage={error?.message}
                      validationBehavior="aria"
                      isInvalid={invalid}
                      className="w-full"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="expirationDate"
                  rules={{
                    validate: {
                      validDate: (value) => {
                        if (value && dayjs(value).isBefore(today, "day")) {
                          return "Expiration date must be today or later";
                        }
                        return true;
                      },
                    },
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <DatePicker
                      value={field.value ? parseDate(dayjs(field.value).format("YYYY-MM-DD")) : undefined}
                      onChange={(date) => field.onChange(date ? date.toString() : null)}
                      label="Expiration Date"
                      errorMessage={error?.message}
                      validationBehavior="aria"
                      isInvalid={invalid}
                      className="w-full"
                    />
                  )}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Update Product
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};