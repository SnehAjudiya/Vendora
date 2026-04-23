import { useEffect, useRef, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import FormInput from "../../../../common-components/FormInput";
import FormSelect from "../../../../common-components/FormSelect";
import Button from "../../../../common-components/Button";
import { UserRow, UserValues } from "./UserTable";
import useShowPassword from "../../../../hooks/useShowPassword";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  addUser,
  getUserById,
  updateUser,
} from "../../../../redux/slice/UsersSlice";
import CountryStateCity from "../../../../common-components/CountryStateCity";
import { RootState } from "../../../../redux/store/store";
import { X } from "lucide-react";
import useImagePopUpModal from "../../../../hooks/useImagePopUpModal";
import ImagePopup from "../../../../common-components/ImagePopUp";

export type CreateUserPayload = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  country: string;
  state: string;
  city: string;
  username: string;
  password: string;
  status: string;
  role: string;
  avatar: File | null;
  gallery: File[];
};

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Pending", value: "Pending" },
];

const ROLE_OPTIONS = [
  { label: "Admin", value: "Admin" },
  { label: "Vendor", value: "Vendor" },
  { label: "Customer", value: "Customer" },
];

export default function AddEditForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const passwordModal = useShowPassword();
  const imagePopUpModal = useImagePopUpModal();

  const [avatar, setAvatar] = useState<File | string>("");
  const [files, setFiles] = useState<(File | string)[]>([]);

  const [initialUser, setInitialUser] = useState<UserValues | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(isEditMode);

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

  useEffect(() => {
    if (id) {
      dispatch(getUserById(Number(id)));
    }
  }, [id]);

  const selectedUser = useAppSelector(
    (state: RootState) => state.users.selectedUser,
  );

  useEffect(() => {
    if (!isEditMode || !selectedUser) return;

    setInitialUser(selectedUser);
    setIsLoadingUser(false);

    if (selectedUser.avatar) {
      setAvatar(selectedUser.avatar);
    }

    if (selectedUser.gallery) {
      const cleaned = selectedUser.gallery.filter(
        (f: string | null) => f && f !== "null" && f.trim() !== "",
      );

      setFiles(cleaned);
    }
  }, [selectedUser]);

  const title = isEditMode ? "Edit User" : "Add User";

  const primaryButtonLabel = isEditMode ? "Update User" : "Create User";

  const initialValues: CreateUserPayload = initialUser
    ? {
        fullName: initialUser.fullName,
        email: initialUser.email,
        phone: initialUser.phone,
        gender: initialUser.gender,
        dob: initialUser.dob,
        address: initialUser.address,
        country: initialUser.country,
        state: initialUser.state,
        city: initialUser.city,
        username: initialUser.username,
        password: initialUser.password,
        status: initialUser.status,
        role: initialUser.role,
        avatar: null,
        gallery: [],
      }
    : {
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
        status: "",
        role: "",
        avatar: null,
        gallery: [],
      };

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
    password: isEditMode
      ? Yup.string()
      : Yup.string()
          .min(8, "Password must be at least 8 characters")
          .max(15, "Password must not exceed 15 characters")
          .matches(/[a-zA-Z]/, "Password must contain at least one letter")
          .matches(/[0-9]/, "Password must contain at least one number")
          .matches(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            "Password must contain at least one special character",
          )
          .required("Password is required"),
    status: Yup.string().required("Status is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleSubmit = async (
    values: CreateUserPayload,
    helpers: FormikHelpers<CreateUserPayload>,
  ) => {
    const { setSubmitting, setStatus, resetForm } = helpers;
    try {
      const formData = new FormData();

      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("dob", values.dob);
      formData.append("address", values.address);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("city", values.city);
      formData.append("username", values.username);
      if (!isEditMode || values.password) {
        formData.append("password", values.password);
      }
      formData.append("status", values.status);
      formData.append("role", values.role);

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }
      if (!(avatar instanceof File)) {
        formData.append("existing_avatar", avatar);
      }

      files
        .filter((f) => !(f instanceof File))
        .forEach((file) => formData.append("existing_gallery", file));

      files
        .filter((f) => f instanceof File)
        .forEach((file) => {
          formData.append("gallery", file);
        });

      if (isEditMode && initialUser) {
        await dispatch(updateUser({ id: initialUser.id, data: formData }));
        setStatus?.("User updated successfully");
      } else {
        await dispatch(addUser(formData));
        setStatus?.("User created successfully");
        resetForm();
      }

      navigate("/users");
    } catch (error: any) {
      setStatus?.(error.response?.data?.message || "Operation failed");
    }

    setSubmitting(false);
  };

  if (isLoadingUser) return <p className="text-center">Loading...</p>;
  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
      </div>

      <Formik<CreateUserPayload>
        enableReinitialize={isEditMode}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="bg-white dark:bg-gray-700 rounded-lg p-6 w-[1000px] flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* First Name */}
              <FormInput
                label="Fullname"
                name="fullName"
                type="text"
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

              <FormInput label="Address" name="address" type="text" required />

              <div className="md:col-span-3">
                <CountryStateCity />
              </div>

              <FormInput
                label="Username"
                name="username"
                type="text"
                required
              />

              {/* Password */}
              {!isEditMode && (
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  showPassword={passwordModal.showPassword}
                  onTogglePassword={() => passwordModal.togglePassword()}
                  required
                />
              )}

              <FormSelect
                label="Status"
                name="status"
                options={STATUS_OPTIONS}
                placeholder="Select status"
                required
              />
              <FormSelect
                label="Role"
                name="role"
                options={ROLE_OPTIONS}
                placeholder="Select role"
                required
              />
              {/* Profile Photo */}
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

                {avatar && (
                  <div
                    className="text-gray-500 text-sm hover:underline cursor-pointer"
                    onClick={() => {
                      const path =
                        avatar instanceof File
                          ? URL.createObjectURL(avatar)
                          : `http://localhost:5000/uploads/${avatar}`;

                      imagePopUpModal.confirmImagePopUp(path);
                    }}
                  >
                    {avatar instanceof File
                      ? avatar.name
                      : avatar.split("-").slice(1).join("-")}
                  </div>
                )}
              </div>
              {/* Gallery */}
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
                    const selectedFiles = Array.from(event.target.files || []);

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

                    const combined = [...files, ...validFiles];

                    setFiles(combined);
                    setFieldValue("gallery", combined);
                  }}
                />

                {galleryUploadInvalidText.show && (
                  <div className="text-red-500 text-sm">
                    {galleryUploadInvalidText.text}
                  </div>
                )}

                {files.map((file, index) => {
                  if (!file) return null;

                  const name =
                    file instanceof File
                      ? file.name
                      : file.split("-").slice(1).join("-");

                  const path =
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : `http://localhost:5000/uploads/${file}`;

                  return (
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
                          file && imagePopUpModal.confirmImagePopUp(path)
                        }
                      >
                        {name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-8 flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="py-2 text-sm font-medium"
              >
                {primaryButtonLabel}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/users")}
                className="py-2 text-sm font-medium"
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      {imagePopUpModal.showImagePopUpModal && (
        <ImagePopup
          item={imagePopUpModal.selected}
          onCancel={imagePopUpModal.cancelImagePopUp}
        />
      )}
    </div>
  );
}
