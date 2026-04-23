import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";

import FormInput from "../../common-components/FormInput";
import Button from "../../common-components/Button";
import api from "../../api/axios";

export default function VerifyEmailOtp() {
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
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
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              const res = await api.post("/auth/verify-account", {
                email: email,
                otp: values.otp,
              });

              if (res.data.success) {
                setStatus(res.data.message);
                setTimeout(() => {
                  navigate("/");
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
                Verify Email
              </h2>

              {/* OTP */}
              <FormInput
                label="OTP"
                name="otp"
                type="text"
                placeholder="Enter OTP"
                required
              />

              {/* Submit Button */}
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify Email"}
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
