import { useState } from "react";

function useShowPassword() {
  const [showPassword, setShowPassword] = useState(false);
  function togglePassword() {
    setShowPassword(!showPassword);
  }
  return {
    showPassword,
    togglePassword,
  };
}

export default useShowPassword;
