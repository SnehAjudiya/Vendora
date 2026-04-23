import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";

import FormInput from "../../common-components/FormInput";
import Button from "../../common-components/Button";
import FormSelect from "../../common-components/FormSelect";
import Checkbox from "../../common-components/Checkbox";
import CountryStateCity from "../../common-components/CountryStateCity";
import useShowPassword from "../../hooks/useShowPassword";
import api from "../../api/axios";
import useImagePopUpModal from "../../hooks/useImagePopUpModal";
import ImagePopup from "../../common-components/ImagePopUp";

export default function Register() {
  const [darkMode, setDarkMode] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const passwordModal = useShowPassword();
  const [files, setFiles] = useState<File[]>([]);
  const [avatar, setAvatar] = useState<File>();
  const ALLOWED_TYPES = ["image/jpg", "image/png", "image/jpeg"];
  const MAX_SIZE = 2 * 1024 * 1024;

  const [avatarUploadInvalidText, setAvatarUploadInvalidText] = useState({
    show: false,
    text: "",
  });
  const [galleryUploadInvalidText, setGalleryUploadInvalidText] = useState({
    show: false,
    text: "",
  });

  const imagePopUpModal = useImagePopUpModal();
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setAvatarUploadInvalidText({ show: false, text: "" });
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [avatarUploadInvalidText]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setGalleryUploadInvalidText({ show: false, text: "" });
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [galleryUploadInvalidText]);

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .required("Full name required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone Number is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.date()
      .typeError("Date of Birth must be a valid date")
      .required("Date of Birth is required"),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    username: Yup.string()
      .min(3, "username must be at least 3 characters")
      .required("username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must not exceed 15 characters")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must contain at least one special character",
      )
      .required("Password is required"),
    termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms"),
  });

  const initialValues = {
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    country: "",
    state: "",
    city: "",
    username: "",
    password: "",
    termsAccepted: false,
    avatar: null,
    gallery: [],
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-5 right-5 bg-gray-200 dark:bg-gray-800 dark:text-white px-3 py-1 rounded"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              const formData = new FormData();

              Object.keys(values).forEach((key) => {
                switch (key) {
                  case "avatar": {
                    if (values.avatar) formData.append("avatar", values.avatar);
                    return;
                  }
                  case "gallery": {
                    if (values.gallery) {
                      Array.from(values.gallery).forEach((file: any) =>
                        formData.append("gallery", file),
                      );
                    }
                    return;
                  }
                  default: {
                    formData.append(
                      key,
                      values[key as keyof typeof values] as any,
                    );
                  }
                }
              });

              const res = await api.post("/auth/register", formData);

              if (res.data.success) {
                setStatus("Account created successfully!");
                setTimeout(() => navigate("/login"), 1500);
              }
            } catch (error: any) {
              setStatus(error.response?.data?.message || "Registration failed");
            }
            setSubmitting(false);
          }}
        >
          {({ isValid, isSubmitting, setFieldValue }) => (
            <Form className="bg-white dark:bg-gray-700 rounded-lg p-6 w-[750px] flex flex-col gap-3">
              <h2 className="text-3xl dark:text-white font-bold text-center mb-1">
                Register
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
                <FormInput
                  label="Fullname"
                  name="fullName"
                  type="text"
                  placeholder=""
                  required
                />

                {/* Email */}
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="number"
                  placeholder="10 digits"
                  required
                />

                <FormSelect
                  label="Gender"
                  name="gender"
                  placeholder="Select Gender"
                  required
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                />

                <FormInput
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  required
                />

                <FormInput
                  label="Address"
                  name="address"
                  type="text"
                  required
                />

                <div className="md:col-span-2">
                  <CountryStateCity />
                </div>

                <FormInput
                  label="Username"
                  name="username"
                  type="text"
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

                <div className="flex flex-col gap-1">
                  <Button
                    onClick={() => avatarInputRef.current?.click()}
                    variant="secondary"
                    className="font-medium"
                  >
                    Profile Photo
                  </Button>
                  <input
                    name="avatar"
                    type="file"
                    ref={avatarInputRef}
                    placeholder="avatar"
                    className="hidden w-0 h-0"
                    onChange={(event: any) => {
                      const file = event.target.files[0];
                      if (!file) return;

                      if (!ALLOWED_TYPES.includes(file.type)) {
                        setAvatarUploadInvalidText({
                          show: true,
                          text: `${file.name} is not PNG/JPG/JPEG`,
                        });
                        event.target.value = "";
                        return;
                      }

                      if (file.size > MAX_SIZE) {
                        setAvatarUploadInvalidText({
                          show: true,
                          text: `${file.name} exceeds 2 MB`,
                        });
                        event.target.value = "";
                        return;
                      }

                      setAvatar(file);
                      setFieldValue("avatar", file);
                    }}
                  />

                  {avatarUploadInvalidText.show && (
                    <div className="text-red-500 text-sm">
                      {avatarUploadInvalidText.text}
                    </div>
                  )}

                  <div
                    className="text-gray-500 text-sm hover:underline hover:cursor-pointer"
                    onClick={() =>
                      avatar &&
                      imagePopUpModal.confirmImagePopUp(
                        URL.createObjectURL(avatar),
                      )
                    }
                  >
                    {avatar?.name}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    className="font-medium"
                    variant="secondary"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    Upload Files
                  </Button>

                  <input
                    name="gallery"
                    type="file"
                    placeholder="gallery"
                    ref={galleryInputRef}
                    className="hidden w-0 h-0"
                    multiple
                    onChange={(event) => {
                      const selectedFiles = Array.from(
                        event.target.files || [],
                      );

                      const validFiles = selectedFiles.filter((file) => {
                        if (!ALLOWED_TYPES.includes(file.type)) {
                          setGalleryUploadInvalidText({
                            show: true,
                            text: `${file.name} is not PNG/JPG/JPEG`,
                          });

                          return false;
                        }

                        if (file.size > MAX_SIZE) {
                          setGalleryUploadInvalidText({
                            show: true,
                            text: `${file.name} exceeds 2 MB`,
                          });
                          return false;
                        }

                        return true;
                      });

                      setFiles((prev) => {
                        const combined = [...prev, ...validFiles];
                        setFieldValue("gallery", combined);
                        return combined;
                      });
                    }}
                  />

                  {galleryUploadInvalidText.show && (
                    <div className="text-red-500 text-sm">
                      {galleryUploadInvalidText.text}
                    </div>
                  )}

                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="text-gray-500 text-sm flex items-center align-center gap-1 ml-5 px-5 py-0.5 hover:bg-gray-100 rounded-full"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const updated = files.filter((_, i) => i !== index);

                          setFiles(updated);
                          setFieldValue("gallery", updated);
                        }}
                        className="rounded-full text-sm font-bold text-red-600 h-4 w-4 flex justify-center items-center"
                      >
                        <X />
                      </button>
                      <div
                        className="text-gray-500 text-sm hover:underline hover:cursor-pointer"
                        onClick={() =>
                          file &&
                          imagePopUpModal.confirmImagePopUp(
                            URL.createObjectURL(file),
                          )
                        }
                      >
                        {file?.name}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Checkbox
                    label="I accept the terms and Conditions"
                    name="termsAccepted"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

              <div className="text-center text-xs mt-1">
                <span className="dark:text-white">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="text-blue-500 hover:underline font-medium"
                >
                  Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {imagePopUpModal.showImagePopUpModal && (
        <ImagePopup
          item={imagePopUpModal.selected}
          onCancel={imagePopUpModal.cancelImagePopUp}
        />
      )}
    </div>
  );
}
