import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import FormInput from "../../common-components/FormInput";
import Button from "../../common-components/Button";
import useShowPassword from "../../hooks/useShowPassword";

import { useAppDispatch } from "../../redux/hooks/hooks";
import { checkAuth, login } from "../../redux/slice/AuthSlice";
import api from "../../api/axios";

export default function Login() {
  const passwordModal = useShowPassword();

  const dispatch = useAppDispatch();

  const [darkMode, setDarkMode] = useState(false);
  const [rememberedEmail, setRememberedEmail] = useState("");
  const [rememberedPassword, setRememberedPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  // Load remembered email on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");

    if (storedEmail && storedPassword) {
      setRememberedEmail(storedEmail);
      setRememberedPassword(storedPassword);
      setRemember(true);
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const initialValues = {
    email: rememberedEmail,
    password: rememberedPassword,
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const res = await api.post("/auth/login", values);
              if (!res.data.success) {
                setFieldError("password", res.data.message);
                return;
              }
              localStorage.setItem("token", res.data.data.token);

              if (remember) {
                localStorage.setItem("rememberedEmail", values.email);
                localStorage.setItem("rememberedPassword", values.password);
              } else {
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedPassword");
              }
              dispatch(checkAuth());
              dispatch(login(values));
              setTimeout(() => {
                navigate("/");
              }, 1200);
            } catch (error: any) {
              setFieldError(
                "password",
                error.response?.data?.message || "Login failed",
              );
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="relative bg-white dark:bg-gray-700 shadow-lg rounded-xl p-8 w-[350px] h-[500px] flex flex-col justify-around gap-5">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-5 right-5 bg-gray-200 dark:bg-gray-800 dark:text-white px-3 py-1 rounded"
              >
                {darkMode ? "Light" : "Dark"}
              </button>
              <h2 className="text-4xl dark:text-white font-bold text-center">
                Login
              </h2>

              <h3 className="text-xl dark:text-white font-bold text-center">
                Welcome Back!
              </h3>

              {/* Email */}
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                required
              />

              {/* Password */}
              <FormInput
                label="Password"
                name="password"
                type="password"
                showPassword={passwordModal.showPassword}
                onTogglePassword={() => passwordModal.togglePassword()}
                required
              />

              {/* Remember Me */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="dark:text-white">Remember Me</label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="flex justify-center">
                <Button type="submit" disabled={isSubmitting}>
                  Login
                </Button>
              </div>

              {/* New User Register Link */}
              <div className="text-center text-sm">
                <span className="dark:text-white">New User? </span>
                <Link
                  to="/register"
                  className="text-blue-500 hover:underline font-medium"
                >
                  Register now
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
