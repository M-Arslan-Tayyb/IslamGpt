import { useState } from "react";

export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] =
    (useState < UseConfirmationModalProps) | (null > null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (props) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsLoading(false);
    setTimeout(() => setModalProps(null), 300);
  };

  const handleConfirm = async () => {
    if (!modalProps) return;

    setIsLoading(true);
    try {
      await modalProps.onConfirm();
      closeModal();
    } catch (error) {
      console.error("Confirmation action failed:", error);
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    modalProps,
    openModal,
    closeModal,
    handleConfirm,
  };
};
