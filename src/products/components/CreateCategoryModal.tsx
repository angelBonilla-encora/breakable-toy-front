import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
  } from "@heroui/react";
  import Swal from "sweetalert2";
  import { FC, useState } from "react";
import { useCreateCategoryMutation } from '../../redux/api/inventoryApi';
  
  interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoryCreated: (newCategoryId: string) => void;
  }
  
  export const CreateCategoryModal: FC<CreateCategoryModalProps> = ({
    isOpen,
    onClose,
    onCategoryCreated,
  }) => {
    const [createCategory] = useCreateCategoryMutation();
    const [categoryName, setCategoryName] = useState("");
  
    const handleCreateCategory = async () => {
      if (!categoryName.trim()) {
        Swal.fire("Error", "Category name cannot be empty", "error");
        return;
      }
  
      try {
        const newCategory = await createCategory({ name: categoryName }).unwrap();
        onCategoryCreated(newCategory.id);
        onClose();
        Swal.fire("Success", "Category created successfully!", "success");
      } catch (error: any) {
        console.error("Error creating category:", error);
        Swal.fire("Error", error.data?.message || "Error creating category", "error");
      }
    };
  
    return (
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader>Create New Category</ModalHeader>
          <ModalBody>
            <Input
              label="Category Name"
              value={categoryName}
              minLength={3}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleCreateCategory}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };