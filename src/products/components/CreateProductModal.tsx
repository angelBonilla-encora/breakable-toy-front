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
  Select,
  SelectItem,
} from "@heroui/react";
import { useCreateProductMutation, useGetCategoriesQuery } from "../../redux/api/inventoryApi";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { Category } from "../models";
import Swal from "sweetalert2";
import { CreateCategoryModal } from "./CreateCategoryModal";

export const CreateProductModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const categoryModal = useDisclosure();
  const today = dayjs().startOf("day");

  const { data, refetch } = useGetCategoriesQuery({});
  const [createProduct] = useCreateProductMutation();
  const categories = data?.content ?? [];

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      category_id: "",
      quantityInStock: 0,
      price: 0,
      expirationDate: null,
    },
  });

  const onSubmit = async (formData: any) => {
    try {
      const formattedData = {
        ...formData,
        expirationDate: formData.expirationDate
          ? dayjs(formData.expirationDate).format("YYYY-MM-DD")
          : null,
      };

      await createProduct(formattedData).unwrap();

      Swal.fire({
        icon: "success",
        title: "Product created",
        text: "Product created successfully",
        confirmButtonColor: "#3085d6",
      });

      reset();
    } catch (error: any) {
      console.error("Error creating product:", error);
      Swal.fire("Error", error.data?.message || "Error creating product", "error");
    }
  };

  const handleCategorySelection = (value: string) => {
    if (value === "create_new") {
      categoryModal.onOpen();
    } else {
      setValue("category_id", value);
    }
  };

  const handleCategoryCreated = async (newCategoryId: string) => {
    await refetch();
    setValue("category_id", newCategoryId);
  };

  return (
    <div className="mt-6">
      <Button onPress={onOpen}>New Product</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form className="mt-6 w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Create Product</ModalHeader>
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
                      isInvalid={invalid}
                      className="w-full"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="category_id"
                  rules={{ required: "Category is required" }}
                  render={({ field: { value }, fieldState: { invalid, error } }) => (
                    <Select
                      selectedKeys={value ? new Set([value]) : new Set()}
                      onSelectionChange={(keys) => handleCategorySelection(Array.from(keys)[0] as string ?? "")}
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
                      <SelectItem key="create_new" textValue="Create New Category" className="bg-slate-200">
                        Create New Category
                      </SelectItem>
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
                  render={({ field, fieldState: { invalid, error } }) => (
                    <NumberInput
                      {...field}
                      onChange={(value) => field.onChange(Number(value))}
                      label="Stock"
                      isRequired
                      errorMessage={error?.message}
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
                  render={({ field, fieldState: { invalid, error } }) => (
                    <NumberInput
                      {...field}
                      onChange={(value) => field.onChange(Number(value))}
                      label="Unit Price"
                      isRequired
                      errorMessage={error?.message}
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
                      validDate: value => {
                        if (value && dayjs(value).isBefore(today, 'day')) {
                          return "Expiration date must be today or later";
                        }
                        return true;
                      },
                    },
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <DatePicker
                      {...field}
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
                  Create Product
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      <CreateCategoryModal
        isOpen={categoryModal.isOpen}
        onClose={categoryModal.onClose}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
};