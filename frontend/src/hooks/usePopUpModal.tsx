import { useState } from "react";

function usePopUpModal<T>() {
  const [showPopUpModal, setShowPopUpModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [value, setValue] = useState("");

  function confirm({ item, value }: { item: any; value: string }) {
    setShowPopUpModal(true);
    setSelected(item);
    setValue(value);
  }

  function cancel() {
    setShowPopUpModal(false);
    setSelected(null);
  }

  return {
    value,
    selected,
    showPopUpModal,
    confirm,
    cancel,
  };
}

export default usePopUpModal;
