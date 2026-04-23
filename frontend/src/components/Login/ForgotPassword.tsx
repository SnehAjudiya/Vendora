import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import FormInput from "../../common-components/FormInput";
import Button from "../../common-components/Button";
import api from "../../api/axios";



export default function ForgotPassword() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {

              const res = await api.post("/auth/send-reset-otp", {
                email: values.email
              });

              if (res.data.success) {
                setStatus(res.data.message);

                setTimeout(() => {
                  navigate("/reset-password", {
                    state: { email: values.email }
                  });
                }, 1200);

              } else {
                setStatus(res.data.message);
              }

            } catch (error: any) {
              setStatus(error.response?.data?.message || "Error sending OTP");
            }

            setSubmitting(false);
}}
        >
          {({ isValid, isSubmitting, status }) => (
            <Form className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 w-[320px] flex flex-col gap-4">

              <h2 className="text-3xl font-bold text-center dark:text-white mb-1">
                Password Reset
              </h2>

              <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                Enter your email to receive reset link
              </p>

              {/* Email */}
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
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
