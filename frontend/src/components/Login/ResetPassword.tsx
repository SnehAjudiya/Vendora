import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";

import FormInput from "../../common-components/FormInput";
import Button from "../../common-components/Button";
import api from "../../api/axios";

export default function ResetPassword() {
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must not exceed 15 characters")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must contain at least one special character",
      )
      .required("New password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="relative flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-5 right-5 bg-gray-200 dark:bg-gray-800 dark:text-white px-3 py-1 rounded"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        <Formik
          initialValues={{
            otp: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              const res = await api.post("/auth/reset-password", {
                email: email,
                otp: values.otp,
                newPassword: values.password,
              });

              if (res.data.success) {
                setStatus(res.data.message);
                setTimeout(() => {
                  navigate("/login");
                }, 1500);
              } else {
                setStatus(res.data.message);
              }
            } catch (error: any) {
              setStatus(
                error.response?.data?.message || "Something went wrong",
              );
            }
            setSubmitting(false);
          }}
        >
          {({ isValid, isSubmitting, status }) => (
            <Form className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 w-[320px] flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-center dark:text-white mb-1">
                Reset Password
              </h2>

              {/* OTP */}
              <FormInput
                label="OTP"
                name="otp"
                type="text"
                placeholder="Enter OTP"
                required
              />

              {/* New Password */}
              <FormInput
                label="New Password"
                name="password"
                type="password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />

              {/* Confirm Password */}
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                showPassword={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                required
              />

              {/* Submit Button */}
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>

              {status && (
                <div className="text-green-600 text-xs text-center">
                  {status}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
