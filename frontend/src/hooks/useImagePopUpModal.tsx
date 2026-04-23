import { useState } from "react";

function useImagePopUpModal<T>() {
  const [showImagePopUpModal, setShowImagePopUpModal] = useState(false);
  const [selected, setSelected] = useState("");

  function confirmImagePopUp(item: any) {
    setShowImagePopUpModal(true);
    setSelected(item);
  }

  function cancelImagePopUp() {
    setShowImagePopUpModal(false);
    setSelected("");
  }

  return {
    selected,
    showImagePopUpModal,
    confirmImagePopUp,
    cancelImagePopUp,
  };
}

export default useImagePopUpModal;
