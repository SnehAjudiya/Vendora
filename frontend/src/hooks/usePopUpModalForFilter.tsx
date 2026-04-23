import { useState } from "react";

export default function usePopUpModalForFilter() {
  const [showPopUpModal, setShowPopUpModal] = useState(false);

  function confirm() {
    setShowPopUpModal(true);
  }

  function cancel() {
    setShowPopUpModal(false);
  }

  return {
    showPopUpModal,
    confirm,
    cancel,
  };
}