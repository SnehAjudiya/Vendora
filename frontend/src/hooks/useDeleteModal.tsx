import { useState } from "react";

function useDeleteModal<T>() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);

  function confirmDelete(item: any) {
    setShowDeleteModal(true);
    setSelected(item);
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setSelected(null);
  }

  return {
    selected,
    showDeleteModal,
    confirmDelete,
    cancelDelete,
  };
}

export default useDeleteModal;
